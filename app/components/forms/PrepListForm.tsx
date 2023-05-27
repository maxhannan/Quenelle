import { FC, useState } from "react";
import TextInput from "../formInputs/TextInput";
import PrepCalendar from "~/routes/app.prep._index/components/PrepCalendar";
import ComboBox from "../formInputs/ComboBox";
import { PlusIcon } from "lucide-react";
import { v4 } from "uuid";
import TaskGroup from "./PrepListFormComponents/TaskGroup";
import type { FullRecipes } from "~/utils/recipes.server";

interface Props {
  recipeList: FullRecipes;
}

const PrepListForm: FC<Props> = ({ recipeList }) => {
  const [date, setDate] = useState<Date | undefined>(new Date(Date.now()));
  const [taskGroups, setTaskGroups] = useState<{ id: string; value: string }[]>(
    []
  );
  const handleDateChange = (date: Date) => {
    setDate(date);
  };
  const addSection = () => {
    setTaskGroups([...taskGroups, { id: v4(), value: "" }]);
  };

  const handleDelete = (id: string) => {
    setTaskGroups((taskGroups) => taskGroups.filter((s) => s.id !== id));
  };

  return (
    <div className="flex flex-col gap-3 mt-2 relative">
      <TextInput name="listName" placeholder="Prep List Name" />
      <div className="flex  gap-2">
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
