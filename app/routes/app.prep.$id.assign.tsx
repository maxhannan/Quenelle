import { type ActionArgs } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";

export async function action({ request, params }: ActionArgs) {
  const data = await request.formData();

  const assignedToId = data.get("assignedToId") as string;

  if (!assignedToId || assignedToId.length === 0) {
    console.log("noid");
    await prisma.prepList.update({
      where: {
        id: params.id,
      },
      data: {
        assignedTo: {
          disconnect: true,
        },
      },
    });
  } else {
    console.log({ assignedToId });
    await prisma.prepList.update({
      where: {
        id: params.id,
      },
      data: {
        assignedTo: {
          connect: {
            id: assignedToId,
          },
        },
      },
    });
  }
  return null;
}
