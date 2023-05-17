import { FC, useState } from "react";
import { useRecipe } from "../app.recipes.$id/route";

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
import { Link, useNavigate, useNavigation } from "@remix-run/react";
import Chip from "~/components/display/Chipt";
import IngredientTable from "./components/IngredientTable";
import Spinner from "~/components/LoadingSpinner";

const RecipeIndex: FC = () => {
  const recipe = useRecipe();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();
  if (!recipe) return <NoRecipeFound />;

  if (navigation.state === "loading") {
    return (
      <div className="h-screen  flex items-center justify-center">
        <Spinner size={14} />
      </div>
    );
  }

  return (
    <main className="mb-28">
      <AppBar page="">
        <IconButton
          Icon={PencilIcon}
          name="Edit Recipe"
          onClick={() => console.log("edit")}
        />
        <IconButton
          Icon={PhotoIcon}
          name="Open Gallery"
          onClick={() => console.log("edit")}
        />
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
      <div className="text-3xl border border-neutral-300 dark:border-neutral-700 gap-3 bg-neutral-200 dark:bg-neutral-800 px-4 w-full mb-2 items-center flex justify-between dark:text-neutral-200 p-4  text-neutral-600 rounded-xl font-light ">
        <div>{recipe!.name}</div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-2">
        <div className="flex flex-col gap-2">
          {recipe.allergens.length > 0 && (
            <div className="inline-flex  gap-2 flex-wrap rounded-xl bg-neutral-100 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 p-2 ">
              {recipe.allergens.map((a, i) => (
                <Chip content={a} key={i} />
              ))}
            </div>
          )}
          <IngredientTable ingredients={recipe.ingredients} />
          <div className="text-lg  bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-3  items-center flex gap-4 justify-between dark:text-neutral-200 p-4 mb-2 text-neutral-700 rounded-xl font-light ">
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
                className=" flex items-center gap-2 border  border-violet-500 cursor-pointer hover:border-neutral-700 hover:text-neutral-700 hover:dark:border-neutral-200 hover:dark:text-neutral-200 p-2 px-4 rounded-xl font-light  text-lg text-violet-700 dark:text-violet-500 "
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
                className=" border border-neutral-300 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-800  bg-opacity-50 dark:bg-opacity-50 transition-all duration-300 rounded-xl p-4 text-lg text-neutral-700 dark:text-neutral-100"
              >
                <h5 className="text-xl mb-2">Step {i + 1}</h5>
                <p className="text-lg font-light ">{s}</p>
              </div>
            ))}

          {recipe!.linkedIngredients.length > 0 && (
            <div className="text-xl bg-neutral-100 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200  p-4  text-neutral-700 rounded-xl font-light ">
              Component of
              <div className="flex gap-3 flex-wrap r mt-2">
                {recipe!.linkedIngredients.map((li) => (
                  <div key={li.recipe.id}>
                    <Link
                      to={
                        li.recipe.dish === true
                          ? `/app/menus/dishes/${li.recipe.id}`
                          : `/app/recipes/${li.recipe.id}`
                      }
                    >
                      <div className=" flex items-center gap-2  bg-violet-500 hover:bg-violet-600 p-2 px-4 rounded-xl font-light  text-base text-neutral-100 dark:text-neutral-100 ">
                        {li.recipe.name}{" "}
                        <ArrowLongRightIcon className="w-5 h-5" />
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="text-2xl bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 p-4  text-neutral-700 rounded-xl font-light  ">
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
    </main>
  );
};

export default RecipeIndex;
