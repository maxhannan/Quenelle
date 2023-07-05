import { redirect, type ActionArgs } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";

export async function action({ request, params }: ActionArgs) {
  const { id } = params;
  try {
    await prisma.prepList.delete({
      where: {
        id,
      },
    });
    return redirect(`/app/prep`);
  } catch (e) {
    console.log(e);
    return null;
  }
}
