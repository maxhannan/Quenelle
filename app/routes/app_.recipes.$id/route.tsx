import { redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useMatches,
  useOutletContext,
} from "@remix-run/react";
import type { FC } from "react";
import { getRecipeById, getRecipes } from "~/utils/recipes.server";
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
};
const RecipeLayout: FC = () => {
  const recipe = useLoaderData<typeof loader>();

  return <Outlet context={{ recipe }} />;
};

export const useRecipe = () => {
  return useOutletContext<ContextType>();
};

export default RecipeLayout;
