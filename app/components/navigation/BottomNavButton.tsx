import type { ElementType } from "react";

interface Props {
  handleNav: (path: string) => void;
  active: string;
  Icon: ElementType;
  path: string;
}

const BottomNavButton = ({ handleNav, active, Icon, path }: Props) => {
  return (
    <button
      data-tooltip-target="tooltip-home"
      type="button"
      name={path}
      onClick={() => handleNav(path)}
      className="inline-flex flex-col items-center justify-center px-5 rounded-l-lg   group"
    >
      <div
        className={` transition-all duration-300 w-14 h-14 flex items-center justify-center rounded-full ${
          active === path
            ? "dark:bg-indigo-500 bg-zinc-300 text-zinc-800 dark:text-zinc-900  "
            : "dark:bg-zinc-800 bg-zinc-800 text-zinc-200 dark:text-zinc-400 "
        } `}
      >
        <Icon className={"  w-8 h-8   "} />
        <span className="sr-only">{path}</span>
      </div>
    </button>
  );
};

export default BottomNavButton;
