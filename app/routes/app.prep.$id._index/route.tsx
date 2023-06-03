import React, { useState } from "react";
import { usePrepList } from "../app.prep.$id/route";
import { useFetcher, useNavigate, useNavigation } from "@remix-run/react";
import Spinner from "~/components/LoadingSpinner";
import Accordion from "~/components/display/Accordion";
import SearchBar from "~/components/formInputs/SearchBar";
import AppBar from "~/components/navigation/AppBar";
import IconButton from "~/components/buttons/IconButton";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import PrepListItem from "./components/PrepListItem";
import type { ActionFunction } from "@remix-run/node";
import { updateTask } from "~/utils/prepList.server";
import type { getPrepListById } from "~/utils/prepList.server";
import SlideUpTransition from "~/components/animations/SlideUp";
import { getPdf } from "~/utils/pdf";
import { ClipboardCheckIcon, Printer } from "lucide-react";

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const id = data.get("id") as string;
  const inv = data.get("inv") as string;
  const prep = data.get("prep") as string;
  const completed = data.get("completed") as string;

  const updatedTask = await updateTask(id, {
    onHand: inv,
    prepQty: prep,
    completed: completed === "yes" ? true : false,
  });
  if (!updatedTask) return null;
  return updatedTask;
};
type List = Awaited<ReturnType<typeof getPrepListById>>;
function PrepListRoute() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const fetcher = useFetcher();
  let prepList = usePrepList();

  const [pdfLoading, setPdfLoading] = useState(false);
  const [openTaskFocus, setOpenTaskFocus] = useState<boolean>(false);

  if (!prepList) return <h1> No Prep List Found </h1>;
  const generatepdf = async () => {
    setPdfLoading(true);
    console.log(fetcher, fetcher.data);
    const list = (await fetch(`/app/prep/${prepList?.id}/current`, {
      method: "GET",
    }).then((res) => res.json())) as List;
    const pdf = getPdf(list);
    setPdfLoading(false);
    return pdf;
  };
  const activeTaskView = prepList.taskGroups
    .map((tg) => ({
      ...tg,
      tasks: tg.tasks.filter(
        (t) => t.prepQty && parseInt(t.prepQty) > 0 && !t.completed
      ),
    }))
    .filter((tg) => tg.tasks.length > 0);

  if (navigation.state === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size={14} />
      </div>
    );
  }
  return (
    <div className=" container mx-auto mb-28 max-w-4xl ">
      <AppBar
        page={prepList.name}
        textSize="text-3xl md:text-4xl"
        bottomPadding="0"
      >
        <IconButton
          name="Goback"
          onClick={() => setOpenTaskFocus(!openTaskFocus)}
          loading={pdfLoading}
          Icon={ClipboardCheckIcon}
        />
        <IconButton
          name="Goback"
          onClick={generatepdf}
          loading={pdfLoading}
          Icon={Printer}
        />
        <IconButton
          name="Goback"
          onClick={() => navigate(-1)}
          Icon={ArrowUturnLeftIcon}
        />
      </AppBar>

      <div className="mb-2 text-lg text-indigo-500 font-mono">
        {new Date(prepList.date).toDateString()}
      </div>

      <SlideUpTransition>
        <div className="w-full grid  gap-2 mt-2">
          <div className="flex flex-col gap-2">
            {openTaskFocus ? (
              activeTaskView.length > 0 ? (
                activeTaskView?.map((tg) => (
                  <Accordion
                    key={tg.id}
                    name={tg.name}
                    link={
                      tg.linkRecipeId
                        ? `/app/menus/dishes/${tg.linkRecipeId}`
                        : undefined
                    }
                  >
                    <div className="  max-w-full  bg-zinc-100 border-zinc-300    rounded-xl   px-2 grid grid-cols-10  gap-1   dark:bg-zinc-800 ">
                      <div className=" font-light col-span-5 lg:col-span-7 flex gap-2 items-center mr-1">
                        <div>
                          <h5 className="text-lg text-zinc-700 dark:text-zinc-100 ">
                            Task
                          </h5>
                        </div>
                      </div>
                      <div className="col-span-2 lg:col-span-1 flex items-center justify-start pl-1   text-lg text-zinc-700 dark:text-zinc-100 font-light">
                        <span>Inv</span>
                      </div>
                      <div className="col-span-2 lg:col-span-1 flex items-center justify-start pl-1  text-lg text-zinc-700 dark:text-zinc-100 font-light">
                        <span>Prep</span>
                      </div>
                    </div>

                    {tg.tasks.map((item) => (
                      <PrepListItem
                        fetcher={fetcher}
                        key={item.id}
                        task={item}
                      />
                    ))}
                  </Accordion>
                ))
              ) : (
                <div className="w-full flex  text-xl text-zinc-700 dark:text-zinc-200">
                  Looks like you're all caught up!
                </div>
              )
            ) : (
              prepList?.taskGroups.map((tg) => (
                <Accordion
                  key={tg.id}
                  name={tg.name}
                  link={
                    tg.linkRecipeId
                      ? `/app/menus/dishes/${tg.linkRecipeId}`
                      : undefined
                  }
                >
                  <div className="  max-w-full  bg-zinc-100 border-zinc-300    rounded-xl   px-2 grid grid-cols-10  gap-1   dark:bg-zinc-800 ">
                    <div className=" font-light col-span-5 lg:col-span-7 flex gap-2 items-center mr-1">
                      <div>
                        <h5 className="text-lg text-zinc-700 dark:text-zinc-100 ">
                          Task
                        </h5>
                      </div>
                    </div>
                    <div className="col-span-2 lg:col-span-1 flex items-center justify-start pl-1   text-lg text-zinc-700 dark:text-zinc-100 font-light">
                      <span>Inv</span>
                    </div>
                    <div className="col-span-2 lg:col-span-1 flex items-center justify-start pl-1  text-lg text-zinc-700 dark:text-zinc-100 font-light">
                      <span>Prep</span>
                    </div>
                  </div>

                  {tg.tasks.map((item) => (
                    <PrepListItem fetcher={fetcher} key={item.id} task={item} />
                  ))}
                </Accordion>
              ))
            )}
            {/* {prepList?.taskGroups.map((tg) => (
              <Accordion
                key={tg.id}
                name={tg.name}
                link={
                  tg.linkRecipeId
                    ? `/app/menus/dishes/${tg.linkRecipeId}`
                    : undefined
                }
              >
                <div className="  max-w-full  bg-zinc-100 border-zinc-300    rounded-xl   px-2 grid grid-cols-10  gap-1   dark:bg-zinc-800 ">
                  <div className=" font-light col-span-5 lg:col-span-7 flex gap-2 items-center mr-1">
                    <div>
                      <h5 className="text-lg text-zinc-700 dark:text-zinc-100 ">
                        Task
                      </h5>
                    </div>
                  </div>
                  <div className="col-span-2 lg:col-span-1 flex items-center justify-start pl-1   text-lg text-zinc-700 dark:text-zinc-100 font-light">
                    <span>Inv</span>
                  </div>
                  <div className="col-span-2 lg:col-span-1 flex items-center justify-start pl-1  text-lg text-zinc-700 dark:text-zinc-100 font-light">
                    <span>Prep</span>
                  </div>
                </div>

                {tg.tasks.map((item) => (
                  <PrepListItem fetcher={fetcher} key={item.id} task={item} />
                ))}
              </Accordion>
            ))} */}
          </div>
        </div>
      </SlideUpTransition>
    </div>
  );
}

export default PrepListRoute;
