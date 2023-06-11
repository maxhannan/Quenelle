import { useRecipes } from "../app.recipes/route";
import {
  useNavigate,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import Spinner from "~/components/LoadingSpinner";
import RecipeFeed from "./components/RecipeFeed";

import SearchAndFilter from "./components/SearchAndFilter";
import NewAppBar from "~/components/navigation/NewAppBar";
import FadeIn from "~/components/animations/FadeIn";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

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
    </FadeIn>
  );
}
