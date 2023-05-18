import { TextareaAutosize } from "@mui/base";
import type { ComponentPropsWithoutRef, FC } from "react";

interface Props extends ComponentPropsWithoutRef<"textarea"> {}

const TextArea: FC<Props> = ({ ...props }) => {
  return (
    <TextareaAutosize
      className="col-span-5  text-xl p-4 focus:ring-2 focus:ring-neutral-500 focus:border-none focus:outline-none  dark:placeholder:text-neutral-500 rounded-xl h-16 bg-neutral-200 dark:bg-neutral-800 active:outline-none text-neutral-800 dark:text-neutral-100 text-light border-0 "
      minRows={2}
      {...props}
    />
  );
};

export default TextArea;
