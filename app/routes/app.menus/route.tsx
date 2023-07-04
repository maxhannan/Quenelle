import {
  useNavigate,
  useLocation,
  Outlet,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useState } from "react";

import MenuButtons from "./components/MenuButtons";
import IconButton from "~/components/buttons/IconButton";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import SlideDownTransition from "~/components/animations/SlideDown";

import MenuPages from "./components/MenuPages";
import type { LoaderArgs } from "@remix-run/node";
import { getMenus } from "~/utils/menus.server";
import { getDishes } from "~/utils/dishes.server";

import DishesPages from "./components/DishesPages";
import MenuSearch from "../app.menus._index/Components/MenuSearch";
import { getUser } from "~/utils/auth.server";

function filterDishes(
  dishes: Awaited<ReturnType<typeof getDishes>>,
  search?: string | null,
  allergies?: string[] | null
) {
  if (!search && !allergies) return dishes;
  let filteredDishes = dishes;
  if (search && filteredDishes) {
    filteredDishes = filteredDishes.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (allergies && filteredDishes) {
    filteredDishes = filteredDishes.filter(
      (d) => d.allergens.filter((a) => allergies.includes(a)).length === 0
    );
  }
  return filteredDishes;
}

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const user = await getUser(request);
  const search = params.get("search");
  let menus = await getMenus(user!.teams.map((t) => t.id));
  const dishList = await getDishes(user!.teams.map((t) => t.id));

  const allergies = params.get("allergies")?.split(",");
  let dishes = filterDishes(dishList, search, allergies);

  if (search && search.length > 0 && menus) {
    menus = menus.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  return { dishes, menus };
}

type ContextType = {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  menus: Awaited<ReturnType<typeof getMenus>>;
  dishes: Awaited<ReturnType<typeof getDishes>>;
  searchParams: URLSearchParams;
  setSearchParams: React.Dispatch<React.SetStateAction<URLSearchParams>>;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
};

export default function MenusLayout() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { dishes, menus } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("section") || "Menus"
  );
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    if (activeTab === "Dishes") {
      searchParams.set("section", "Dishes");
      setSearchParams(searchParams, { replace: true });
    } else {
      searchParams.set("section", "Menus");
      setSearchParams(searchParams, { replace: true });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (location.pathname !== "/app/menus") {
      if (location.pathname.includes("dishes")) {
        setActiveTab("Dishes");
      } else {
        setActiveTab("Menus");
      }
    }
  }, [location.pathname]);

  return (
    <div className="flex ">
      <div className="relative xl:w-1/3 2xl:w-1/4 border-r dark:border-zinc-800 h-screen bg-zinc-100  dark:bg-zinc-900 overflow-y-scroll flex-none hidden xl:flex scrollbar-none scrollbar-track-zinc-100 dark:scrollbar-track-zinc-900 scrollbar-thumb-zinc-600 dark:scrollbar-thumb-zinc-500 scrollbar-thumb-rounded-2xl">
        <div className=" container mx-auto max-w-4xl px-3">
          <SlideDownTransition>
            <nav className=" flex pt-3 pb-1 mx-auto max-h-full items-center justify-between  duration-300 font-light  w-full top-0 left-0  ">
              <MenuButtons activeTab={activeTab} setActiveTab={setActiveTab} />
              <div className="grow flex justify-end gap-2">
                <IconButton
                  Icon={DocumentPlusIcon}
                  name="Add"
                  type="button"
                  onClick={() =>
                    navigate(`${activeTab === "Dishes" ? "dishes/" : ""}add`)
                  }
                />
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
              <DishesPages dishes={dishes} pageChangeLoading={true} />
            ) : (
              // @ts-expect-error
              <MenuPages menus={menus} pageChangeLoading={true} />
            )}
          </div>
        </div>
      </div>
      <div className="w-full xl:h-screen xl:overflow-y-scroll scrollbar-none">
        <Outlet
          context={{
            dishes,
            menus,
            activeTab,
            setActiveTab,
            searchParams,
            setSearchParams,
            searchValue,
            setSearchValue,
          }}
        />
      </div>
    </div>
  );
}

export function useMenuContext() {
  return useOutletContext<ContextType>();
}
