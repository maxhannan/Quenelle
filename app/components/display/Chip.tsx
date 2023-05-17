import type { FC } from "react";

interface Props {
  content: string;
}

const Chip: FC<Props> = ({ content }) => {
  return (
    <div className="border border-violet-500 p-1 px-3 rounded-xl flex-grow-0  lg:text-lg text-base text-violet-700 dark:text-violet-500 ">
      {content}
    </div>
  );
};

export default Chip;
