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
        select: {
          firstName: true,
          lastName: true,
          username: true,
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
