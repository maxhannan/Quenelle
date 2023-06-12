import { useNavigation } from "@remix-run/react";
import type { ElementType } from "react";

interface Props {
  handleNav: (path: string) => void;
  active: string;
  Icon: ElementType;
  path: string;
}

const BottomNavButton = ({ handleNav, active, Icon, path }: Props) => {
  const navigation = useNavigation();
  return (
    <button
      data-tooltip-target="tooltip-home"
      type="button"
      disabled={navigation.state === "submitting"}
      name={path}
      onClick={() => handleNav(path)}
      className="inline-flex flex-col items-center justify-center px-4 rounded-l-lg   group"
    >
      <div
        className={` transition-all duration-300 w-12 h-12 sm:w-12 sm:h-12 flex items-center justify-center rounded-full ${
          active === path
            ? "dark:bg-zinc-800 bg-zinc-300 text-zinc-800 dark:text-zinc-200  "
            : "dark:bg-zinc-200 bg-zinc-800 text-zinc-200 dark:text-zinc-800 "
        } `}
      >
        <Icon className={"  w-7 h-7   "} />
        <span className="sr-only">{path}</span>
      </div>
    </button>
  );
};

export default BottomNavButton;
