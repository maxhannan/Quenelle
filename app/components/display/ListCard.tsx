import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "@remix-run/react";
import type { FC } from "react";

interface Props {
  subHeading: string;
  user: string;
  name: string;

  to: string;
}

const ListCard: FC<Props> = ({ subHeading, user, name, to }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(to)}
      className="w-full  max-h-full group border-zinc-300 border  hover:dark:bg-zinc-900 rounded-2xl p-2 pr-3 flex justify-start items-center  hover:bg-zinc-200  dark:border-zinc-700 transition-all duration-300"
    >
      <div className=" trasition-all duration-300 inline-flex group-hover:bg-indigo-500  group-hover:text-zinc-200  child flex-shrink-0 items-center mr-4 justify-center w-14 h-14 overflow-hidden bg-zinc-100 text-zinc-800 dark:text-zinc-300 border-indigo-400 rounded-2xl  dark:bg-zinc-800 border dark:border-indigo-500">
        <span className=" text-xl lg:text-2xl ">{user.toLowerCase()}</span>
      </div>
      <div className="  pr-2">
        <h5 className="text-xl lg:text-2xl  text-neutral-700 dark:text-neutral-100">
          {name}
        </h5>

        <h6 className="text-sm lg:text-lg mt-1  text-indigo-500 ">
          {subHeading.length > 1 ? subHeading : ""}
        </h6>
      </div>
      <div className=" ml-auto ">
        <ArrowRightIcon className="text-neutral-800 dark:text-neutral-200 w-5 h-5" />
      </div>
    </div>
  );
};

export default ListCard;
