import { PlusIcon, XIcon } from "lucide-react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useEffect, useState } from "react";

import NewAppBar from "~/components/navigation/NewAppBar";

import StickyNote from "./components/StickyNote";
import { LoaderArgs, type ActionArgs } from "@remix-run/node";
import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";
import { getUser } from "~/utils/auth.server";
import { Checkbox } from "~/components/ui/checkbox";
import SlideDownTransition from "~/components/animations/SlideDown";
import SlideUpTransition from "~/components/animations/SlideUp";
import { Transition } from "@headlessui/react";

export async function action({ request }: ActionArgs) {
  const data = await request.formData();

  const todos = JSON.parse(data.get("todos") as string) as {
    id: string;
    text: string;
    completed: boolean;
  }[];
  const content = data.get("note") as string;
  const color = data.get("color") as string;
  const user = await getUser(request);
  let tasks: { content: string; completed: boolean }[] = [];
  if (todos.length > 0) {
    tasks = todos.map((todo) => ({
      content: todo.text,
      completed: todo.completed,
    }));
  }
  if (!user) throw new Error("User not found");
  const note = await prisma.stickyNote.create({
    data: {
      author: {
        connect: {
          id: user.id,
        },
      },
      content,
      color,
      tasks: {
        create: tasks,
      },
      team: {
        connect: {
          id: user.teams[0].id,
        },
      },
    },
  });
  console.log({ note }, "HERE");
  return note;
}

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  if (!user) throw new Error("User not found");
  const notes = await prisma.stickyNote.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      team: {
        id: user.teams[0].id,
      },
    },
    include: {
      tasks: true,
      author: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
  return notes;
}
const colorVariants = {
  yellow: "bg-yellow-300 ",
  orange: "bg-orange-300 ",
  pink: "bg-pink-300 ",
  indigo: "bg-indigo-300 ",
  green: "bg-green-300 ",
};
function ChatIndex() {
  const [showModal, setShowModal] = useState(false);
  const notes = useLoaderData<typeof loader>();
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | undefined>();
  const fetcher = useFetcher();
  useEffect(() => {
    setLoading(false);
    setShowModal(false);
  }, [notes]);
  return (
    <div className="container  mx-auto  max-w-full xl:px-2  ">
      <NewAppBar page="chat" bottomPadding="1">
        <button
          onClick={() => setShowModal(true)}
          className=" font-light  bg-indigo-500 rounded-xl text-zinc-100 px-2 py-2 hover:bg-opacity-90 transition-all duration-300 inline-flex gap-1 items-center  "
        >
          <PlusIcon className="h-5 w-5" /> Leave a Note
        </button>
      </NewAppBar>
      <StickyNote
        showModal={showModal}
        setShowModal={setShowModal}
        loading={loading}
        setLoading={setLoading}
      />
      <div className="mt-4 mb-28 xl:px-4">
        <Transition
          enter="transition-all  ease-in-out  duration-500"
          show={true}
          appear={true}
          enterFrom="opacity-0"
          enterTo="opacity-100 "
        >
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 500: 2, 1200: 3, 1800: 4 }}
          >
            <Masonry gutter="1rem">
              {notes &&
                notes.map((note) => (
                  <div key={note.id}>
                    <div
                      className={`${
                        //@ts-expect-error enum already checked
                        colorVariants[note.color]
                      }  ${
                        deletingId === note.id && "opacity-50"
                      } rounded-xl p-2 flex flex-col transition-all duration-300`}
                    >
                      <div className="w-full flex justify-end">
                        <button
                          disabled={deletingId === note.id}
                          onClick={() => {
                            setDeletingId(note.id);
                            fetcher.submit(null, {
                              method: "POST",
                              action: `/app/chat/delete/${note.id}`,
                            });
                          }}
                          type="button"
                        >
                          <XIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <div>
                        <p className="text-xl font-semibold">{note.content}</p>
                      </div>
                      <div className="flex flex-col ">
                        {note.tasks.map((task) => (
                          <div
                            className="flex gap-2 items-center py-1 "
                            key={task.id}
                          >
                            <Checkbox className="w-5 h-5 border-zinc-500 rounded-lg " />
                            <p className="text-lg">{task.content}</p>
                          </div>
                        ))}
                      </div>
                      <div className=" flex justify-between text-base ">
                        <div>
                          {note.author.firstName} {note.author.lastName}
                        </div>
                        {new Date(note.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
            </Masonry>
          </ResponsiveMasonry>
        </Transition>
      </div>
    </div>
  );
}

export default ChatIndex;
