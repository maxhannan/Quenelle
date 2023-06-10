import { useNavigation } from "@remix-run/react";
import type { FC } from "react";
import Spinner from "~/components/LoadingSpinner";

import FadeIn from "~/components/animations/FadeIn";
import ListCard from "~/components/display/ListCard";
import type { getMenus } from "~/utils/menus.server";

interface Props {
  pageChangeLoading: boolean;
  menus: Awaited<ReturnType<typeof getMenus>>;
}

const MenuPages: FC<Props> = ({ menus, pageChangeLoading }) => {
  const navigation = useNavigation();
  return (
    <FadeIn>
      <div className="flex flex-col gap-2 mb-24 mt-1">
        {/* <MenuSearch
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      /> */}
        <div className="flex flex-col gap-2">
          {navigation.state === "loading" && !pageChangeLoading ? (
            <div className="flex items-center justify-center">
              <Spinner size={14} />
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-center">
              {menus && menus.length ? (
                menus.map((m) => (
                  <ListCard
                    subHeading={`${m._count.dishes} Dish${
                      m._count.dishes !== 1 ? "es" : ""
                    } `}
                    to={`/app/menus/${m.id}`}
                    key={m.id}
                    name={m.name}
                    user={m.author!.firstName[0] + m.author!.lastName[0]}
                  />
                ))
              ) : (
                <div className="text-xl text-neutral-700 dark:text-neutral-200 mt-2">
                  No Menus Found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
};

export default MenuPages;
