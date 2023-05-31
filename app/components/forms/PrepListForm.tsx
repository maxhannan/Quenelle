import { useState } from "react";
import type { FC } from "react";
import TextInput from "../formInputs/TextInput";
import PrepCalendar from "~/routes/app.prep._index/components/PrepCalendar";
import ComboBox from "../formInputs/ComboBox";
import { PlusIcon } from "lucide-react";
import { v4 } from "uuid";
import TaskGroup from "./PrepListFormComponents/TaskGroup";
import type { FullRecipes } from "~/utils/recipes.server";
import { Checkbox } from "../ui/checkbox";
import type { getTemplateById } from "~/utils/prepList.server";
import { te } from "date-fns/locale";

interface Props {
  recipeList: FullRecipes;
  template?: Template;
}

type Template = Awaited<ReturnType<typeof getTemplateById>>;

export interface TaskGroupType {
  id: string;
  value: string;
  linkDish:
    | {
        id: string;
        value: string;
      }
    | undefined;
  tasks: {
    id: string;
    name: string;
    unit: string | undefined;
    linkRecipe:
      | {
          id: string;
          value: string;
        }
      | undefined;
  }[];
}

const PrepListForm: FC<Props> = ({ recipeList, template }) => {
  const [date, setDate] = useState<Date>(new Date(Date.now()));

  const getFormValues = (template?: Template) => {
    if (template) {
      const { name, taskGroups } = template;
      return {
        name,
        taskGroups: taskGroups.map((tg) => ({
          id: tg.id,
          value: tg.name,
          linkDish: tg.linkRecipe
            ? { id: tg.linkRecipe.id, value: tg.linkRecipe.name }
            : undefined,
          tasks: tg.tasks.map((t) => ({
            id: t.id,
            name: t.name,
            unit: t.prepUnit || undefined,
            linkRecipe: t.linkRecipe
              ? { id: t.linkRecipe.id, value: t.linkRecipe.name }
              : undefined,
          })),
        })),
      };
    }
    return {
      name: "",
      taskGroups: [],
    };
  };

  const formValues = getFormValues(template);

  const [taskGroups, setTaskGroups] = useState<TaskGroupType[]>(
    formValues.taskGroups
  );
  const handleDateChange = (date: Date) => {
    setDate(date);
  };
  const addSection = () => {
    setTaskGroups([
      ...taskGroups,
      { id: v4(), value: "", linkDish: undefined, tasks: [] },
    ]);
  };

  const handleDelete = (id: string) => {
    setTaskGroups((taskGroups) => taskGroups.filter((s) => s.id !== id));
  };

  return (
    <div className="flex flex-col gap-3 mt-2 relative">
      <TextInput
        name="listName"
        placeholder="Prep List Name"
        initValue={formValues.name}
      />
      <div className="flex  gap-2">
        <input type="hidden" name="date" value={date.toString()} />
        <div className=" flex-none">
          <PrepCalendar date={date} handleDateChange={handleDateChange} />
        </div>
        <ComboBox
          name="station"
          placeholder="Station"
          allowCustom
          options={[
            { id: "grill", value: "Grill" },
            { id: "fry", value: "Fry" },
            { id: "gm", value: "Garde Manger" },
          ]}
        />
      </div>
      {!template && (
        <div className="items-center flex space-x-4 bg-zinc-200 dark:bg-zinc-800 rounded-2xl p-3  ">
          <Checkbox
            name="saveAsTemplate"
            id="terms1"
            className="w-7 h-7 rounded-lg border-indigo-500 data-[state=checked]:bg-indigo-500 data-[state=checked]:text-zinc-200"
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms1"
              className="text-md font-medium text-zinc-800 dark:text-zinc-200 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Save as template?
            </label>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Allows you to reuse this preplist.
            </p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-5  gap-y-4 gap-x-2 w-full  z-20">
        <div className="flex gap-x-2 col-span-5">
          <div className="grow h-14   inline-flex items-center border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 bg-zinc-200 transition-all duration-300   pl-3 font-light rounded-2xl text-lg text-zinc-800 dark:text-zinc-200  ">
            <h4 className="text-3xl  ">Task Groups</h4>
          </div>
        </div>
      </div>
      {taskGroups.map((tg) => (
        <TaskGroup
          tg={tg}
          handleDelete={handleDelete}
          key={tg.id}
          recipeList={recipeList}
        />
      ))}
      <button
        onClick={addSection}
        type="button"
        className="col-span-5   h-12 inline-flex border-r-none items-center dark:hover:text-zinc-700 justify-between px-3 dark:bg-zinc-900 bg-zinc-100 hover:bg-zinc-700 border dark:border-zinc-700 border-zinc-300 border-dashed hover:text-zinc-200 hover:dark:bg-zinc-200  transition-all duration-300  rounded-2xl text-lg text-zinc-700 dark:text-zinc-100  "
      >
        <h4 className="text-xl  ">Add Group</h4>
        <PlusIcon className="h-7 w-7" />
      </button>
    </div>
  );
};

export default PrepListForm;
