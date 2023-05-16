import { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { useDataFromLoader } from "~/hooks/useDataFromLoader";

import { getRecipes } from "~/utils/recipes.server";

export async function loader(args: LoaderArgs) {
  const recipes = await getRecipes();
  return { recipes, categories: [...new Set(recipes!.map((r) => r.category))] };
}

type ContextType = Awaited<ReturnType<typeof loader>>;

const RecipesLayout = () => {
  const { recipes, categories } = useLoaderData<ContextType>();

  return <Outlet context={{ recipes, categories }} />;
};

export default RecipesLayout;

export function useRecipes() {
  return useOutletContext<ContextType>();
}
