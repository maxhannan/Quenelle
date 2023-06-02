import type { ComponentPropsWithoutRef, ElementType, FC } from "react";
import Spinner from "../LoadingSpinner";

interface Props extends ComponentPropsWithoutRef<"button"> {
  loading?: boolean;
  size?: number;
  Icon: ElementType;
}

const IconButton: FC<Props> = ({ loading, size = 12, Icon, ...rest }) => {
  return (
    <button
      {...rest}
      disabled={loading}
      className={`text-zinc-700  h-${size}  w-${size} transition-all duration-200 justify-center bg-zinc-300 bg-opacity-30 dark:bg-opacity-40  dark:bg-zinc-800 dark:border-zinc-700 border-zinc-300  hover:bg-zinc-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-neutral-300 font-medium rounded-full text-sm p-2 text-center inline-flex items-center dark:text-zinc-400  dark:hover:text-zinc-200 dark:focus:ring-neutral-800 dark:hover:bg-opacity-70`}
    >
      {loading ? <Spinner size={8} /> : <Icon className={`h-7  w-7`} />}
      <span className="sr-only">{rest.name}</span>
    </button>
  );
};

export default IconButton;
