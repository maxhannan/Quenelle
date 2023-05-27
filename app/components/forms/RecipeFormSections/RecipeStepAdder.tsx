import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import type { FC } from "react";
import IconButton from "~/components/buttons/IconButton";
import TextArea from "~/components/formInputs/TextArea";

interface Props {
  step: { orderNum: number; content: string; id: string };
  handleDelete: (id: string) => void;
}

const RecipeStepAdder: FC<Props> = ({ step, handleDelete }) => {
  const [value, setValue] = useState(step.content || "");
  console.log({ value });
  return (
    <>
      <div className="flex gap-x-2 col-span-5 ">
        <div className="grow h-12 inline-flex  items-center  dark:bg-zinc-800 bg-zinc-200 transition-all duration-300 rounded-xl   pl-3 font-light text-lg text-zinc-700 dark:text-zinc-100  ">
          <h4 className="text-xl dark:text-zinc-100 "> Step {step.orderNum}</h4>
        </div>
        <div className="flex justify-center items-center ml-auto">
          <IconButton
            Icon={XMarkIcon}
            size={12}
            name="deleteRecipe"
            onClick={() => handleDelete(step.id)}
          />
        </div>
      </div>

      <TextArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        name="recipeStep"
        placeholder="Add A Step...."
      />
    </>
  );
};

export default RecipeStepAdder;
