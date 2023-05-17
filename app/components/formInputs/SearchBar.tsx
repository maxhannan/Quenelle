import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { Dispatch, FC } from "react";
import Spinner from "../LoadingSpinner";

interface Props {
  handleChange: Dispatch<React.SetStateAction<string>>;
  value: string;
  loading: boolean;
}

const SearchBar: FC<Props> = ({ handleChange, value, loading = false }) => {
  return (
    <div className="grow">
      <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"></label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3  cursor-pointer">
          <MagnifyingGlassIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
        </div>
        <input
          id={"search"}
          name={"search"}
          className={`rounded-2xl transition-all bg-opacity-50 dark:bg-opacity-50 duration-300 font-light block h-12 w-full p-2 pl-10 text-xl text-neutral-900  bg-neutral-200 focus:ring-2 focus:border-neutral-50  border border-neutral-300 focus:outline-none  focus:ring-neutral-400 placeholder-neutral-600 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-neutral-50 dark:focus:ring-violet-500 dark:focus:border-violet-500`}
          placeholder={"Search..."}
          value={value}
          onChange={(e) => {
            handleChange(e.target.value);
          }}
          required
        />
        <div
          onClick={
            value.length > 0 && !loading ? () => handleChange("") : undefined
          }
          className="absolute inset-y-0 right-2 flex items-center pl-3  cursor-pointer"
        >
          {value.length > 0 && !loading && (
            <XMarkIcon className="w-5 h-5 text-violet-500 dark:text-violet-400 cursor-pointer" />
          )}{" "}
          {value.length > 0 && loading && <Spinner size={5} />}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
