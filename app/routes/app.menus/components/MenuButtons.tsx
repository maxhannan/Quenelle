import type { FC } from "react";

interface Props {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const MenuButtons: FC<Props> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-2 max-w-md ">
      <button
        onClick={() => {
          setActiveTab("Menus");
        }}
        className={` bg-zinc-200 border grow border-r-0 border-zinc-300 text-lg font-normal justify-center rounded-l-2xl px-3 p-2 inline-flex  h-12 items-center   sm:hover:bg-zinc-300  transition-all duration-200 dark:bg-zinc-800  dark:border-zinc-700  ${
          activeTab === "Menus"
            ? "text-indigo-500 dark:bg-zinc-900 "
            : "bg-opacity-50 text-zinc-700 dark:text-zinc-200"
        }`}
      >
        Menus
      </button>
      <button
        onClick={() => {
          setActiveTab("Dishes");
        }}
        className={` bg-zinc-200 border grow  border-zinc-300 text-lg justify-center rounded-r-2xl font-normal  px-3 p-2 inline-flex  h-12 items-center   sm:hover:bg-zinc-300  transition-all duration-200 dark:bg-zinc-800  dark:border-zinc-700  ${
          activeTab === "Dishes"
            ? "text-indigo-500 dark:bg-zinc-900 "
            : "bg-opacity-50 text-zinc-700   dark:text-zinc-200"
        }`}
      >
        Dishes
      </button>
    </div>
  );
};

export default MenuButtons;
