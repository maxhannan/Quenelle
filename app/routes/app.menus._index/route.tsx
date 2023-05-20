import type { LoaderArgs } from "@remix-run/node";
import {
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import Spinner from "~/components/LoadingSpinner";

import { getMenus } from "~/utils/menus.server";
import MenuSearch from "./Components/MenuSearch";

import ListCard from "~/components/display/ListCard";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);

  const search = params.get("search");
  const menus = await getMenus();

  if (search && search.length > 0 && menus) {
    return menus.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  return menus;
}

function MenuIndex() {
  const menus = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageChangeLoading =
    navigation.state === "loading" &&
    navigation.location.pathname !== "/app/menus";

  if (pageChangeLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Spinner size={14} />
      </div>
    );
  }
  return (
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
  );
}

export default MenuIndex;
