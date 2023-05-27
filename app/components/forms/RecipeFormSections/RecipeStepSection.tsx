import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import type { FC } from "react";
import { v4 } from "uuid";
import RecipeStepAdder from "./RecipeStepAdder";

interface Props {
  stepsArr: Step[];
}

interface Step {
  orderNum: number;
  content: string;
  id: string;
}

const RecipeStepSection: FC<Props> = ({ stepsArr }) => {
  const [steps, setSteps] = useState(stepsArr.length ? stepsArr : []);

  const handleAddStep = () => {
    const stepNum = steps.length > 0 ? steps.slice(-1)[0].orderNum + 1 : 1;
    const newStep = {
      orderNum: stepNum,
      content: "",
      id: v4(),
    };
    setSteps([...steps, newStep]);
  };
  const handleDelete = (id: string) => {
    const newSteps = steps.filter((i) => i.id !== id);
    const newNumSteps = newSteps.map((s) => {
      return { ...s, orderNum: newSteps.indexOf(s) + 1 };
    });
    setSteps(newNumSteps);
  };

  return (
    <div className="grid grid-cols-5  gap-y-2 gap-x-2 w-full  z-20">
      <div className="flex gap-x-2 col-span-5">
        <div className="grow h-14   inline-flex items-center border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 bg-zinc-200 transition-all duration-300 rounded-2xl   pl-3 font-light text-lg text-zinc-800 dark:text-zinc-200  ">
          <h4 className="text-3xl  ">Steps</h4>
        </div>
      </div>
      {steps.map((s) => (
        <RecipeStepAdder key={s.id} step={s} handleDelete={handleDelete} />
      ))}
      <div
        onClick={handleAddStep}
        className="col-span-5   h-12 inline-flex border-r-none items-center dark:hover:text-zinc-700 justify-between px-3 dark:bg-zinc-900 bg-zinc-100 hover:bg-zinc-700 border dark:border-zinc-700 border-zinc-300 border-dashed hover:text-neutral-200 hover:dark:bg-neutral-200  transition-all duration-300 rounded-xl text-lg text-neutral-700 dark:text-neutral-100  "
      >
        <h4 className="text-xl  ">Add Step</h4>
        <PlusIcon className="h-7 w-7" />
      </div>
    </div>
  );
};

export default RecipeStepSection;
