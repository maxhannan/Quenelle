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
        className={` bg-neutral-200 border grow border-r-0 border-neutral-300 text-lg justify-center rounded-l-xl px-4 p-2 inline-flex  h-12 items-center   sm:hover:bg-neutral-300  transition-all duration-200 dark:bg-neutral-800  dark:border-neutral-700  ${
          activeTab === "Menus"
            ? "text-violet-500 dark:bg-neutral-900 "
            : "bg-opacity-50 text-neutral-700 dark:text-neutral-200"
        }`}
      >
        Menus
      </button>
      <button
        onClick={() => {
          setActiveTab("Dishes");
          navigate("/app/menus/dishes");
        }}
        className={` bg-neutral-200 border grow  border-neutral-300 text-lg justify-center rounded-r-xl   px-4 p-2 inline-flex  h-12 items-center   sm:hover:bg-neutral-300  transition-all duration-200 dark:bg-neutral-800  dark:border-neutral-700  ${
          activeTab === "Dishes"
            ? "text-violet-500 dark:bg-neutral-900 "
            : "bg-opacity-50 text-neutral-700   dark:text-neutral-200"
        }`}
      >
        Dishes
      </button>
    </div>
  );
};

export default MenuButtons;
