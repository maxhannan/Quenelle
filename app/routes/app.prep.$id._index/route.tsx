import React, { useState } from "react";
import { usePrepList } from "../app.prep.$id/route";
import {
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import Spinner from "~/components/LoadingSpinner";
import Accordion from "~/components/display/Accordion";

import AppBar from "~/components/navigation/AppBar";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import PrepListItem from "./components/PrepListItem";
import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { updateTask } from "~/utils/prepList.server";
import type { getPrepListById } from "~/utils/prepList.server";
import SlideUpTransition from "~/components/animations/SlideUp";
import { getPdf } from "~/utils/pdf";
import { ClipboardCheckIcon, Printer, Trash2Icon } from "lucide-react";
import { useToast } from "~/components/ui/use-toast";
import ComboBox from "~/components/formInputs/ComboBox";
import { getMembers } from "~/utils/teams.server";
import { getUser } from "~/utils/auth.server";
import DeleteModal from "~/components/display/DeleteModal";
import IconColorButton from "~/components/buttons/IconColorButton";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  const members = await getMembers(request);
  return members
    .map((m) => m.members.flat())
    .flat()
    .filter((m) => m.approved)
    .map((m) => ({
      id: m.id,
      value:
        m.firstName +
        " " +
        m.lastName +
        `${m.id === user!.id ? " (You) " : ""}`,
    }));
}

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
  const { toast } = useToast();
  const members = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const location = useLocation();
  let prepList = usePrepList();
  const [deleting, setDeleting] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [openTaskFocus, setOpenTaskFocus] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  if (!prepList) return <h1> No Prep List Found </h1>;
  const generatepdf = async () => {
    setPdfLoading(true);
    console.log(fetcher, fetcher.data);
    const list = (await fetch(`/app/prep/${prepList?.id}/current`, {
      method: "GET",
    }).then((res) => res.json())) as List;
    const pdf = getPdf(list);
    setPdfLoading(false);
    toast({
      title: "PDF Generated",
    });
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

  const pageChangeLoading =
    navigation.state === "loading" &&
    location.pathname !== navigation.location.pathname;

  if (navigation.state === "loading" && pageChangeLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size={14} />
      </div>
    );
  }
  const handleDeleteList = async () => {
    setDeleting(true);
    await fetcher.submit(null, {
      action: `/app/prep/${prepList!.id}/delete`,
      method: "POST",
    });
    toast({
      title: "Prep List Deleted",
    });

    setDeleting(false);
  };
  const handleAssignList = async (id: string | null) => {
    const data = new FormData();
    if (!id) {
      data.set("assignedToId", "");
      console.log("no id");
    } else {
      data.set("assignedToId", id);
      console.log(id);
    }
    fetcher.submit(data, {
      action: `/app/prep/${prepList!.id}/assign`,
      method: "POST",
    });
  };
  return (
    <div className=" container mx-auto mb-28 xl:pl-2">
      {deleting && (
        <div
          className="fixed inset-0 bg-white/90 dark:bg-black/90 z-50"
          aria-hidden="true"
        >
          <div className="w-screen h-screen  flex justify-center items-center">
            <Spinner size={14} />
          </div>
        </div>
      )}
      <DeleteModal
        isOpen={openDeleteModal}
        setIsOpen={setOpenDeleteModal}
        deleteFn={handleDeleteList}
      />
      <AppBar page={""} textSize="text-3xl md:text-4xl" bottomPadding="2">
        <IconColorButton
          name="delete"
          color="red"
          onClick={() => setOpenDeleteModal(true)}
          Icon={Trash2Icon}
          loading={deleting}
        />
        <IconColorButton
          name="task-focus"
          color={openTaskFocus ? "green" : "amber"}
          onClick={() => setOpenTaskFocus(!openTaskFocus)}
          Icon={ClipboardCheckIcon}
        />
        <IconColorButton
          color="violet"
          name="print"
          onClick={generatepdf}
          loading={pdfLoading}
          Icon={Printer}
        />
        <IconColorButton
          name="Goback"
          color="zinc"
          onClick={() => navigate(-1)}
          Icon={ArrowUturnLeftIcon}
        />
      </AppBar>
      <div className="md:text-4xl text-2xl text-zinc-800 dark:text-zinc-200 ">
        {prepList.name}
      </div>
      <div className="mb-2 text-sm md:text-lg text-indigo-500 ">
        {new Date(prepList.date).toDateString()}
      </div>

      <SlideUpTransition>
        <div className="w-full grid  gap-2 mt-2">
          <div className="w-full flex flex-col gap-2">
            <ComboBox
              name="users"
              displayText={"Assigned to : "}
              changeHandler={(v) => handleAssignList(v?.id ?? null)}
              initValue={
                prepList.assignedToId
                  ? members.find((m) => m.id === prepList!.assignedToId)
                  : undefined
              }
              options={members}
              placeholder="Assign to user"
            />
          </div>
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
          </div>
        </div>
      </SlideUpTransition>
    </div>
  );
}

export default PrepListRoute;
