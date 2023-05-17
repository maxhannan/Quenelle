import { useState } from "react";
import type { FC } from "react";
import type { FullRecipes } from "~/utils/recipes.server";
import { v4 } from "uuid";
import { PlusIcon } from "@heroicons/react/24/outline";
import IngredientAdder from "./IngredientAdder";
interface Props {
  ingredients?: FormIngredient[];
  recipes: FullRecipes;
}

export interface FormIngredient {
  id: string;
  ingredient: string;
  qty: string | undefined;
  unit: string | undefined;
  linkId: string | null;
  linkRecipe: { id: string; value: string } | null;
  recipeId?: string;
}

const IngredientsSection: FC<Props> = ({ ingredients, recipes }) => {
  const recipeArr =
    ingredients && ingredients.length > 0 && ingredients[0].recipeId
      ? recipes!.filter((r) => r.id !== ingredients[0].recipeId)
      : recipes;
  const [ingredientsArr, setIngredientsArr] = useState(
    ingredients ? ingredients : []
  );
  const addIngredient = () => {
    const newIngredient = {
      id: v4(),
      ingredient: "",
      qty: undefined,
      unit: undefined,
      linkId: null,
      linkRecipe: null,
    };
    setIngredientsArr([...ingredientsArr, newIngredient]);
  };

  const handleDelete = (id: string) => {
    const newIngredients = ingredientsArr.filter((i) => i.id !== id);
    setIngredientsArr(newIngredients);
  };

  return (
    <div className="grid grid-cols-5  gap-y-2 gap-x-2 w-full ">
      <div className="flex gap-x-2 col-span-5">
        <div className="grow h-14   inline-flex items-center border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 bg-neutral-200 transition-all duration-300 rounded-xl  pl-3 font-light  text-lg text-neutral-800 dark:text-neutral-200  ">
          <h4 className="text-3xl  ">Components</h4>
        </div>
      </div>
      {ingredientsArr.map((i) => (
        <IngredientAdder
          key={i.id}
          ingredient={i}
          recipes={recipeArr}
          handleDelete={handleDelete}
        />
      ))}

      <div
        onClick={addIngredient}
        className="col-span-5   h-12 inline-flex border-r-none items-center dark:hover:text-neutral-700 justify-between px-3 dark:bg-neutral-900 bg-neutral-100 hover:bg-neutral-700 border dark:border-neutral-700 border-neutral-300 border-dashed hover:text-neutral-200 hover:dark:bg-neutral-200  transition-all duration-300 rounded-xl text-lg text-neutral-700 dark:text-neutral-100  "
      >
        <h4 className="text-xl  ">Add Component</h4>
        <PlusIcon className="h-7 w-7" />
      </div>
    </div>
  );
};

export default IngredientsSection;
