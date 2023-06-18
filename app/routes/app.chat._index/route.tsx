import { Transition } from "@headlessui/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { TextareaAutosize } from "@mui/base";
import {
  CircleEllipsisIcon,
  File,
  MailIcon,
  OptionIcon,
  PlusCircleIcon,
  PlusIcon,
  Sailboat,
  SaveIcon,
  Send,
  SendIcon,
  XCircleIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import Spinner from "~/components/LoadingSpinner";
import IconButton from "~/components/buttons/IconButton";
import CustomModal from "~/components/display/CustomModal";
import SearchBar from "~/components/formInputs/SearchBar";
import TextArea from "~/components/formInputs/TextArea";
import TextInput from "~/components/formInputs/TextInput";
import NewAppBar from "~/components/navigation/NewAppBar";
import { Checkbox } from "~/components/ui/checkbox";

type Colors = "yellow" | "orange" | "pink" | "indigo" | "green";

function ChatIndex() {
  const [showModal, setShowModal] = useState(false);
  const [activeColor, setActiveColor] = useState<Colors>("yellow");
  const colorVariants = {
    yellow: "bg-yellow-300 ",
    orange: "bg-orange-300 ",
    pink: "bg-pink-300 ",
    indigo: "bg-indigo-300 ",
    green: "bg-green-300 ",
  };

  return (
    <div className="container  mx-auto max-w-4xl xl:max-w-full xl:px-2  ">
      <NewAppBar page="chat" bottomPadding="1">
        <button
          onClick={() => setShowModal(true)}
          className=" font-light  bg-indigo-500 rounded-xl text-zinc-100 px-2 py-2 hover:bg-opacity-90 transition-all duration-300 inline-flex gap-1 items-center "
        >
          <PlusIcon className="h-5 w-5" /> Leave a Note
        </button>
      </NewAppBar>
      <CustomModal isOpen={showModal} setIsOpen={setShowModal}>
        <div
          className={`flex flex-col gap-2 w-full  rounded-xl p-2 transition-all duration-300 ${colorVariants[activeColor]}  `}
        >
          <div className="flex flex-row justify-end gap-2 items-center">
            <button
              onClick={() => setActiveColor("orange")}
              className={`${
                activeColor === "orange" ? "border-2 border-zinc-500 " : " "
              } h-7 w-7 rounded-full bg-orange-500 text-zinc-100 transition-all duration-300`}
            />
            <button
              onClick={() => setActiveColor("pink")}
              className={`${
                activeColor === "pink" ? "border-2 border-zinc-500 " : " "
              } h-7 w-7 rounded-full bg-pink-500 text-zinc-100 transition-all duration-300`}
            />
            <button
              onClick={() => setActiveColor("indigo")}
              className={`${
                activeColor === "indigo" ? "border-2 border-zinc-500 " : " "
              } h-7 w-7 rounded-full bg-indigo-500 text-zinc-100 transition-all duration-300`}
            />
            <button
              onClick={() => setActiveColor("green")}
              className={`${
                activeColor === "green" ? "border-2 border-zinc-500 " : " "
              } h-7 w-7 rounded-full bg-green-500 text-zinc-100 transition-all duration-300`}
            />
            <button
              onClick={() => setActiveColor("yellow")}
              className={`${
                activeColor === "yellow" ? "border-2 border-zinc-500 " : " "
              } h-7 w-7 rounded-full bg-yellow-500 text-zinc-100 transition-all duration-300`}
            />
            <button>
              <XIcon className="h-7 w-7" />
            </button>
          </div>

          <TextareaAutosize
            autoFocus
            minRows={3}
            placeholder="Leave a note..."
            className=" scrollbar-none resize-none rounded-2xl h-48 focus:ring-indigo-500 bg-transparent focus:border-indigo-500 focus:outline-none  transition-all duration-300 focus:ring-2 font-light    w-full p-2 pl-4 text-xl text-zinc-800     placeholder-zinc-600   dark:placeholder-neutral-400 dark:text-neutral-50    "
          />

          <div className="flex flex-col ">
            <div className="flex p-2 gap-2 items-center  ">
              <Checkbox className="w-5 h-5 border-zinc-500 rounded-lg text-xl" />
              <input
                placeholder="Type Something..."
                className="w-full bg-transparent  focus:ring-0 focus:outline-none focus:border-b focus:border-indigo-500 text-base placeholder:text-zinc-600 rounded-none"
              />
              <button className="">
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
            <button className="w-full flex flex-row justify-center items-center gap-2  bg-transparent rounded-2xl p-2 text-base text-zinc-800 font-light hover:bg-opacity-90 transition-all duration-300 border border-dashed">
              Add a Checklist Item
              <PlusCircleIcon className="h-4 w-4" />
            </button>
          </div>
          <div>
            <button className="w-full flex flex-row justify-center items-center gap-2 bg-zinc-100 bg-opacity-30 rounded-2xl p-2 text-xl text-zinc-800 font-light hover:bg-opacity-90 transition-all duration-300">
              Post
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}

export default ChatIndex;
