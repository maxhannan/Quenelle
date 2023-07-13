import { useNavigation } from "@remix-run/react";
import type { ElementType } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Tooltip";
import { colorVariants } from "~/utils/staticLists";
import { ButtonColor, buttonStyleVariants } from "../buttons/ColorButton";

interface Props {
  handleNav: (path: string) => void;
  active: string;
  Icon: ElementType;
  path: string;
  tooltip?: boolean;
  tooltipText?: string;
  tooltipPosition?: "top" | "right";
  color: ButtonColor;
}

const BottomNavButton = ({
  handleNav,
  active,
  Icon,
  path,
  tooltip = false,
  tooltipText,
  tooltipPosition = "right",
  color,
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
          className={` transition-all duration-300 w-12 h-12 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl ${
            active === path
              ? buttonStyleVariants[color]
              : "dark:bg-zinc-800 bg-zinc-50 md:bg-zinc-200 text-zinc-800 dark:text-zinc-200  "
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
              className={` transition-all duration-300 w-12 h-12 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl ${
                active === path
                  ? buttonStyleVariants[color]
                  : " dark:bg-zinc-800 bg-zinc-200 text-zinc-800 dark:text-zinc-200 "
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
