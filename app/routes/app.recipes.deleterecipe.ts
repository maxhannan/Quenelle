import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { deleteRecipe } from "~/utils/recipes.server";

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const id = data.get("id") as string;
  await deleteRecipe(id);
  const dish = data.get("dish") as string;
  if (dish && dish.length > 0) {
    return redirect(`/app/menus?section=Dishes`);
  }
  return redirect("/app/recipes");
};
