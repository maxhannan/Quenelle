import { useLocation, useNavigate, useNavigation } from "@remix-run/react";
import Spinner from "~/components/LoadingSpinner";

import MenuSearch from "./Components/MenuSearch";

import SlideDownTransition from "~/components/animations/SlideDown";
import DishesPages from "../app.menus/components/DishesPages";
import MenuButtons from "../app.menus/components/MenuButtons";
import { useMenuContext } from "../app.menus/route";
import MenuPages from "../app.menus/components/MenuPages";
import { PlusIcon } from "lucide-react";
import ColorButton from "~/components/buttons/ColorButton";

function MenuIndex() {
  const navigation = useNavigation();

  const {
    activeTab,
    setActiveTab,
    menus,
    dishes,
    searchParams,
    setSearchParams,
    searchValue,
    setSearchValue,
  } = useMenuContext();
  const navigate = useNavigate();
  const location = useLocation();
  const pageChangeLoading =
    navigation.state === "loading" &&
    navigation.location.pathname !== location.pathname;
  if (pageChangeLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size={14} />
      </div>
    );
  }
  return (
    <>
      <div className=" h-screen w-full  items-center justify-center text-2xl text-zinc-800 dark:text-zinc-200 hidden xl:flex ">
        <h1>Select A {activeTab === "Dishes" ? "Dish" : "Menu"}</h1>
      </div>
      <div className=" container mx-auto max-w-4xl xl:hidden ">
        <SlideDownTransition>
          <nav className=" flex pt-3 pb-1 mx-auto max-h-full items-center justify-between  duration-300 font-light  w-full top-0 left-0  ">
            <MenuButtons activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="grow flex justify-end gap-2">
              <ColorButton
                type="button"
                color="indigo"
                onClick={() =>
                  navigate(`${activeTab === "Dishes" ? "dishes/" : ""}add`)
                }
                className=" font-light  bg-indigo-500 rounded-xl text-zinc-100 px-3 py-2 text-sm hover:bg-opacity-90 transition-all duration-300 inline-flex gap-1 items-center "
              >
                <PlusIcon className="h-5 w-5" /> Add{" "}
                {activeTab === "Dishes" ? "Dish" : "Menu"}
              </ColorButton>
            </div>
          </nav>
        </SlideDownTransition>

        <div className=" mb-28 flex flex-col gap-2 mt-2">
          <MenuSearch
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
          {activeTab === "Dishes" ? (
            <DishesPages
              dishes={dishes}
              pageChangeLoading={!pageChangeLoading}
            />
          ) : (
            <MenuPages menus={menus} pageChangeLoading={!pageChangeLoading} />
          )}
        </div>
      </div>
    </>
  );
}

export default MenuIndex;
