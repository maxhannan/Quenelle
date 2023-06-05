import type { LoaderArgs } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import NewAppBar from "~/components/navigation/NewAppBar";

import { getFilteredRecipes } from "~/utils/filterRecipes";

import { getRecipes } from "~/utils/recipes.server";
import SearchAndFilter from "../app.recipes._index/components/SearchAndFilter";
import Spinner from "~/components/LoadingSpinner";
import RecipeFeed from "../app.recipes._index/components/RecipeFeed";
import BottomNav from "~/components/navigation/BottomNav";

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

type ContextType = {
  recipes: Awaited<ReturnType<typeof loader>>["recipes"];
  filteredRecipes: Awaited<ReturnType<typeof loader>>["filteredRecipes"];
  categories: Awaited<ReturnType<typeof loader>>["categories"];
  searchValues: {
    searchValue: string;
    category: string | null;
    allergies: string[];
  };
  changeSearchValues: ({
    field,
    value,
  }: {
    field: "searchValue" | "category" | "allergies";
    value: string | string[] | null;
  }) => void;
};

const RecipesLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const allergyParam = searchParams.get("allergies");
  const searchquery = searchParams.get("search");
  const location = useLocation();
  const navigation = useNavigation();
  const pageChangeLoading =
    navigation.state === "loading" &&
    navigation.location.pathname !== "/app/recipes";
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const allergyParam = searchParams.get("allergies");
    const searchquery = searchParams.get("search");
    setSearchValues({
      searchValue: searchquery || "",
      category: categoryParam || null,
      allergies: allergyParam?.split(",") || [],
    });
  }, [location.search]);
  const [searchValues, setSearchValues] = useState({
    searchValue: searchquery || "",
    category: categoryParam || null,
    allergies: allergyParam?.split(",") || [],
  });

  function changeSearchValues({
    field,
    value,
  }: {
    field: "searchValue" | "category" | "allergies";
    value: string | string[] | null;
  }) {
    console.log({ field, value });
    setSearchValues({
      ...searchValues,
      [field]: value,
    });
  }

  const { recipes, filteredRecipes, categories } =
    useLoaderData<typeof loader>();

  const navigate = useNavigate();

  return (
    <div className="flex">
      <div className="relative w-1/4 h-screen bg-zinc-50 dark:bg-zinc-950 overflow-y-scroll flex-none hidden lg:flex scrollbar-thin scrollbar-track-zinc-100 dark:scrollbar-track-zinc-900 scrollbar-thumb-zinc-600 dark:scrollbar-thumb-zinc-500 scrollbar-thumb-rounded-2xl">
        <div className=" w-full px-3">
          <div className="grid grid-cols-1   ">
            <div>
              <div className=" ">
                <NewAppBar page={"Recipes"}>
                  <button
                    onClick={() => navigate("addrecipe")}
                    className="bg-zinc-300 bg-opacity-40 text-zinc-800 dark:bg-zinc-800 dark:bg-opacity-40 rounded-2xl dark:text-zinc-200 px-3 py-3 font-extralight hover:bg-opacity-90 transition-all duration-300 inline-flex gap-2 items-center "
                  >
                    <PlusIcon className="h-5 w-5" /> Add A Recipe
                  </button>
                </NewAppBar>
              </div>

              <div className=" ">
                <SearchAndFilter
                  categories={categories}
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                  searchValues={searchValues}
                  changeSearchValues={changeSearchValues}
                />
              </div>
            </div>
            {navigation.state === "loading" && !pageChangeLoading ? (
              <div className="flex h-screen justify-center mt-12">
                <Spinner size={12} />
              </div>
            ) : (
              <div className="pb-1 py-2  scrollbar-none ">
                {recipes && <RecipeFeed recipes={filteredRecipes} />}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full lg:h-screen lg:overflow-y-scroll scrollbar-none">
        <Outlet
          context={{
            recipes,
            filteredRecipes,
            categories,
            changeSearchValues,
            searchValues,
          }}
        />
      </div>
    </div>
  );
};

export default RecipesLayout;

export function useRecipes() {
  return useOutletContext<ContextType>();
}
