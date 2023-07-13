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

import { getUser } from "~/utils/auth.server";
import ColorButton from "~/components/buttons/ColorButton";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);

  const search = params.get("search");
  const category = params.get("category");
  const allergies = params.get("allergies");
  const allergyArr = allergies && allergies.length ? allergies.split(",") : [];
  const user = await getUser(request);
  const recipes = await getRecipes({
    all: false,
    teamid: user!.teams.map((t) => t.id),
  });
  return {
    user,
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
  user: Awaited<ReturnType<typeof loader>>["user"];
};

const RecipesLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const allergyParam = searchParams.get("allergies");
  const searchquery = searchParams.get("search");
  const location = useLocation();
  const navigation = useNavigation();

  const searchLoading =
    navigation.state === "loading" &&
    navigation.location.search !== location.search;
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const allergyParam = searchParams.get("allergies");
    const searchquery = searchParams.get("search");
    setSearchValues({
      searchValue: searchquery || "",
      category: categoryParam || null,
      allergies: allergyParam?.split(",") || [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

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

  const { user, recipes, filteredRecipes, categories } =
    useLoaderData<typeof loader>();

  const navigate = useNavigate();

  return (
    <div className="flex">
      <div className="relative xl:w-1/3 2xl:w-1/4 border-r dark:border-zinc-800 h-screen bg-zinc-100  dark:bg-zinc-900 overflow-y-scroll flex-none hidden xl:flex scrollbar-none scrollbar-track-zinc-100 dark:scrollbar-track-zinc-900 scrollbar-thumb-zinc-600 dark:scrollbar-thumb-zinc-500 scrollbar-thumb-rounded-2xl">
        <div className=" w-full pr-3 pl-2 ">
          <div className="grid grid-cols-1   ">
            <div>
              <div className=" ">
                <NewAppBar page={"Recipes"}>
                  {user!.role !== "cook" && (
                    <ColorButton
                      color="indigo"
                      type="button"
                      onClick={() => navigate("addrecipe")}
                    >
                      <PlusIcon className="h-5 w-5" />
                      Add Recipe
                    </ColorButton>
                  )}
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
            {navigation.state === "loading" && searchLoading ? (
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
      <div className="w-full xl:h-screen xl:overflow-y-scroll scrollbar-none">
        <Outlet
          context={{
            recipes,
            filteredRecipes,
            categories,
            changeSearchValues,
            searchValues,
            user,
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
