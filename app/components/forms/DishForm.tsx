import { useNavigation } from "@remix-run/react";
import type { FC } from "react";
import { v4 } from "uuid";
import type { getDishById } from "~/utils/dishes.server";
import type { FullRecipes } from "~/utils/recipes.server";
import TextInput from "../formInputs/TextInput";
import MultiSelect from "../formInputs/MultiSelect";
import { allergens } from "~/utils/staticLists";
import { IMAGE_URL } from "~/utils/images";
import {
  ArrowPathIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ImageInput from "../formInputs/ImageInput";
import IngredientsSection from "./RecipeFormSections/IngredientsSection";
import RecipeStepSection from "./RecipeFormSections/RecipeStepSection";
import LoadingButton from "../buttons/LoadingButton";
import SlideUpTransition from "../animations/SlideUp";

interface Props {
  dish?: Awaited<ReturnType<typeof getDishById>>;
  imageList?: string[];
  handleDeleteImage?: (path: string) => void;
  formLoading?: boolean;
  recipes: FullRecipes;
  categories: string[];
}

const DishForm: FC<Props> = ({
  dish,
  imageList,
  handleDeleteImage,
  formLoading,
  recipes,
  categories,
}) => {
  const navigation = useNavigation();
  const dishValues = dish
    ? formatDish(dish)
    : {
        name: "",
        allergens: undefined,
        ingredients: [],
        steps: [],
      };
  return (
    <SlideUpTransition>
      <div>
        <div className="flex flex-col gap-y-2 mb-32 ">
          <div className="flex flex-col gap-y-2 ">
            <div>
              <TextInput
                name="dishName"
                placeholder="Recipe Name"
                initValue={dishValues.name}
              />
            </div>
            <div>
              <MultiSelect
                name="allergies"
                initialValue={dishValues.allergens}
                options={allergens}
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
          </div>
          <IngredientsSection
            recipes={recipes}
            ingredients={dishValues.ingredients}
          />
          <RecipeStepSection stepsArr={dishValues.steps} />
          {dish ? (
            <LoadingButton
              loading={
                navigation.state === "submitting" ||
                navigation.state === "loading" ||
                formLoading
              }
              type="submit"
              buttonName="updateRecipe"
              buttonText="Update Dish"
              loadingText="Updating..."
              Icon={ArrowPathIcon}
            />
          ) : (
            <LoadingButton
              loading={navigation.state === "submitting" || formLoading}
              type="submit"
              buttonName="addRecipe"
              buttonText="Add Dish"
              loadingText="Adding..."
              Icon={PlusCircleIcon}
            />
          )}
        </div>
      </div>
    </SlideUpTransition>
  );
};

const formatDish = (dish: Awaited<ReturnType<typeof getDishById>>) => {
  const steps = dish!.steps.map((s, i) => ({
    content: s,
    orderNum: i + 1,
    id: v4(),
  }));
  const ingredients = dish!.ingredients.map((i) => ({
    ...i,
    linkRecipe: i.linkRecipe
      ? { id: i.linkRecipe.id, value: i.linkRecipe.name }
      : null,
  }));
  return { ...dish, ingredients, steps };
};
export default DishForm;
