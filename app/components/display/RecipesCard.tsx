import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "@remix-run/react";
import type { FC } from "react";

import { buttonStyleVariants } from "../buttons/ColorButton";

interface Props {
  subHeading: string;
  user: string;
  name: string;
  active?: boolean;
  to: string;
  colorVariant?: number;
}

const RecipeCard: FC<Props> = ({
  subHeading,
  user,
  name,
  to,
  active,
  colorVariant = 0,
}) => {
  const navigate = useNavigate();
  const colors = Object.values(buttonStyleVariants).filter(
    (color) => !color.includes("zinc") || !color.includes("gray")
  );

  return (
    <div
      onClick={() => navigate(to)}
      className={`${
        active
          ? "border-indigo-500 dark:border-indigo-500"
          : "border-zinc-200 dark:border-zinc-800"
      }  w-full  max-h-full group cursor-pointer   bg-zinc-200 bg-opacity-30 border dark:bg-zinc-800 hover:dark:bg-zinc-800 dark:bg-opacity-30 rounded-2xl p-2 pr-3 flex justify-start items-center  hover:bg-zinc-300   transition-all duration-300`}
    >
      <div
        className={`${
          active ? "bg-indigo-500 text-zinc-200" : colors[colorVariant]
        } trasition-all duration-300 inline-flex group-hover:bg-indigo-500  group-hover:text-zinc-200  child flex-shrink-0 items-center mr-4 justify-center w-14 h-14 overflow-hidden group-hover:border-indigo-500 border-zinc-500 rounded-2xl   dark:border-zinc-700`}
      >
        <span className=" text-2xl lg:text-2xl ">{user.toLowerCase()}</span>
      </div>
      <div className="  pr-2 ">
        <h5 className="text-xl lg:text-2xl  text-zinc-700 dark:text-zinc-100 ">
          {name}
        </h5>

        {subHeading && subHeading.length > 1 && (
          <div className="flex  ">
            <div className=" ">
              <h6 className="text-sm lg:text-base font-semibold text-indigo-500 flex-none">
                {subHeading.toLowerCase()}
              </h6>
            </div>
          </div>
        )}
      </div>
      <div className=" ml-auto ">
        <ArrowRightIcon className="text-zinc-800 dark:text-zinc-200 w-5 h-5" />
      </div>
    </div>
  );
};

export default RecipeCard;
