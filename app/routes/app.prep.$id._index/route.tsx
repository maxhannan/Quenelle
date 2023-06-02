import React from "react";
import { usePrepList } from "../app.prep.$id/route";
import {
  Form,
  Link,
  ShouldRevalidateFunction,
  useFetcher,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import Spinner from "~/components/LoadingSpinner";
import Accordion from "~/components/display/Accordion";
import SearchBar from "~/components/formInputs/SearchBar";
import AppBar from "~/components/navigation/AppBar";
import IconButton from "~/components/buttons/IconButton";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import PrepListItem from "./components/PrepListItem";
import type { ActionFunction } from "@remix-run/node";
import { updateTask } from "~/utils/prepList.server";
import SlideUpTransition from "~/components/animations/SlideUp";

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

function PrepListRoute() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const prepList = usePrepList();

  if (!prepList) {
    return null;
  }
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
          onClick={() => navigate(-1)}
          Icon={ArrowUturnLeftIcon}
        />
      </AppBar>

      <div className="mb-2 text-lg text-indigo-500 font-mono">
        {new Date(prepList.date).toDateString()}
      </div>
      <Link to="pdf" reloadDocument>
        View as PDF
      </Link>
      <SlideUpTransition>
        <SearchBar
          handleChange={() => (e: string) => console.log(e)}
          value={""}
          loading={false}
        />
        <Form>
          <div className="w-full grid  gap-2 mt-2">
            <div className="flex flex-col gap-2">
              {prepList?.taskGroups.map((tg) => (
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
              ))}
            </div>
          </div>
        </Form>
      </SlideUpTransition>
    </div>
  );
}

export default PrepListRoute;
