import { ActionArgs, redirect } from "@remix-run/node";
import { getUser, joinTeam } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";

export async function action({ request }: ActionArgs) {
  const user = await getUser(request);
  if (!user) {
    return redirect("/login");
  }
  const data = await request.formData();
  const teamId = data.get("teamId");
  const team = await prisma.team.findUnique({
    where: {
      id: teamId as string,
    },
    select: {
      id: true,
    },
  });
  if (team) {
    await joinTeam(user.id, team.id);
  }
  return redirect("/pending");
}
