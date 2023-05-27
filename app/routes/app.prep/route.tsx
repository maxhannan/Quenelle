import type { LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { getPrepLists } from "~/utils/prepList.server";

export async function loader({ request }: LoaderArgs) {
  const prepLists = await getPrepLists();
  return prepLists;
}

type ContextType = Awaited<ReturnType<typeof loader>>;

function PrepListsLayout() {
  const prepLists = useLoaderData<ContextType>();
  return <Outlet context={prepLists} />;
}

export function usePrepLists() {
  return useOutletContext<ContextType>();
}

export default PrepListsLayout;
