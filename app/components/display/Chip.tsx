import type { FC } from "react";

interface Props {
  content: string;
}

const Chip: FC<Props> = ({ content }) => {
  return (
    <div className=" bg-red-300  p-1 px-3 rounded-full flex-grow-0  lg:text-sm text-sm text-red-900 dark:text-red-900 ">
      {content}
    </div>
  );
};

export default Chip;
