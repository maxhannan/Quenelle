import type { FC, ReactNode } from "react";
import SlideDownTransition from "../animations/SlideDown";
import { UserIcon } from "lucide-react";

interface Props {
  page: string;
  textSize?: string;
  children?: ReactNode;
  bottomPadding?: string;
}

const NewAppBar: FC<Props> = ({
  page,
  textSize = "text-4xl",
  bottomPadding,
  children,
}: Props) => {
  return (
    <>
      <SlideDownTransition>
        <nav
          className={`flex pt-3 ${
            bottomPadding ? `pb-${bottomPadding}` : "pb-2"
          } mx-auto  max-h-full items-center justify-between  duration-300    w-full top-0 left-0 `}
        >
          {" "}
          <div className="grow flex justify-start gap-2 items-center relative">
            <div
              className={` dark:bg-zinc-800 bg-zinc-700 text-zinc-200 dark:text-zinc-300 trasition-all duration-300 inline-flex group-hover:bg-indigo-500  group-hover:text-zinc-200  child flex-shrink-0 items-center justify-center w-12 h-12 overflow-hidden group-hover:border-indigo-500 border-zinc-500 rounded-full  border dark:border-indigo-500`}
            >
              <UserIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="grow flex justify-end gap-2 items-center relative">
            {children && children}
          </div>
        </nav>
      </SlideDownTransition>
      <h1
        className={` text-[2.5rem] font-bold mb-4 text-zinc-800 dark:text-zinc-100`}
      >
        {page.charAt(0).toUpperCase() + page.slice(1)}
      </h1>
    </>
  );
};

export default NewAppBar;
