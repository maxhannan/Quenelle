import { FetcherWithComponents, useRevalidator } from "@remix-run/react";
import { CheckCircle, XCircleIcon } from "lucide-react";
import { useState, type FC, useEffect } from "react";
import ColorButton from "~/components/buttons/ColorButton";
import Accordion from "~/components/display/Accordion";
import { TaskGroup } from "~/utils/prepList.server";
import PrepListItem from "./PrepListItem";
import { v4 } from "uuid";

interface Props {
  fetcher: FetcherWithComponents<any>;
  taskGroup: TaskGroup;
}

const TaskGroupAccordion: FC<Props> = ({ taskGroup, fetcher }) => {
  const [loading, setLoading] = useState(false);
  const [completedAll, setCompletedAll] = useState(
    taskGroup?.tasks.reduce((acc, curr) => acc && curr.completed, true)
  );
  const [completedTasks, setCompletedTasks] = useState(
    taskGroup?.tasks.map((t) => ({ id: t.id, completed: t.completed }))
  );
  useEffect(() => {
    setCompletedAll(
      taskGroup?.tasks.reduce((acc, curr) => acc && curr.completed, true)
    );
    setCompletedTasks(
      taskGroup?.tasks.map((t) => ({ id: t.id, completed: t.completed }))
    );
  }, [taskGroup]);
  if (!taskGroup) return null;

  const handleCompleteAll = async (id: string) => {
    if (!taskGroup) return;

    const taskIds = taskGroup.tasks.map((t) => t.id);
    const data = new FormData();
    data.set("all", "yes");
    data.set("ids", taskIds.join(","));
    data.set("completedAll", completedAll ? "no" : "yes");

    await fetcher.submit(data, {
      method: "POST",
    });

    setCompletedAll(!completedAll);
    setCompletedTasks(
      completedTasks?.map((t) => ({
        id: t.id,
        completed: !completedAll,
      }))
    );
  };
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
            <input
              type="hidden"
              name="completed"
              value={completedAll === true ? "no" : "yes"}
              onChange={(e) => console.log("hello")}
            />

            <ColorButton
              color={completedAll ? "red" : "green"}
              loading={loading}
              type="button"
              onClick={() => handleCompleteAll(taskGroup.id)}
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

      {taskGroup.tasks.map((item) => (
        <PrepListItem
          fetcher={fetcher}
          key={item.id}
          task={item}
          completedFlag={
            completedTasks?.find((t) => t.id === item.id)?.completed
          }
        />
      ))}
    </Accordion>
  );
};

export default TaskGroupAccordion;
