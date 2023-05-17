import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";
import type { FC } from "react";

const NoRecipeFound: FC = () => {
  return (
    <div className="h-screen flex items-center justify-center text-red-500 text-2xl flex-col">
      No Recipe Found{" "}
      <Link
        to={"/app/recipes"}
        className=" text-violet-500 dark:text-violet-400 px-1  inline-flex gap-2 items-center hover:text-violet-600 dark:hover:text-violet-500 "
      >
        Go Back <ArrowUturnLeftIcon className="w-5 h-5 pt-1  " />
      </Link>
    </div>
  );
};

export default NoRecipeFound;
