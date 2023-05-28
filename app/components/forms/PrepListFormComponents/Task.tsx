import { useState } from "react";
import type { FC } from "react";
import type { TaskType } from "./TaskGroup";
import { XMarkIcon } from "@heroicons/react/24/outline";
import IconButton from "~/components/buttons/IconButton";
import ComboBox from "~/components/formInputs/ComboBox";
import TextInput from "~/components/formInputs/TextInput";
import { unitsList } from "~/utils/staticLists";
import type { FullRecipes } from "~/utils/recipes.server";

interface Props {
  task: TaskType;
  handleTaskChange: (id: string, value: string, field: string) => void;
  deleteTask: (id: string) => void;
  recipes: FullRecipes;
  tg: string;
}

const Task: FC<Props> = ({
  task,
  handleTaskChange,
  deleteTask,
  recipes,
  tg,
}) => {
  const linkOption = task.linkRecipe ? task.linkRecipe : null;

  const [selectedLink, setSelectedLink] = useState(linkOption);

  const handleLinkChange = (value: { id: string; value: string } | null) => {
    setSelectedLink(value);
  };
  console.log({ tg });
  return (
    <div className="grid grid-cols-5  gap-y-2 gap-x-2 w-full col-span-5 ">
      <input type="hidden" name="tGroupName" value={tg} />
      <div className="flex gap-x-2 col-span-5">
        <div className="grow">
          <TextInput
            placeholder="Name"
            name="ingredientName"
            initValue={selectedLink?.value || task.name}
            disabled={selectedLink ? true : false}
          />
        </div>
        <div className="flex justify-center items-center ml-auto">
          <IconButton
            Icon={XMarkIcon}
            size={12}
            name="deleteRecipe"
            onClick={() => deleteTask(task.id)}
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

      <div className="col-span-5  relative ">
        <ComboBox
          name="ingredientUnit"
          required
          placeholder="Unit"
          initValue={
            task.unit ? { id: task.unit, value: task.unit } : undefined
          }
          allowCustom
          options={unitsList}
        />
      </div>
      <div className="col-span-5 border-2 dark:border-neutral-700 rounded-2xl border-neutral-300"></div>
    </div>
  );
};

export default Task;
