import type { LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";

import { getFilteredRecipes } from "~/utils/filterRecipes";

import { getRecipes } from "~/utils/recipes.server";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);

  const search = params.get("search");
  const category = params.get("category");
  const allergies = params.get("allergies");
  const allergyArr = allergies && allergies.length ? allergies.split(",") : [];

  const recipes = await getRecipes();
  return {
    recipes,
    filteredRecipes: getFilteredRecipes(recipes, search, category, allergyArr),
    categories: [...new Set(recipes!.map((r) => r.category))],
  };
}

type ContextType = Awaited<ReturnType<typeof loader>>;

const RecipesLayout = () => {
  const { recipes, filteredRecipes, categories } = useLoaderData<ContextType>();

  return <Outlet context={{ recipes, filteredRecipes, categories }} />;
};

export default RecipesLayout;

export function useRecipes() {
  return useOutletContext<ContextType>();
}
