import {
  ArrowLongRightIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { useFetcher, NavLink } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import type { TaskType } from "~/utils/prepList.server";
interface Props {
  task: TaskType;
}

const PrepListItem: FC<Props> = ({ task }) => {
  const fetcher = useFetcher();
  const [completed, setCompleted] = useState(task?.completed || false);
  const formRef = useRef<HTMLFormElement>(null);
  async function handleSubmit() {
    fetcher.submit(formRef.current!);
  }

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed]);
  if (!task) return null;

  return (
    <fetcher.Form method="POST" ref={formRef}>
      <div
        className={`max-w-full border transition-all duration-300 bg-zinc-100 dark:bg-zinc-800 bg-opacity-50 dark:bg-opacity-50 rounded-xl  py-2 px-2 grid grid-cols-10 gap-1     ${
          completed
            ? " border-green-400 dark:border-green-400 "
            : "border-zinc-300  dark:border-zinc-700  "
        }`}
      >
        <div className="  col-span-5 lg:col-span-7 flex gap-2 items-center mr-2">
          <div>
            {task.linkRecipeId ? (
              <NavLink
                to={`/app/recipes/${task.linkRecipeId}`}
                className="  gap-2 items-center cursor-pointer hover:opacity-80 justify-start"
              >
                <h5 className="flex items-center text-base md:text-lg text-indigo-500 dark:text-indigo-400  ">
                  {task.name}
                  <ArrowLongRightIcon className="text-indigo-500 dark:text-indigo-400  w-5 h-5 ml-1" />
                </h5>
              </NavLink>
            ) : (
              <h5
                className={`text-base lg:text-lg text-zinc-700 dark:text-zinc-100  `}
              >
                {task.name}
              </h5>
            )}

            <h6 className="text-base text-zinc-700 dark:text-zinc-100 ">
              {`(${task.prepUnit})`}
            </h6>
          </div>
        </div>
        <div className="col-span-2 lg:col-span-1 flex items-center justify-center">
          <input type="hidden" name={"id"} value={task.id} />
          <input
            name={"inv"}
            type="number"
            inputMode="decimal"
            className={`rounded-xl bg-opacity-50 dark:bg-opacity-50  text-zinc-800 dark:text-zinc-50 border-zinc-300 dark:border-zinc-700  dark:bg-zinc-800 bg-zinc-200 rounded-bl-xl focus:ring-zinc-500  border relative    h-10 w-full p-2 pl-2 text-base font-light appearance-none  focus:ring-2 focus:outline-none focus:border-none     placeholder-zinc-500   dark:placeholder-zinc-400 `}
            placeholder={"Inv"}
            defaultValue={task.onHand ? task.onHand : ""}
            onBlur={(e) => {
              handleSubmit();
            }}
          />
        </div>
        <div className="col-span-2 lg:col-span-1 flex items-center justify-center">
          <input
            name={"prep"}
            type="number"
            inputMode="decimal"
            className={`rounded-xl bg-opacity-50 dark:bg-opacity-50  text-zinc-800 dark:text-zinc-50 border-zinc-300 dark:border-zinc-700  dark:bg-zinc-800 bg-zinc-200 rounded-bl-xl focus:ring-zinc-500  border relative    h-10 w-full p-2 pl-2 text-base font-light appearance-none  focus:ring-2 focus:outline-none focus:border-none     placeholder-zinc-500   dark:placeholder-zinc-400 `}
            placeholder={"Prep"}
            defaultValue={task.prepQty ? task.prepQty : ""}
            onChange={(e) => {
              handleSubmit();
            }}
          />
        </div>
        <div className="col-span-1  flex items-center justify-center text-green-500 dark:text-green-400">
          <input
            type="hidden"
            name="completed"
            value={completed === true ? "yes" : "no"}
            onChange={(e) => console.log("hello")}
          />
          <CheckBadgeIcon
            className="w-8 h-8"
            onClick={() => {
              setCompleted((completed) => !completed);
            }}
          />
        </div>
      </div>
    </fetcher.Form>
  );
};

export default PrepListItem;