import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import IconButton from "~/components/buttons/IconButton";
import TextInput from "~/components/formInputs/TextInput";
import MenuDishSection from "../MenuFormSections/MenuDishSection";
import ComboBox, { ComboBoxOption } from "~/components/formInputs/ComboBox";
import { FullRecipes } from "~/utils/recipes.server";
import Task from "./Task";
import { v4 } from "uuid";
import { add } from "date-fns";
import { PlusIcon } from "lucide-react";

interface Props {
  handleDelete: (id: string) => void;
  tg: { id: string; value: string };
  recipeList: FullRecipes;
}

export interface TaskType {
  id: string;
  name: string;
  unit: string;
  linkRecipe:
    | {
        id: string;
        value: string;
      }
    | undefined;
}
const TaskGroup: FC<Props> = ({ handleDelete, tg, recipeList }) => {
  const [tgName, setTgName] = useState(tg.value ? tg.value : "");
  console.log({ tgName });
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const dishes = recipeList?.filter((recipe) => recipe.dish);
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    groupRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleDishSelect = (value: ComboBoxOption | null) => {
    console.log({ value });
    const findDish = dishes?.find((d) => d.id === value?.id);
    if (findDish) {
      const taskList = findDish.ingredients.map((i) => ({
        id: i.id,
        name: i.ingredient,
        unit: i.unit,
        linkRecipe: i.linkRecipe
          ? { id: i.linkRecipe.id, value: i.linkRecipe.name }
          : undefined,
      }));
      setTasks(taskList);
      setTgName(value?.value || "");
    } else {
      console.log("else");
      setTgName(value?.value || "");
      if (!value?.value || value?.value === "") setTasks([]);
    }
  };

  const addTask = () => {
    const newTask = {
        id: v4(),
        name: "",
        unit: "",
        linkRecipe: undefined,
      },
      newTasks = [...tasks, newTask];
    setTasks(newTasks);
  };

  const deleteTask = (id: string) => {
    const newTasks = tasks.filter((t) => t.id !== id);
    setTasks(newTasks);
  };

  const handleTaskChange = (id: string, value: string, field: string) => {
    const newTasks = tasks.map((t) => {
      if (t.id === id) {
        return { ...t, [field]: value };
      } else {
        return t;
      }
    });
    setTasks(newTasks);
  };

  return (
    <div
      ref={groupRef}
      className="border border-zinc-300 dark:border-zinc-700 rounded-2xl col-span-5 flex flex-col gap-2 "
    >
      <div className="flex gap-x-2 bg-zinc-200 dark:bg-zinc-800 p-2 h-16 rounded-tl-2xl rounded-tr-2xl  ">
        <ComboBox
          name="dish"
          placeholder="Select or Create a Dish"
          allowCustom
          required
          changeHandler={handleDishSelect}
          options={
            dishes
              ? dishes
                  .filter((recipe) => recipe.dish)
                  .map((r) => ({ id: r.id, value: r.name }))
              : []
          }
        />
        <div className="flex justify-center items-center ml-auto">
          <IconButton
            Icon={XMarkIcon}
            name="deleteRecipe"
            onClick={() => handleDelete(tg.id)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 p-2">
        {tasks &&
          tasks.map((task, i) => (
            <Task
              tg={tgName}
              task={task}
              recipes={recipeList ? recipeList.filter((r) => !r.dish) : null}
              key={task.id}
              handleTaskChange={handleTaskChange}
              deleteTask={deleteTask}
            />
          ))}
        <button
          onClick={addTask}
          type="button"
          className="col-span-5   h-12 inline-flex border-r-none items-center dark:hover:text-zinc-700 justify-between px-3 dark:bg-zinc-900 bg-zinc-100 hover:bg-zinc-700 border dark:border-zinc-700 border-zinc-300 border-dashed hover:text-zinc-200 hover:dark:bg-zinc-200  transition-all duration-300  rounded-2xl text-lg text-zinc-700 dark:text-zinc-100  "
        >
          <h4 className="text-xl  ">Add Task</h4>
          <PlusIcon className="h-7 w-7" />
        </button>
      </div>
    </div>
  );
};

export default TaskGroup;
