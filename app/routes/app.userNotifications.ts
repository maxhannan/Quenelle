import { type ActionArgs } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";

export async function action({ request, params }: ActionArgs) {
  const data = await request.formData();
  const userId = data.get("userId") as string;
  if (!userId) return null;
  await prisma.user.update({
    where: { id: userId },
    data: {
      lastLogin: new Date(),
    },
  });
  return null;
}
