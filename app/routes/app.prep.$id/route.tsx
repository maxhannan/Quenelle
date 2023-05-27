import { LoaderArgs, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { getPrepListById } from "~/utils/prepList.server";

export async function loader({ params }: LoaderArgs) {
  if (!params.id) return null;
  const prepList = await getPrepListById(params.id);
  return prepList;
}

type ContextType = Awaited<ReturnType<typeof loader>>;

function PrepListLayout() {
  const prepList = useLoaderData<ContextType>();
  return <Outlet context={prepList} />;
}

export function usePrepList() {
  return useOutletContext<ContextType>();
}

export default PrepListLayout;
