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
    <div className="grid  xl:grid-cols-12  ">
      <div className=" col-span-3 gap-2 hidden xl:grid overflow-hidden xl:h-screen px-3  bg-zinc-200 dark:bg-zinc-800">
        <div>
          <div className=" ">
            <AppBar page={"Recipes"}>
              <IconButton
                onClick={() => navigate("/app/recipes/addrecipe")}
                Icon={DocumentPlusIcon}
                name="Add Recipe"
              />
              <IconButton
                onClick={() =>
                  submit(null, { action: "/logout", method: "post" })
                }
                Icon={UserIcon}
                name="Logout"
              />
            </AppBar>
          </div>

          <div className=" ">
            <SearchAndFilter
              categories={categories}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </div>
        </div>
        {navigation.state === "loading" && !pageChangeLoading ? (
          <div className="flex h-screen justify-center mt-12">
            <Spinner size={12} />
          </div>
        ) : (
          <div className="h-[90vh]  overflow-y-scroll dark:scrollbar-track-zinc-900 scrollbar-track-zinc-200 scrollbar-thin scrollbar-rounded-2xl dark:scrollbar-thumb-zinc-700 scrollbar-thumb-zinc-400  scrollbar-thumb-rounded pr-3">
            {recipes && <RecipeFeed recipes={filteredRecipes} />}
          </div>
        )}
      </div>
      <div className="pb-1 py-2 col-span-9  xl:h-screen  xl:px-4  xl:overflow-hidden scrollbar-track-zinc-800  scrollbar-thin scrollbar-rounded-2xl scrollbar-thumb-zinc-700 scrollbar-thumb-rounded  ">
        <Outlet context={{ recipes, filteredRecipes, categories }} />
      </div>
    </div>
  );
};

export default RecipesLayout;

export function useRecipes() {
  return useOutletContext<ContextType>();
}
