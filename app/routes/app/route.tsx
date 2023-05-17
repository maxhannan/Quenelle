import { Outlet, useLocation } from "@remix-run/react";
import { useState, useEffect } from "react";
import BottomNav from "~/components/navigation/BottomNav";
import ErrorBoundaryLayout from "./ErrorBoundary";

export function ErrorBoundary() {
  return <ErrorBoundaryLayout />;
}

const AppLayout = () => {
  const location = useLocation();
  const [page, setPage] = useState(location.pathname.split("/")[2]);
  useEffect(() => {
    setPage(location.pathname.split("/")[2]);
  }, [location]);
  return (
    <div className=" px-3 ">
      <div className="container  mx-auto">
        <Outlet />
      </div>
      <BottomNav page={page} setPage={setPage} />
    </div>
  );
};

export default AppLayout;
