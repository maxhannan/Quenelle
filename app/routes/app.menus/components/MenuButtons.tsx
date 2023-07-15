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
        className={` border grow border-r-0 border-zinc-300 text-base font-normal justify-center rounded-l-xl px-2 p-2 inline-flex  h-10 items-center   sm:hover:bg-zinc-300  transition-all duration-200 dark:bg-zinc-800  dark:border-zinc-700  ${
          activeTab === "Menus"
            ? "bg-indigo-300 text-indigo-800 dark:bg-zinc-900 "
            : "bg-opacity-50 text-zinc-700 dark:text-zinc-200"
        }`}
      >
        Menus
      </button>
      <button
        onClick={() => {
          setActiveTab("Dishes");
        }}
        className={`  border grow  border-zinc-300 text-base justify-center rounded-r-xl font-normal  px-2 p-2 inline-flex  h-10 items-center   sm:hover:bg-zinc-300  transition-all duration-200   dark:border-zinc-700  ${
          activeTab === "Dishes"
            ? "bg-indigo-300 text-indigo-800  "
            : "bg-opacity-50 text-zinc-700   dark:text-zinc-200"
        }`}
      >
        Dishes
      </button>
    </div>
  );
};

export default MenuButtons;
