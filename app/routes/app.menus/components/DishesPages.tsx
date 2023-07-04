import { useLocation, useNavigation } from "@remix-run/react";
import { useState, type FC, useEffect } from "react";
import Spinner from "~/components/LoadingSpinner";

import type { getDishes } from "~/utils/dishes.server";

import RecipeCard from "~/components/display/RecipesCard";
interface Props {
  dishes: Awaited<ReturnType<typeof getDishes>>;
  pageChangeLoading: boolean;
}

const DishesPages: FC<Props> = ({ dishes, pageChangeLoading }) => {
  const navigation = useNavigation();
  const [activeId, setActiveId] = useState<string | null>(null);
  const location = useLocation();
  useEffect(() => {
    setActiveId(location.pathname.split("/").slice(-1)[0]);
  }, [location]);
  return (
    <div className="flex flex-col gap-2 mb-24 mt-1">
      <div className="flex flex-col gap-2">
        {navigation.state === "loading" && !pageChangeLoading ? (
          <div className="flex items-center justify-center">
            <Spinner size={14} />
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-center  ">
            {dishes && dishes.length > 0 ? (
              dishes.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setActiveId(d.id)}
                  className="flex w-full"
                >
                  <RecipeCard
                    subHeading={`${d._count.ingredients} Component${
                      d._count.ingredients !== 1 ? "s" : ""
                    } `}
                    to={`/app/menus/dishes/${d.id + location.search} `}
                    key={d.id}
                    colorVariant={d.author.colorVariant}
                    active={d.id === activeId}
                    name={d.name}
                    user={d.author!.firstName[0] + d.author!.lastName[0]}
                  />
                </div>
              ))
            ) : (
              <div className="text-xl text-neutral-700 dark:text-neutral-200 mt-2">
                No Dishes Found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DishesPages;
