import { redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import type { FC } from "react";
import { getUser } from "~/utils/auth.server";
import { getRecipeById } from "~/utils/recipes.server";

export async function loader({ request, params }: LoaderArgs) {
  const { id } = params;
  const user = await getUser(request);
  if (!id) redirect("/app/recipes");
  const recipe = await getRecipeById(id!);

  if (!recipe) redirect("/app/recipes");

  return { recipe, user };
}
type ContextType = {
  recipe: Awaited<ReturnType<typeof getRecipeById>>;
  user: Awaited<ReturnType<typeof getUser>>;
};
const RecipeLayout: FC = () => {
  const { recipe, user } = useLoaderData<typeof loader>();

  return <Outlet context={{ recipe, user }} />;
};

export const useRecipe = () => {
  return useOutletContext<ContextType>();
};

export default RecipeLayout;
