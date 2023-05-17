import { redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import type { FC } from "react";
import { getRecipeById } from "~/utils/recipes.server";

export async function loader({ params }: LoaderArgs) {
  const { id } = params;
  if (!id) redirect("/app/recipes");
  const recipe = await getRecipeById(id!);
  if (!recipe) redirect("/app/recipes");
  return recipe;
}
type ContextType = Awaited<ReturnType<typeof loader>>;
const RecipeLayout: FC = () => {
  const recipe = useLoaderData<ContextType>();
  return <Outlet context={recipe} />;
};

export const useRecipe = () => {
  return useOutletContext<ContextType>();
};

export default RecipeLayout;
