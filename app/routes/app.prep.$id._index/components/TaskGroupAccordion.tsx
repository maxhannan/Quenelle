import { type FetcherWithComponents } from "@remix-run/react";
import { CheckCircle, XCircleIcon } from "lucide-react";
import { useState, type FC } from "react";
import ColorButton from "~/components/buttons/ColorButton";
import Accordion from "~/components/display/Accordion";
import { type TaskGroup } from "~/utils/prepList.server";

import PrepTask from "./PrepTask";

interface Props {
  fetcher: FetcherWithComponents<any>;
  taskGroup: TaskGroup;
  taskFocus: boolean;
}

const TaskGroupAccordion: FC<Props> = ({ taskGroup, fetcher, taskFocus }) => {
  const [tasksState, setTasksState] = useState(taskGroup!.tasks);

  const handleChangeTask = (
    id: string,
    field: string,
    value: string | boolean
  ) => {
    const newTasks = tasksState.map((t) => {
      if (t.id === id) {
        return { ...t, [field]: value };
      }
      return t;
    });
    setTasksState(newTasks);
    if (field === "completed") handleComplete(id, value as boolean);
  };

  const handleUpdate = async (id: string) => {
    const newTask = tasksState.find((t) => t.id === id);
    if (!newTask) return;

    const data = new FormData();
    data.append("id", id);
    data.append("completed", newTask.completed ? "yes" : "no");
    data.append("inv", newTask.onHand ?? "");
    data.append("prep", newTask.prepQty ?? "");
    await fetcher.submit(data, { method: "POST" });
  };
  const handleComplete = async (id: string, completed: boolean) => {
    const newTask = tasksState.find((t) => t.id === id);
    if (!newTask) return;

    const data = new FormData();
    data.append("id", id);
    data.append("completed", completed ? "yes" : "no");
    data.append("inv", newTask.onHand ?? "");
    data.append("prep", newTask.prepQty ?? "");
    await fetcher.submit(data, { method: "POST" });
  };

  const handleCompleteAll = () => {
    const data = new FormData();
    if (completedAll) {
      setTasksState(tasksState.map((t) => ({ ...t, completed: false })));

      data.set("completeAll", "yes");
      data.set("completedAll", "no");
      data.set("ids", tasksState.map((t) => t.id).join(","));
    } else {
      setTasksState(tasksState.map((t) => ({ ...t, completed: true })));
      data.set("completeAll", "yes");
      data.set("completedAll", "yes");
      data.set("ids", tasksState.map((t) => t.id).join(","));
    }
    fetcher.submit(data, { method: "POST" });
  };

  const completedAll = tasksState?.reduce((acc, t) => acc && t.completed, true);
  if (!taskGroup) return null;
  const activeTasks = tasksState
    .filter((t) => !t.completed)
    .filter((t) => {
      if (t.prepQty && parseInt(t.prepQty) > 0) return true;
      else return false;
    });
  if (taskFocus && activeTasks.length === 0)
    return (
      <div className="dark:bg-opacity-50 transition-all border-green-400 dark:border-green-400 bg-green-200 dark:bg-green-800 duration-300 flex w-full items-center justify-between  rounded-xl   font-normal  border  px-3 py-2 text-left text-lg lg:text-2xl  text-zinc-700 dark:text-zinc-200  focus:outline-none focus-visible:ring focus-visible:ring-violet-500 focus-visible:ring-opacity-75">
        {taskGroup.name}
      </div>
    );
  return (
    <Accordion
      key={taskGroup.id}
      name={taskGroup.name}
      link={
        taskGroup.linkRecipeId
          ? `/app/menus/dishes/${taskGroup.linkRecipeId}`
          : undefined
      }
    >
      <div className="  max-w-full      rounded-xl   pr-2 py-1 grid grid-cols-10  gap-1   dark:bg-zinc-800 ">
        <div className=" font-light col-span-6   lg:col-span-6 flex gap-2 items-center mr-1">
          <div className="col-span-1  flex items-center justify-center ">
            <ColorButton
              color={completedAll ? "red" : "green"}
              type="button"
              onClick={handleCompleteAll}
            >
              {" "}
              {completedAll ? (
                <XCircleIcon className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              {completedAll ? "Uncheck All" : "Check All"}
            </ColorButton>
          </div>
        </div>
        <div className="col-span-2 lg:col-span-1 lg:col-start-9  flex items-center justify-start pl-1   text-lg text-zinc-700 dark:text-zinc-100 font-light">
          <span>Inv</span>
        </div>
        <div className="col-span-2 lg:col-span-1 lg:col-start-10 flex items-center justify-start pl-1  text-lg text-zinc-700 dark:text-zinc-100 font-light">
          <span>Prep</span>
        </div>
      </div>
      {taskFocus
        ? activeTasks.map((task) => (
            <PrepTask
              key={task.id}
              task={task}
              handleChangeTask={handleChangeTask}
              handleUpdate={handleUpdate}
            />
          ))
        : tasksState.map((task) => (
            <PrepTask
              key={task.id}
              task={task}
              handleChangeTask={handleChangeTask}
              handleUpdate={handleUpdate}
            />
          ))}
    </Accordion>
  );
};

export default TaskGroupAccordion;
