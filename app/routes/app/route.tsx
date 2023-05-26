import { Outlet, useLocation } from "@remix-run/react";
import { useState, useEffect } from "react";
import BottomNav from "~/components/navigation/BottomNav";
import ErrorBoundaryLayout from "./ErrorBoundary";
import type { LoaderArgs } from "@remix-run/node";
import { getUser, requireUserId } from "~/utils/auth.server";

export function ErrorBoundary() {
  return <ErrorBoundaryLayout />;
}

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request);
  const user = await getUser(request);

  return user;
}

const AppLayout = () => {
  const location = useLocation();
  const [page, setPage] = useState(location.pathname.split("/")[2]);
  useEffect(() => {
    setPage(location.pathname.split("/")[2]);
  }, [location]);
  return (
    <div className="  ">
      <div className="px-3">
        <Outlet />
      </div>
      <BottomNav page={page} setPage={setPage} />
    </div>
  );
};

export default AppLayout;
