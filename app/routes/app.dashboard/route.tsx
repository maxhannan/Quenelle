import { type LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import { Users } from "lucide-react";
import NewAppBar from "~/components/navigation/NewAppBar";
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
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
      <aside className="-mx-4 lg:w-1/5"></aside>
      <div className="flex-1 lg:max-w-2xl">
        {" "}
        <Outlet context={{ user }} />
      </div>
    </div>
  );
}

export function useUserContext() {
  return useOutletContext<ContextType>();
}
export default DashboardLayout;
