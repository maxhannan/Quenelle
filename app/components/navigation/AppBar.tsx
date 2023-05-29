import type { FC, ReactNode } from "react";
import SlideDownTransition from "../animations/SlideDown";

interface Props {
  page: string;
  textSize?: string;
  children?: ReactNode;
  bottomPadding?: string;
}

const AppBar: FC<Props> = ({
  page,
  textSize = "text-4xl",
  bottomPadding = "2",
  children,
}: Props) => {
  return (
    <SlideDownTransition>
      <nav
        className={`flex pt-3 pb-${bottomPadding} mx-auto  max-h-full items-center justify-between  duration-300    w-full top-0 left-0 `}
      >
        <h1 className={`${textSize} mr-6 text-zinc-800 dark:text-zinc-100`}>
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
