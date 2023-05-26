import { useRecipes } from "../app.recipes/route";
import {
  useNavigate,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import Spinner from "~/components/LoadingSpinner";
import RecipeFeed from "./components/RecipeFeed";

import AppBar from "~/components/navigation/AppBar";
import IconButton from "~/components/buttons/IconButton";
import { DocumentPlusIcon, UserIcon } from "@heroicons/react/24/outline";
import SearchAndFilter from "./components/SearchAndFilter";

export default function RecipesIndex() {
  const { recipes, filteredRecipes, categories } = useRecipes();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const submit = useSubmit();
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
    <>
      <div className=" container mx-auto max-w-3xl ">
        <div className="grid grid-cols-1   ">
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
            <div className="pb-1 py-2  scrollbar-none ">
              {recipes && <RecipeFeed recipes={filteredRecipes} />}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
