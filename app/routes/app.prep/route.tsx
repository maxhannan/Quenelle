import type { LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { getPrepLists, getTemplates } from "~/utils/prepList.server";

export async function loader({ request }: LoaderArgs) {
  const prepLists = await getPrepLists();
  const templates = await getTemplates();
  return { prepLists, templates };
}

type ContextType = Awaited<ReturnType<typeof loader>>;

function PrepListsLayout() {
  const { prepLists, templates } = useLoaderData<ContextType>();
  return <Outlet context={{ prepLists, templates }} />;
}

export function usePrepLists() {
  return useOutletContext<ContextType>();
}

export default PrepListsLayout;
