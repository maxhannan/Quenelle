import type { FC, ReactNode } from "react";
import SlideDownTransition from "../animations/SlideDown";

interface Props {
  page: string;
  textSize?: string;
  children?: ReactNode;
}

const AppBar: FC<Props> = ({
  page,
  textSize = "text-4xl",
  children,
}: Props) => {
  return (
    <SlideDownTransition>
      <nav className="  flex py-3  mx-auto mb-1 max-h-full items-center justify-between  duration-300 bg-neutral-100 dark:bg-neutral-900   w-full top-0 left-0 font-light border-neutral-300 dark:border-neutral-700">
        <h1
          className={`${textSize} mr-6 text-neutral-700 dark:text-neutral-100`}
        >
          {page.charAt(0).toUpperCase() + page.slice(1)}
        </h1>

        <div className="grow flex justify-end gap-2 items-center relative">
          {children && children}
        </div>
      </nav>
    </SlideDownTransition>
  );
};

export default AppBar;
