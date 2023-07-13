import type { ComponentPropsWithoutRef, ElementType, FC } from "react";
import { buttonStyleVariants, type ButtonColor } from "./ColorButton";
import Spinner from "../LoadingSpinner";

interface Props extends ComponentPropsWithoutRef<"button"> {
  Icon: ElementType;
  color: ButtonColor;
  loading?: boolean;
}

const IconColorButton: FC<Props> = ({ Icon, color, loading, ...rest }) => {
  const disabledStyle =
    "opacity-50 cursor-not-allowed bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-700 text-zinc-400";
  console.log({ disabled: rest.disabled });
  return (
    <button
      {...rest}
      className={`
        ${
          rest.disabled ? disabledStyle : buttonStyleVariants[color]
        } font-light rounded-xl text-base px-2 py-2 w-10 h-10  transition-all duration-300 inline-flex justify-center items-center `}
    >
      {loading ? (
        <>
          <Spinner size={6} />
        </>
      ) : (
        <Icon className="h-6 w-6" />
      )}
    </button>
  );
};

export default IconColorButton;
