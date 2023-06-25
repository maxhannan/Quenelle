import { useRecipes } from "../app.recipes/route";
import { useNavigate, useNavigation, useSearchParams } from "@remix-run/react";
import Spinner from "~/components/LoadingSpinner";
import RecipeFeed from "./components/RecipeFeed";

import SearchAndFilter from "./components/SearchAndFilter";
import NewAppBar from "~/components/navigation/NewAppBar";
import FadeIn from "~/components/animations/FadeIn";
import { PlusIcon } from "lucide-react";

export default function RecipesIndex() {
  const {
    recipes,
    filteredRecipes,
    categories,
    searchValues,
    changeSearchValues,
  } = useRecipes();
  const navigation = useNavigation();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const pageChangeLoading =
    navigation.state === "loading" &&
    navigation.location.pathname !== "/app/recipes";

  if (navigation.state === "loading" && pageChangeLoading) {
    return (
      <div className=" mx-auto h-screen  flex items-center justify-center">
        <Spinner size={14} />
      </div>
    );
  }

  return (
    <FadeIn>
      <div className=" h-screen w-full  items-center justify-center text-2xl text-zinc-800 dark:text-zinc-200 hidden xl:flex ">
        <h1>Select A Recipe</h1>
      </div>
      <div className=" w-full xl:hidden  container mx-auto">
        <div className="grid grid-cols-1   ">
          <div className="fixed left-0 top-0 z-50 bg-zinc-100 shadow-sm w-full pb-2 px-2">
            <div className=" ">
              <NewAppBar page={"Recipes"}>
                <button
                  onClick={() => navigate("addrecipe")}
                  className=" font-light  bg-indigo-500 rounded-xl text-zinc-100 px-2 py-2 text-sm hover:bg-opacity-90 transition-all duration-300 inline-flex gap-1 items-center "
                >
                  <PlusIcon className="h-5 w-5" /> Add Recipe
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
            <div className="pb-1 py-2  scrollbar-none mt-28">
              {recipes && <RecipeFeed recipes={filteredRecipes} />}
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
