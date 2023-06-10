import type { LoaderArgs } from "@remix-run/node";
import { getMenuById } from "~/utils/menus.server";

import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";

export async function loader({ params }: LoaderArgs) {
  if (!params.id) return null;
  const menu = await getMenuById(params.id);
  return menu;
}

type ContextType = Awaited<ReturnType<typeof loader>>;

function MenuLayout() {
  const menu = useLoaderData<ContextType>();

  return <Outlet context={menu} />;
}

export function useMenu() {
  return useOutletContext<ContextType>();
}

export default MenuLayout;
