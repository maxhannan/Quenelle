import { TextareaAutosize } from "@mui/base";
import type { ComponentPropsWithoutRef, FC } from "react";

interface Props extends ComponentPropsWithoutRef<"textarea"> {}

const TextArea: FC<Props> = ({ ...props }) => {
  return (
    <TextareaAutosize
      className="col-span-5 rounded-2xl focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none bg-zinc-100  focus:ring-2   font-light border relative  border-zinc-300 dark:border-zinc-700 h-12 w-full p-2 pl-4 text-xl text-zinc-800 dark:bg-zinc-900      placeholder-neutral-500   dark:placeholder-neutral-400 dark:text-neutral-50    "
      minRows={2}
      {...props}
    />
  );
};

export default TextArea;
