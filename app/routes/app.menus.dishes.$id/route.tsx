import type { LoaderArgs } from "@remix-run/node";

import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { getDishById } from "~/utils/dishes.server";

export async function loader({ params }: LoaderArgs) {
  if (!params.id) return null;
  const dish = await getDishById(params.id);
  return dish;
}

type ContextType = Awaited<ReturnType<typeof loader>>;

function DishLayout() {
  const dish = useLoaderData<ContextType>();

  return <Outlet context={dish} />;
}

export function useDish() {
  return useOutletContext<ContextType>();
}

export default DishLayout;
