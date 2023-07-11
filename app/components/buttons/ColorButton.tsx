import type { ElementType, FC, ReactNode } from "react";

interface Props {
  color: Color;

  children: ReactNode;
}
// should be same colors as from colorVariants
type Color =
  | "green"
  | "red"
  | "blue"
  | "yellow"
  | "gray"
  | "indigo"
  | "pink"
  | "purple"
  | "orange"
  | "teal"
  | "cyan"
  | "gray"
  | "violet"
  | "fuchsia"
  | "rose";
const ColorButton: FC<Props> = ({ color, children }) => {
  const buttonColor = `bg-${color}-300 hover:bg-${color}-400 text-${color}-800  hover:text-${color}-900`;
  return (
    <button
      type="submit"
      className={`${buttonColor} font-light rounded-xl  px-2 py-2 transition-all duration-300 inline-flex gap-1 items-center `}
    >
      {children}
    </button>
  );
};

export default ColorButton;
