import type { FC } from "react";
import type { FullRecipe, FullRecipes } from "~/utils/recipes.server";
import TextInput from "../formInputs/TextInput";
import ComboBox from "../formInputs/ComboBox";
import ImageInput from "../formInputs/ImageInput";
import { IMAGE_URL } from "~/utils/images";
import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { allergens, unitsList } from "~/utils/staticLists";
import MultiSelect from "../formInputs/MultiSelect";
import IngredientsSection from "./RecipeFormSections/IngredientsSection";
import RecipeStepSection from "./RecipeFormSections/RecipeStepSection";
import { v4 } from "uuid";
import SlideUpTransition from "../animations/SlideUp";
import ColorButton from "../buttons/ColorButton";
import { Save } from "lucide-react";

interface Props {
  recipe?: FullRecipe;
  imageList?: string[];
  handleDeleteImage?: (path: string) => void;
  formLoading?: boolean;
  recipes: FullRecipes;
  categories: string[];
}
export type FormattedRecipe = ReturnType<typeof formatRecipe>;

const RecipeForm: FC<Props> = ({
  recipe,
  formLoading = false,
  imageList,
  handleDeleteImage,
  recipes,
  categories,
}) => {
  const recipeValues = recipe
    ? formatRecipe(recipe)
    : {
        name: "",
        category: undefined,
        allergens: undefined,
        yieldAmt: "",
        yieldUnit: undefined,
        ingredients: [],
        steps: [],
      };
  console.log({ recipeValues });
  return (
    <SlideUpTransition>
      <div>
        <div className="flex flex-col gap-y-2 mb-32 ">
          <div className="flex flex-col gap-y-2 ">
            <div>
              <TextInput
                name="recipeName"
                placeholder="Recipe Name"
                required
                initValue={recipeValues.name}
              />
            </div>
            <div>
              <ComboBox
                name="category"
                placeholder="Category"
                allowCustom
                initValue={recipeValues.category}
                options={categories.map((c) => ({
                  id: c,
                  value: c,
                }))}
              />
            </div>
            <ImageInput />
            {imageList && imageList.length > 0 && (
              <div className="w-full flex flex-wrap  items-center justify-start gap-2 py-2 ">
                {imageList.map((image) => (
                  <div key={image} className="relative ">
                    <div className="relative  w-[80px] h-[56px] overflow-hidden  rounded-xl ">
                      <img
                        className=" object-cover"
                        src={[IMAGE_URL, image, "icon"].join("/")}
                        alt="Default avatar"
                      />
                    </div>
                    <span
                      onClick={() =>
                        handleDeleteImage && handleDeleteImage(image)
                      }
                      className="-top-1 -right-1 absolute  w-5 h-5 bg-red-500 rounded-full flex justify-center items-center hover:bg-red-700 hover:text-neutral-100 transition-all duration-200"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-6 gap-x-2  ">
              <div className="col-span-3">
                <TextInput
                  placeholder="Yield"
                  type="number"
                  required
                  name="yieldAmt"
                  initValue={recipeValues.yieldAmt}
                />
              </div>
              <div className="relative col-span-3">
                <ComboBox
                  name="yieldUnit"
                  placeholder="Unit"
                  required
                  allowCustom
                  initValue={recipeValues.yieldUnit}
                  options={unitsList}
                />
              </div>
            </div>
            <div className="relative col-span-6">
              <MultiSelect
                name="allergies"
                initialValue={recipeValues.allergens}
                options={allergens}
              />
            </div>
          </div>
          <IngredientsSection
            recipes={recipes}
            ingredients={recipeValues.ingredients}
          />
          <RecipeStepSection stepsArr={recipeValues.steps} />
          <div className="w-full flex justify-end">
            <ColorButton color={"green"}>
              {recipe ? (
                <>
                  <ArrowPathIcon className="h-4 w-4" /> Update Recipe
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Recipe
                </>
              )}
            </ColorButton>
          </div>
        </div>
      </div>
    </SlideUpTransition>
  );
};

export default RecipeForm;

const formatRecipe = (recipe: FullRecipe) => {
  const category = { id: recipe!.category, value: recipe!.category };
  const yieldUnit = { id: recipe!.yieldUnit, value: recipe!.yieldUnit };
  const steps = recipe!.steps.map((s, i) => ({
    content: s,
    orderNum: i + 1,
    id: v4(),
  }));
  const ingredients = recipe!.ingredients.map((i) => ({
    ...i,
    linkRecipe: i.linkRecipe
      ? { id: i.linkRecipe.id, value: i.linkRecipe.name }
      : null,
  }));
  return { ...recipe, category, yieldUnit, ingredients, steps };
};
