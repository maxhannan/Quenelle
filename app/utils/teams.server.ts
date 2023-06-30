import { getUser } from "./auth.server";
import { prisma } from "./prisma.server";

export async function getMembers(request: Request) {
  const user = await getUser(request);
  const teams = await prisma.team.findMany({
    where: {
      members: {
        some: {
          id: user!.id,
        },
      },
    },
    select: {
      name: true,
      id: true,
      city: true,
      state: true,

      members: {
        orderBy: [
          {
            approved: "asc",
          },
          {
            role: "desc",
          },
          {
            firstName: "asc",
          },
        ],

        select: {
          firstName: true,
          lastName: true,
          username: true,
          colorVariant: true,
          role: true,
          teams: {
            select: {
              name: true,
              id: true,
            },
          },
          email: true,
          id: true,
          approved: true,
          chef: true,
          orgOwner: true,
        },
      },
    },
  });
  return teams;
}

export async function getMember(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      firstName: true,
      lastName: true,
      username: true,
      colorVariant: true,
      role: true,
      teams: {
        select: {
          name: true,
          id: true,
        },
      },
      email: true,
      id: true,
      approved: true,
      chef: true,
      orgOwner: true,
    },
  });
  return user;
}
