import type { FC } from "react";

interface Props {
  color: string;
  content: string;
}

const Avatar: FC<Props> = ({ color, content }) => {
  return (
    <div
      className={` trasition-all duration-300 inline-flex group-hover:bg-indigo-500  ${color} group-hover:text-zinc-200  child flex-shrink-0 items-center  justify-center h-12 w-12 overflow-hidden group-hover:border-indigo-500 border-zinc-400 rounded-full  dark:border-zinc-700`}
    >
      <span className=" text-xl ">{content}</span>
    </div>
  );
};

export default Avatar;
