import type { FC } from "react";
import type { Dispatch, SetStateAction } from "react";

import CustomModal from "./CustomModal";
import { FileWarningIcon, XIcon } from "lucide-react";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  deleteFn: () => void;
}

const DeleteModal: FC<Props> = ({ isOpen, setIsOpen, deleteFn }) => {
  return (
    <CustomModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="flex flex-col items-center justify-center  gap-3">
        <div className="mt-3">
          <FileWarningIcon className="w-12 h-12 text-red-500" />
        </div>
        <button
          className=" absolute top-2 right-2"
          onClick={() => setIsOpen(false)}
        >
          <XIcon className="w-6 h-6 text-zinc-500" />
        </button>
        <div className="text-lg  text-center px-2 flex flex-col dark:text-zinc-200">
          Are you sure?
          <span className="font-semibold text-base text-zinc-600 dark:text-zinc-400">
            This action is permanent.
          </span>
        </div>

        <div className="flex gap-2 justify-end w-full p-2 bg-zinc-200 dark:bg-zinc-800 rounded-b-2xl">
          <button
            className="bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 text-zinc-800 px-3 py-1 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-md"
            onClick={deleteFn}
          >
            Delete
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default DeleteModal;
