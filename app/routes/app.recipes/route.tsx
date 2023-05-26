import { DocumentPlusIcon, UserIcon } from "@heroicons/react/24/outline";
import type { LoaderArgs } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useNavigation,
  useOutletContext,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";

import IconButton from "~/components/buttons/IconButton";
import AppBar from "~/components/navigation/AppBar";

import { getFilteredRecipes } from "~/utils/filterRecipes";

import { getRecipes } from "~/utils/recipes.server";
import RecipeFeed from "../app.recipes._index/components/RecipeFeed";
import SearchAndFilter from "../app.recipes._index/components/SearchAndFilter";
import Spinner from "~/components/LoadingSpinner";

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
    categories: recipes ? [...new Set(recipes.map((r) => r.category))] : [],
  };
}

type ContextType = Awaited<ReturnType<typeof loader>>;

const RecipesLayout = () => {
  const { recipes, filteredRecipes, categories } = useLoaderData<ContextType>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageChangeLoading =
    navigation.state === "loading" &&
    navigation.location.pathname !== "/app/recipes";
  return (
    <Outlet
      context={{
        recipes,
        filteredRecipes,
        categories,
      }}
    />
  );
};

export default RecipesLayout;

export function useRecipes() {
  return useOutletContext<ContextType>();
}
