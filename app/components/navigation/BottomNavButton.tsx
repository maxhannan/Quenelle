import { useNavigation } from "@remix-run/react";
import type { ElementType } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Tooltip";
import { colorVariants } from "~/utils/staticLists";

interface Props {
  handleNav: (path: string) => void;
  active: string;
  Icon: ElementType;
  path: string;
  tooltip?: boolean;
  tooltipText?: string;
  tooltipPosition?: "top" | "right";
  colorVariant?: number;
}

const BottomNavButton = ({
  handleNav,
  active,
  Icon,
  path,
  tooltip = false,
  tooltipText,
  tooltipPosition = "right",
  colorVariant = 0,
}: Props) => {
  const navigation = useNavigation();
  if (!tooltip) {
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
              ? `${colorVariants[colorVariant]} text-zinc-800 xl:text-zinc-800    xl:bg-zinc-800    `
              : "dark:bg-zinc-200 bg-zinc-800 text-zinc-200 dark:text-zinc-800 xl:dark:bg-zinc-800 xl:bg-zinc-200 xl:text-zinc-800 xl:dark:text-zinc-200 "
          } `}
        >
          <Icon className={"  w-7 h-7   "} />
          <span className="sr-only">{path}</span>
        </div>
      </button>
    );
  }
  return (
    <TooltipProvider>
      <Tooltip>
        {tooltip && (
          <TooltipContent align={"center"} side={tooltipPosition}>
            {tooltipText}
          </TooltipContent>
        )}

        <TooltipTrigger>
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
                  ? `${colorVariants[colorVariant]} text-zinc-800   `
                  : "dark:bg-zinc-200 bg-zinc-800 text-zinc-200 dark:text-zinc-800 md:dark:bg-zinc-800 md:bg-zinc-200 md:text-zinc-800 md:dark:text-zinc-200 "
              } `}
            >
              <Icon className={"  w-7 h-7   "} />
              <span className="sr-only">{path}</span>
            </div>
          </button>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BottomNavButton;
