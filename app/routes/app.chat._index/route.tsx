import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import {
  CircleEllipsisIcon,
  MailIcon,
  OptionIcon,
  SendIcon,
} from "lucide-react";
import Spinner from "~/components/LoadingSpinner";
import IconButton from "~/components/buttons/IconButton";
import SearchBar from "~/components/formInputs/SearchBar";
import TextInput from "~/components/formInputs/TextInput";
import NewAppBar from "~/components/navigation/NewAppBar";

function ChatIndex() {
  let active = false;
  let loading = false;
  return (
    <div className="container  mx-auto max-w-4xl xl:max-w-full xl:px-2 flex flex-col justify-between gap-2 h-screen  ">
      <NewAppBar page="chat" bottomPadding="1"></NewAppBar>
      <div className=" h-full max-h-full overflow-y-scroll  bg-zinc-200 dark:bg-zinc-800 rounded-2xl p-4 scrollbar-none scrollbar-track-rounded-2xl scrollbar-track-zinc-100 dark:scrollbar-track-zinc-900 scrollbar-thumb-zinc-600 dark:scrollbar-thumb-zinc-500 scrollbar-thumb-rounded-2xl">
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>

        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>

        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>

        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>

        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>

        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>

        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>

        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>

        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>

        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>

        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>

        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>

        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>

        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>

        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>

        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>

        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
        <div className="w-full h-16 mb-2 dark:bg-zinc-700 bg-zinc-300  rounded-2xl "></div>
      </div>
      <div className=" flex  gap-2 container mx-auto xl:max-w-full   px-1">
        <div className="flex-none hidden sm:block">
          <IconButton Icon={CircleEllipsisIcon} />
        </div>
        <TextInput placeholder="Send a message..." />
        <div className="flex-none">
          <IconButton Icon={PaperAirplaneIcon} active={true} />
        </div>
      </div>

      <div className="h-32 sm:h-28 xl:h-2  "></div>
    </div>
  );
}

export default ChatIndex;
