import { type LoaderArgs } from "@remix-run/node";
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
  return (
    <div className="flex">
      <div className="relative xl:w-1/3 2xl:w-1/4 border-r dark:border-zinc-800 h-screen bg-zinc-100  dark:bg-zinc-900 overflow-y-scroll flex-none hidden xl:flex scrollbar-none scrollbar-track-zinc-100 dark:scrollbar-track-zinc-900 scrollbar-thumb-zinc-600 dark:scrollbar-thumb-zinc-500 scrollbar-thumb-rounded-2xl"></div>

      <div className="w-full xl:h-screen xl:overflow-y-scroll scrollbar-none">
        <Outlet context={{ user }} />
      </div>
    </div>
  );
}

export function useUserContext() {
  return useOutletContext<ContextType>();
}
export default DashboardLayout;
