import { DocumentPlusIcon, UserIcon } from "@heroicons/react/24/outline";
import type { LoaderArgs } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import Spinner from "~/components/LoadingSpinner";
import IconButton from "~/components/buttons/IconButton";
import AppBar from "~/components/navigation/AppBar";

import { getFilteredRecipes } from "~/utils/filterRecipes";

import { getRecipes } from "~/utils/recipes.server";
import RecipeFeed from "../app.recipes._index/components/RecipeFeed";
import SearchAndFilter from "../app.recipes._index/components/SearchAndFilter";

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
  const submit = useSubmit();
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div className="grid  xl:grid-cols-12  ">
      <div className=" col-span-3 gap-2 hidden xl:grid overflow-none max-h-screen p-4 scrollbar-none">
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

        <div className="min-h-[85vh] overflow-scroll scrollbar-none">
          {recipes && <RecipeFeed recipes={filteredRecipes} />}
        </div>
      </div>
      <div className="pb-1 py-2 col-span-9  xl:h-screen xl:max-h-screen xl:p-4 overflow-hidden scrollbar-none ">
        <Outlet context={{ recipes, filteredRecipes, categories }} />
      </div>
    </div>
  );
};

export default RecipesLayout;

export function useRecipes() {
  return useOutletContext<ContextType>();
}
