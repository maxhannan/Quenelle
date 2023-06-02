import type { ComponentPropsWithoutRef, ElementType } from "react";
import Spinner from "../LoadingSpinner";

interface Props extends ComponentPropsWithoutRef<"button"> {
  loading?: boolean;
  buttonText: string;
  loadingText?: string;
  Icon: ElementType;
  buttonName: string;
  type?: "button" | "submit" | "reset";
  action?: () => void;
}

const LoadingButton = (props: Props) => {
  return (
    <button
      type={props.type}
      name={props.buttonName}
      onClick={props.action ? props.action : undefined}
      className="text-zinc-800 hover:text-neutral-200 inline-flex items-center justify-between px-4 w-full dark:text-zinc-50 bg-zinc-200 bg-opacity-40 dark:bg-zinc-800 dark:bg-opacity-40  h-12 text-xl rounded-full  border dark:border-zinc-700 border-zinc-300 transition-all duration-300 hover:bg-indigo-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-100"
    >
      {props.loading ? (
        <>
          {props.loadingText} <Spinner />
        </>
      ) : (
        <>
          {props.buttonText} <props.Icon className="w-6 h-6 ml-2" />
        </>
      )}
    </button>
  );
};

export default LoadingButton;
