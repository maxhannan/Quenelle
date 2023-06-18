import { useState } from "react";
import type { FC } from "react";

import NoRecipeFound from "./components/NoRecipeFound";
import AppBar from "~/components/navigation/AppBar";
import IconButton from "~/components/buttons/IconButton";
import {
  ArrowLongRightIcon,
  ArrowUturnLeftIcon,
  PencilIcon,
  PhotoIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import {
  Link,
  useLocation,
  useMatches,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import Chip from "~/components/display/Chip";
import IngredientTable from "./components/IngredientTable";
import Spinner from "~/components/LoadingSpinner";
import Carousel from "~/components/display/Carousel";
import { useRecipe } from "../app.recipes.$id/route";
import SlideUpTransition from "~/components/animations/SlideUp";

const RecipeIndex: FC = () => {
  const { recipe } = useRecipe();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();
  const location = useLocation();
  console.log(useMatches());
  if (!recipe) return <NoRecipeFound />;
  const pageChangeLoading =
    (navigation.state === "loading" &&
      navigation.location.pathname.includes("edit")) ||
    (navigation.state === "loading" &&
      !(navigation.location.pathname === location.pathname));

  console.log(
    { pageChangeLoading },
    navigation.location,
    navigation.location?.pathname,
    location.pathname,
    navigation.location?.pathname === location.pathname
  );
  if (navigation.state === "loading" && pageChangeLoading) {
    return (
      <div className="h-screen  flex items-center justify-center">
        <Spinner size={14} />
      </div>
    );
  }

  return (
    <>
      <AppBar page="">
        <IconButton
          Icon={PencilIcon}
          name="Edit Recipe"
          onClick={() => navigate("edit", { replace: true })}
        />
        {recipe.images.length > 0 && (
          <IconButton
            Icon={PhotoIcon}
            name="Open Gallery"
            onClick={() => setIsOpen(!isOpen)}
          />
        )}

        <IconButton
          Icon={ScaleIcon}
          name="Scale Recipe"
          onClick={() => console.log("edit")}
        />
        <IconButton
          Icon={ArrowUturnLeftIcon}
          name="Go Back"
          onClick={() => navigate(-1)}
        />
      </AppBar>
      <main className="pb-32 container mx-auto xl:pl-2">
        {recipe.images.length > 0 && (
          <Carousel
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            imgSrcs={recipe!.images}
          />
        )}
        <SlideUpTransition>
          <div className="text-3xl md:text-4xl   w-full items-center flex pl-1 justify-between mb-2  dark:text-neutral-200  font-bold text-neutral-600 rounded-xl ">
            <div>{recipe.name}</div>
          </div>
          <div className="grid grid-cols-1 gap-x-2 ">
            <div className="flex flex-col gap-2 mb-1">
              {recipe.allergens.length > 0 && (
                <div className="inline-flex  gap-2 flex-wrap ">
                  {recipe.allergens.map((a, i) => (
                    <Chip content={a} key={i} />
                  ))}
                </div>
              )}
              <IngredientTable ingredients={recipe.ingredients} />
              <div className="text-lg bg-zinc-200 dark:bg-zinc-950   px-3  items-center flex gap-4 justify-between dark:text-neutral-200 p-4 mb-2 text-neutral-700 rounded-xl font-light ">
                <div>
                  {" "}
                  <b>Yields: </b>
                  {recipe?.yieldAmt + " " + recipe?.yieldUnit}{" "}
                </div>
                <div>
                  <div
                    onClick={() =>
                      navigate(`/app/recipes?category=${recipe.category}`)
                    }
                    className=" flex items-center gap-2 border font-bold border-indigo-500 cursor-pointer hover:border-neutral-700 hover:text-neutral-700 hover:dark:border-neutral-200 hover:dark:text-neutral-200 p-2 px-4 rounded-xl text-lg text-indigo-500 dark:text-indigo-500 "
                  >
                    {recipe.category} <ArrowLongRightIcon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {recipe!.steps.length > 0 &&
                recipe.steps.map((s, i) => (
                  <div
                    key={i}
                    className=" border border-neutral-300 dark:border-neutral-700    transition-all duration-300 rounded-xl p-4 text-lg text-neutral-700 dark:text-neutral-100"
                  >
                    <h5 className="text-2xl mb-2">Step {i + 1}</h5>
                    <p className="text-lg font-light ">{s}</p>
                  </div>
                ))}

              {recipe!.linkedIngredients.length > 0 && (
                <div className="text-2xl bg-zinc-200  border-neutral-200 dark:bg-zinc-950 dark:text-zinc-200 px-3 p-4  text-zinc-700 rounded-xl  ">
                  Component of
                  <div className="flex gap-3 flex-wrap  mt-3">
                    {recipe!.linkedIngredients.map((li) => (
                      <div key={li.recipe.id}>
                        <Link
                          to={
                            li.recipe.dish === true
                              ? `/app/menus/dishes/${li.recipe.id}`
                              : `/app/recipes/${li.recipe.id}`
                          }
                        >
                          <div className=" flex items-center gap-2 border border-indigo-500 hover:bg-indigo-600 hover:text-zinc-200 p-2 px-3 font-bold  rounded-xl  text-base text-indigo-500 dark:text-indigo-500 ">
                            {li.recipe.name}{" "}
                            <ArrowLongRightIcon className="w-5 h-5" />
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="text-2xl bg-indigo-300 dark:bg-indigo-300 dark:text-zinc-700 p-4  text-zinc-700 rounded-xl font-light  ">
                <div>
                  <b>Author: </b>
                  {recipe.author?.firstName + " " + recipe.author?.lastName}
                </div>
                <div className="flex gap-2 flex-wrap  mt-2 text-lg ">
                  <div>
                    <b>Added: </b>
                    {new Date(recipe.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <b>Updated: </b>
                    {new Date(recipe.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SlideUpTransition>
      </main>
    </>
  );
};

export default RecipeIndex;
