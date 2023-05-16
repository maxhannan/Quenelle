import { useNavigate } from "@remix-run/react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import React from "react";
interface Props {
  id: string;
  name: string;
  category: string;
  user: string;
  link?: string;
}
const RecipeCard = ({ id, name, category, user, link }: Props) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`${link ? link : ""}${id}`)}
      className="w-full max-h-full font-light border-neutral-300 border dark:bg-opacity-50 bg-opacity-50 bg-neutral-200 rounded-xl py-3 pr-4  flex justify-start items-center  px-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 dark:bg-neutral-800 dark:border-neutral-700"
    >
      <div className="inline-flex flex-shrink-0 items-center mr-4 justify-center w-14 h-14 overflow-hidden bg-neutral-200 text-neutral-700 dark:text-neutral-300 border-neutral-300 rounded-xl  dark:bg-neutral-800 border dark:border-violet-400">
        <span className=" text-xl lg:text-2xl ">{user.toUpperCase()}</span>
      </div>
      <div className="  pr-2">
        <h5 className="text-xl lg:text-2xl  text-neutral-700 dark:text-neutral-100">
          {name}
        </h5>
        {category.length > 1 && (
          <h6 className="text-md lg:text-lg mt-1  text-violet-500 dark:text-violet-400">
            {category}
          </h6>
        )}
      </div>
      <div className=" ml-auto ">
        <ArrowRightIcon className="text-neutral-800 dark:text-neutral-200 w-5 h-5" />
      </div>
    </div>
  );
};
export default RecipeCard;
