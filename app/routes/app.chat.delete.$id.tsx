import { type ActionArgs } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";

export async function action({ params }: ActionArgs) {
  if (!params.id) throw new Error("No id provided");
  await prisma.stickyNote.delete({
    where: {
      id: params.id,
    },
  });
  return null;
}
