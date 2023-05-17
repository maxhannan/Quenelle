import {
  Meta,
  Outlet,
  useLoaderData,
  useLocation,
  useOutletContext,
} from "@remix-run/react";
import { useState, useEffect } from "react";
import BottomNav from "~/components/navigation/BottomNav";
import ErrorBoundaryLayout from "./ErrorBoundary";
import { LoaderArgs, MetaFunction } from "@remix-run/node";
import { getUser, requireUserId } from "~/utils/auth.server";

export function ErrorBoundary() {
  return <ErrorBoundaryLayout />;
}
export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Quenelle",
  viewport:
    "width=device-width,initial-scale=1, maximum-scale=1.0,user-scalable=0 ",
  "apple-mobile-web-app-capable": "yes",

  display: "standalone",
  "mobile-web-app-capable": "yes",

  "apple-touch-fullscreen": "yes",
});

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request);
  const user = await getUser(request);

  return user;
}

type ContextType = Awaited<ReturnType<typeof loader>>;

const AppLayout = () => {
  const user = useLoaderData<ContextType>();
  const location = useLocation();
  const [page, setPage] = useState(location.pathname.split("/")[2]);
  useEffect(() => {
    setPage(location.pathname.split("/")[2]);
  }, [location]);
  return (
    <html lang="en">
      <head>
        <Meta />
      </head>
      <div className=" px-3 ">
        <div className="container  mx-auto">
          <Outlet context={{ user }} />
        </div>
        <BottomNav page={page} setPage={setPage} />
      </div>
    </html>
  );
};

export function useUser() {
  return useOutletContext<ContextType>();
}

export default AppLayout;
