import { createCookieSessionStorage, json, redirect } from "@remix-run/node";
import { createUser } from "./user.server";
import type { UserObj } from "./user.server";
import { prisma } from "./prisma.server";
import bcrypt from "bcryptjs";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "quenelle-session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export const Register = async (user: UserObj) => {
  const existsEmail = await prisma.user.count({ where: { email: user.email } });
  const existsUsername = await prisma.user.count({
    where: { username: user.username },
  });
  if (existsEmail) {
    return json(
      { errors: { email: `User already exists with that email` } },
      { status: 400 }
    );
  }
  if (existsUsername) {
    return json(
      { errors: { username: `User already exists with that username` } },
      { status: 400 }
    );
  }
  const newUser = await createUser(user);
  if (!newUser) {
    return json(
      {
        error: `Something went wrong trying to create a new user.`,
        fields: { username: user.username, password: user.password },
      },
      { status: 400 }
    );
  }
  return createUserSession(newUser.id, `/setup/${newUser.id}`);
};

export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return json({ error: { form: `Incorrect login` } }, { status: 400 });

  return createUserSession(user.id, "/app/recipes");
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
      },
    });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function createTeam(
  userId: string,
  teamData: { name: string; city: string; state: string }
) {
  const team = await prisma.team.create({
    data: {
      ...teamData,
    },
  });
  await prisma.user.update({
    where: { id: userId },
    data: {
      teams: {
        connect: {
          id: team.id,
        },
      },
    },
  });
  return team;
}
