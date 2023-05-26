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
      className={`text-zinc-700  h-${size}  w-${size}  justify-center bg-zinc-100 border dark:border-zinc-700 border-zinc-300 dark:bg-zinc-800 hover:bg-zinc-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-neutral-300 font-medium rounded-xl text-sm p-2 text-center inline-flex items-center dark:text-neutral-500  dark:hover:text-white dark:focus:ring-neutral-800 dark:hover:bg-neutral-500`}
    >
      {loading ? <Spinner size={8} /> : <Icon className={`h-7  w-7`} />}
      <span className="sr-only">{rest.name}</span>
    </button>
  );
};

export default IconButton;
