import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { deleteRecipe } from "~/utils/recipes.server";

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const id = data.get("id") as string;
  await deleteRecipe(id);
  return redirect("/app/recipes");
};
