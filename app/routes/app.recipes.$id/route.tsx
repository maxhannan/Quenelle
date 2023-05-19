import { redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import type { FC } from "react";
import { getRecipeById } from "~/utils/recipes.server";
import { useRecipes } from "../app.recipes/route";

export async function loader({ params }: LoaderArgs) {
  const { id } = params;
  if (!id) redirect("/app/recipes");
  const recipe = await getRecipeById(id!);
  if (!recipe) redirect("/app/recipes");
  return recipe;
}
type ContextType = {
  recipe: Awaited<ReturnType<typeof loader>>;
  recipes: ReturnType<typeof useRecipes>["recipes"];
  categories: ReturnType<typeof useRecipes>["categories"];
};
const RecipeLayout: FC = () => {
  const recipe = useLoaderData<ContextType>();
  const { recipes, categories } = useRecipes();
  return <Outlet context={{ recipe, recipes, categories }} />;
};

export const useRecipe = () => {
  return useOutletContext<ContextType>();
};

export default RecipeLayout;
