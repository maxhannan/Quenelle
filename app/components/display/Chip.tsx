import type { FC } from "react";

interface Props {
  content: string;
}

const Chip: FC<Props> = ({ content }) => {
  return (
    <div className="border border-red-400  p-1 px-3 rounded-xl flex-grow-0  lg:text-lg text-base text-red-500 dark:text-red-400 ">
      {content}
    </div>
  );
};

export default Chip;
