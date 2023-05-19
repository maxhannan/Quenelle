import { useState } from "react";
import type { FC } from "react";
import type { FormIngredient } from "./IngredientsSection";
import type { FullRecipes } from "~/utils/recipes.server";
import TextInput from "~/components/formInputs/TextInput";
import IconButton from "~/components/buttons/IconButton";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ComboBox from "~/components/formInputs/ComboBox";
import { unitsList } from "~/utils/staticLists";

interface Props {
  handleDelete: (id: string) => void;
  ingredient: FormIngredient;
  recipes: FullRecipes;
}

const IngredientAdder: FC<Props> = ({ handleDelete, ingredient, recipes }) => {
  const linkOption =
    ingredient.linkId && ingredient.linkRecipe ? ingredient.linkRecipe : null;

  const [selectedLink, setSelectedLink] = useState(linkOption);

  const handleLinkChange = (value: { id: string; value: string } | null) => {
    setSelectedLink(value);
  };

  return (
    <div className="grid grid-cols-5  gap-y-2 gap-x-2 w-full col-span-5 ">
      <div className="flex gap-x-2 col-span-5">
        <div className="grow">
          <TextInput
            placeholder="Name"
            name="ingredientName"
            initValue={selectedLink?.value || ingredient.ingredient}
            disabled={selectedLink ? true : false}
          />
        </div>
        <div className="flex justify-center items-center ml-auto">
          <IconButton
            Icon={XMarkIcon}
            size={12}
            name="deleteRecipe"
            onClick={() => handleDelete(ingredient.id)}
          />
        </div>
      </div>
      <div className="col-span-5 relative">
        <ComboBox
          name="recipeLink"
          placeholder="Link a recipe"
          changeHandler={handleLinkChange}
          initValue={selectedLink ? selectedLink : undefined}
          options={recipes!.map((r) => ({ id: r.id, value: r.name }))}
          selectedLinkId={selectedLink?.id}
        />
      </div>
      <div className="col-span-2 ">
        <TextInput
          placeholder="Amt"
          name="ingredientAmt"
          type="number"
          required={false}
          initValue={ingredient.qty}
        />
      </div>
      <div className="col-span-3  relative ">
        <ComboBox
          name="ingredientUnit"
          placeholder="Unit"
          initValue={
            ingredient.unit
              ? { id: ingredient.unit, value: ingredient.unit }
              : undefined
          }
          allowCustom
          options={unitsList}
        />
      </div>
    </div>
  );
};

export default IngredientAdder;
