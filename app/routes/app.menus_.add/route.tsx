import { getDishes } from "~/utils/dishes.server";

import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { getMenus } from "~/utils/menus.server";
import { serviceList } from "~/utils/staticLists";

export async function loader() {
  const dishes = await getDishes();
  const menus = await getMenus();
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
    <div className="mb-28 container max-w-4xl mx-auto">
      <Outlet context={{ services, dishes }} />
    </div>
  );
}

export function useDishesForForm() {
  return useOutletContext<ContextType>();
}

export default AddMenuLayout;
