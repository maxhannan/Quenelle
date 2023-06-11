import type { ComponentPropsWithoutRef, ElementType, FC } from "react";
import Spinner from "../LoadingSpinner";

interface Props extends ComponentPropsWithoutRef<"button"> {
  loading?: boolean;
  size?: number;
  Icon: ElementType;
  active?: boolean;
}

const IconButton: FC<Props> = ({
  active = false,
  loading,
  size = 12,
  Icon,
  ...rest
}) => {
  return (
    <button
      {...rest}
      disabled={loading}
      className={`${
        active
          ? "bg-indigo-500 text-zinc-200 hover:bg-indigo-500"
          : "bg-zinc-300 dark:bg-zinc-800 bg-opacity-30 dark:bg-opacity-40 text-zinc-700 dark:text-zinc-400 dark:hover:bg-opacity-70 hover:bg-zinc-700 dark:hover:text-zinc-200"
      }   h-${size}  w-${size} transition-all duration-200 justify-center    dark:border-zinc-700 border-zinc-300   hover:text-white focus:ring-4 focus:outline-none focus:ring-neutral-300 font-medium rounded-full text-sm p-2 text-center inline-flex items-center    dark:focus:ring-neutral-800 `}
    >
      {loading ? <Spinner size={8} /> : <Icon className={`h-7  w-7`} />}
      <span className="sr-only">{rest.name}</span>
    </button>
  );
};

export default IconButton;
