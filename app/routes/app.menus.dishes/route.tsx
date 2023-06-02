import type { LoaderArgs } from "@remix-run/node";
import {
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import Spinner from "~/components/LoadingSpinner";

import { getDishes } from "~/utils/dishes.server";
import MenuSearch from "../app.menus._index/Components/MenuSearch";

import ListCard from "~/components/display/ListCard";
import FadeIn from "~/components/animations/FadeIn";

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
  const dishes = await getDishes();
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const search = params.get("search");
  const allergies = params.get("allergies")?.split(",");
  let dishList = filterDishes(dishes, search, allergies);
  return dishList;
}

function DishesPage() {
  const dishes = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const navigation = useNavigation();
  const pageChangeLoading =
    navigation.state === "loading" &&
    navigation.location.pathname !== "/app/menus/dishes";

  if (pageChangeLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Spinner size={14} />
      </div>
    );
  }
  return (
    <FadeIn>
      <div className="flex flex-col gap-2 mb-24 mt-1">
        <MenuSearch
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
        <div className="flex flex-col gap-2">
          {navigation.state === "loading" && !pageChangeLoading ? (
            <div className="flex items-center justify-center">
              <Spinner size={14} />
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-center  ">
              {dishes && dishes.length > 0 ? (
                dishes.map((d) => (
                  <ListCard
                    subHeading={`${d._count.ingredients} Component${
                      d._count.ingredients !== 1 ? "s" : ""
                    } `}
                    to={`/app/menus/dishes/${d.id}`}
                    key={d.id}
                    name={d.name}
                    user={d.author!.firstName[0] + d.author!.lastName[0]}
                  />
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
    </FadeIn>
  );
}

export default DishesPage;
