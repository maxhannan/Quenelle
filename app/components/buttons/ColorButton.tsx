import type { ComponentPropsWithoutRef, FC, ReactNode } from "react";
import Spinner from "../LoadingSpinner";

interface Props extends ComponentPropsWithoutRef<"button"> {
  color: ButtonColor;
  loading?: boolean;
  loadingText?: string;
}
// should be same colors as from colorVariants
export type ButtonColor =
  | "green"
  | "red"
  | "blue"
  | "yellow"
  | "indigo"
  | "pink"
  | "purple"
  | "orange"
  | "teal"
  | "cyan"
  | "violet"
  | "fuchsia"
  | "rose"
  | "zinc"
  | "amber";
export const buttonStyleVariants = {
  green: "bg-green-300 text-green-900 hover:bg-green-400 hover:text-green-900",
  red: "bg-red-300 text-red-900 hover:bg-red-400 hover:text-red-900",
  blue: "bg-blue-300 text-blue-900 hover:bg-blue-400 hover:text-blue-900",
  yellow:
    "bg-yellow-300 text-yellow-900 hover:bg-yellow-400 hover:text-yellow-900",

  indigo:
    "bg-indigo-300 text-indigo-900 hover:bg-indigo-400 hover:text-indigo-900",
  pink: "bg-pink-300 text-pink-900 hover:bg-pink-400 hover:text-pink-900",
  purple:
    "bg-purple-300 text-purple-900 hover:bg-purple-400 hover:text-purple-900",
  orange:
    "bg-orange-300 text-orange-900 hover:bg-orange-400 hover:text-orange-900",
  teal: "bg-teal-300 text-teal-900 hover:bg-teal-400 hover:text-teal-900",
  cyan: "bg-cyan-300 text-cyan-900 hover:bg-cyan-400 hover:text-cyan-900",
  violet:
    "bg-violet-300 text-violet-900 hover:bg-violet-400 hover:text-violet-900",
  fuchsia:
    "bg-fuchsia-300 text-fuchsia-900 hover:bg-fuchsia-400 hover:text-fuchsia-900",
  rose: "bg-rose-300 text-rose-900 hover:bg-rose-400 hover:text-rose-900",
  zinc: "bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-700 dark:text-zinc-300 dark:hover:text-zinc-200 text-zinc-700 hover:bg-zinc-300 hover:text-zinc-900",
  amber: "bg-amber-300 text-amber-900 hover:bg-amber-400 hover:text-amber-900",
};
const ColorButton: FC<Props> = ({ color, loading, loadingText, ...rest }) => {
  const disabledStyle =
    "opacity-50 cursor-not-allowed bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-700 text-zinc-400";
  return (
    <button
      {...rest}
      className={`
      ${rest.disabled ? disabledStyle : buttonStyleVariants[color]} 
        "font-light rounded-xl text-sm h-10 px-3 py-2 transition-all duration-300 inline-flex gap-1.5 justify-between items-center  `}
    >
      {loading ? (
        <>
          <Spinner size={4} />
          {loadingText ? loadingText : "Loading..."}
        </>
      ) : (
        rest.children
      )}
    </button>
  );
};

export default ColorButton;
