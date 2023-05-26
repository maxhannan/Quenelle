import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { useState, useEffect } from "react";
import BottomNav from "~/components/navigation/BottomNav";
import ErrorBoundaryLayout from "./ErrorBoundary";
import type { LoaderArgs } from "@remix-run/node";
import { getUser, requireUserId } from "~/utils/auth.server";
import { DocumentPlusIcon, UserIcon } from "@heroicons/react/24/outline";
import IconButton from "~/components/buttons/IconButton";
import AppBar from "~/components/navigation/AppBar";
import SearchAndFilter from "../app.recipes._index/components/SearchAndFilter";

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
  const navigate = useNavigate();
  const submit = useSubmit();
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    setPage(location.pathname.split("/")[2]);
  }, [location]);
  return (
    <div className="  ">
      <div className="px-3 lg:px-0">
        <div className="grid grid-cols-1 2xl:grid-cols-12 gap-2 2xl:max-h-screen">
          <div className="lg:bg-zinc-900 col-span-12 2xl:col-span-3 2xl:p-3 2xl:h-screen hidden 2xl:block">
            <div className="2xl:block hidden">
              <AppBar page={"Recipes"}>
                <IconButton
                  onClick={() => navigate("/app/recipes/addrecipe")}
                  Icon={DocumentPlusIcon}
                  name="Add Recipe"
                />
                <IconButton
                  onClick={() =>
                    submit(null, { action: "/logout", method: "post" })
                  }
                  Icon={UserIcon}
                  name="Logout"
                />
              </AppBar>
            </div>
            <div className="">
              <SearchAndFilter
                categories={["All", "Breakfast", "Lunch", "Dinner", "Snack"]}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
            </div>
          </div>
          <div className="2xl:col-span-9">
            <Outlet />
          </div>
        </div>
      </div>
      <BottomNav page={page} setPage={setPage} />
    </div>
  );
};

export default AppLayout;
