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
    <div className="flex-1 lg:max-w-full lg:mx-12">
      <Outlet context={{ user }} />
    </div>
  );
}

export function useUserContext() {
  return useOutletContext<ContextType>();
}
export default DashboardLayout;
