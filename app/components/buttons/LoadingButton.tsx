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
      className="text-neutral-700 hover:text-neutral-200 inline-flex items-center justify-between px-4 w-full dark:text-neutral-200 bg-neutral-200 dark:bg-neutral-800 h-12 text-xl rounded-2xl  border dark:border-neutral-700 border-neutral-300 hover:bg-violet-500"
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
