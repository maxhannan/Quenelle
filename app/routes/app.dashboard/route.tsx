import { LoaderArgs, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { getUser } from "~/utils/auth.server";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);

  return user;
}

type ContextType = {
  user: Awaited<ReturnType<typeof loader>>;
};
function DashboardLayout() {
  const user = useLoaderData<typeof loader>();
  return <Outlet context={{ user }} />;
}

export function useUserContext() {
  return useOutletContext<ContextType>();
}
export default DashboardLayout;
