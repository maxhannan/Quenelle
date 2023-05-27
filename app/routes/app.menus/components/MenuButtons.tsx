import { useNavigate } from "@remix-run/react";
import type { FC } from "react";

interface Props {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const MenuButtons: FC<Props> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-2 max-w-md ">
      <button
        onClick={() => {
          setActiveTab("Menus");
          navigate("/app/menus");
        }}
        className={` bg-zinc-200 border grow border-r-0 border-zinc-300 text-lg justify-center rounded-l-xl px-4 p-2 inline-flex  h-12 items-center   sm:hover:bg-zinc-300  transition-all duration-200 dark:bg-zinc-800  dark:border-zinc-700  ${
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
          navigate("/app/menus/dishes");
        }}
        className={` bg-zinc-200 border grow  border-zinc-300 text-lg justify-center rounded-r-xl   px-4 p-2 inline-flex  h-12 items-center   sm:hover:bg-zinc-300  transition-all duration-200 dark:bg-zinc-800  dark:border-zinc-700  ${
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
