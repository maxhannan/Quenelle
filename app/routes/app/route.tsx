import {
  Outlet,
  useLoaderData,
  useLocation,
  useOutletContext,
} from "@remix-run/react";
import { useState, useEffect } from "react";
import BottomNav from "~/components/navigation/BottomNav";
import ErrorBoundaryLayout from "./ErrorBoundary";
import { LoaderArgs } from "@remix-run/node";
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
    <html lang="en">
      <head>
        <meta charSet="utf-8" />

        <meta
          name="theme-color"
          content="#171717"
          media="(prefers-color-scheme: dark)"
        />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1, maximum-scale=1.0,user-scalable=0 "
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="display" content="standalone" />
      </head>
      <body className="bg-neutral-100 dark:bg-neutral-900">
        <div className=" px-3 ">
          <div className="container  mx-auto">
            <Outlet />
          </div>
          <BottomNav page={page} setPage={setPage} />
        </div>
      </body>
    </html>
  );
};

export default AppLayout;
