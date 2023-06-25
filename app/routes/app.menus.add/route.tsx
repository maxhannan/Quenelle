import { getDishes } from "~/utils/dishes.server";

import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { getMenus } from "~/utils/menus.server";
import { serviceList } from "~/utils/staticLists";
import { LoaderArgs } from "@remix-run/node";
import { getUser } from "~/utils/auth.server";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  const dishes = await getDishes(user!.teams.map((t) => t.id));
  const menus = await getMenus(user!.teams.map((t) => t.id));
  const services = menus
    ? [...new Set([...menus.map((m) => m.service), ...serviceList])]
    : [];
  return { dishes, services };
}

type ContextType = Awaited<ReturnType<typeof loader>>;

function AddMenuLayout() {
  const { services, dishes } = useLoaderData<ContextType>();
  console.log({ services, dishes });
  return (
    <div className="mb-28 container xl:pl-2 mx-auto">
      <Outlet context={{ services, dishes }} />
    </div>
  );
}

export function useDishesForForm() {
  return useOutletContext<ContextType>();
}

export default AddMenuLayout;
