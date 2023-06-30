import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { useState, useEffect } from "react";
import BottomNav from "~/components/navigation/BottomNav";
import ErrorBoundaryLayout from "./ErrorBoundary";
import { redirect, type LoaderArgs } from "@remix-run/node";
import { getUser, requireUserId } from "~/utils/auth.server";
import { Toaster } from "~/components/ui/toaster";

import {
  ClipboardCheckIcon,
  CreditCard,
  FolderIcon,
  HelpCircle,
  List,
  LogOut,
  Newspaper,
  Settings,
  StickyNote,
  Users,
} from "lucide-react";
import BottomNavButton from "~/components/navigation/BottomNavButton";
import Spinner from "~/components/LoadingSpinner";
import { colorVariants } from "~/utils/staticLists";

export function ErrorBoundary() {
  return <ErrorBoundaryLayout />;
}

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request);

  const user = await getUser(request);
  if (!user) return redirect("/login");

  if (!user.approved) {
    if (user.teams.length && user.orgOwner) {
      console.log("redirecting to team setup");
      return redirect(`/setup/team/${user.teams[0].id}`);
    } else {
      if (user.teams.length === 0) return redirect(`/setup/${user.id}`);
      return redirect("/pending");
    }
  }

  return user;
}

const AppLayout = () => {
  const location = useLocation();
  const user = useLoaderData<Awaited<ReturnType<typeof getUser>>>();
  const [page, setPage] = useState(location.pathname.split("/")[2]);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const submit = useSubmit();
  let active = true;
  const handleNav = (path: string) => {
    const pathString = `/app/${path}`;
    if (location.pathname === pathString) {
      setPage(path);
      return;
    }
    setPage(path);
    navigate(pathString);
  };

  useEffect(() => {
    setPage(location.pathname.split("/")[2]);
  }, [location]);

  return (
    <>
      <div className=" ">
        <div className="px-3 xl:px-0  xl:pl-[5.5rem] scrollbar-thin   w-full lg:h-screen lg:overflow-y-scroll">
          {navigation.state === "loading" &&
          navigation.location.pathname.split("/")[2] !==
            location.pathname.split("/")[2] ? (
            <div className="flex justify-center items-center h-screen">
              <Spinner size={14} />
            </div>
          ) : (
            <Outlet />
          )}
        </div>

        <div className="  justify-end bottom-0 top-0 left-1     fixed my-1 xl:flex hidden bg-zinc-100 dark:bg-zinc-900">
          <div className="  dark:bg-zinc-800 bg-zinc-200 rounded-2xl w-full ">
            <div className="flex flex-col  justify-between  items-center h-full my-1 ">
              <div className="flex flex-col gap-4 items-center pt-2 ">
                <div
                  className={`${
                    active
                      ? `${
                          colorVariants[
                            user!.colorVariant ? user!.colorVariant : 0
                          ]
                        } text-zinc-800 `
                      : "dark:bg-zinc-800 bg-zinc-700 text-zinc-200 dark:text-zinc-300 dark:border-zinc-700 border-zinc-500"
                  } trasition-all duration-300 inline-flex group-hover:bg-indigo-500  group-hover:text-zinc-200 items-center  child flex-shrink-0 justify-center w-14 h-14 overflow-hidden group-hover:border-indigo-500  rounded-full   `}
                >
                  <span className=" text-lg lg:text-2xl ">
                    {(user!.firstName[0] + user!.lastName[0]).toLowerCase()}
                  </span>
                </div>
                <BottomNavButton
                  active={page}
                  handleNav={handleNav}
                  path="prep"
                  tooltip
                  colorVariant={1}
                  tooltipText="Prep"
                  Icon={ClipboardCheckIcon}
                />
                <BottomNavButton
                  active={page}
                  handleNav={handleNav}
                  path="recipes"
                  tooltip
                  colorVariant={3}
                  tooltipText="Recipes"
                  Icon={FolderIcon}
                />

                <BottomNavButton
                  active={page}
                  handleNav={handleNav}
                  path=""
                  colorVariant={5}
                  tooltip
                  tooltipText="Feed"
                  Icon={Newspaper}
                />
                <BottomNavButton
                  active={page}
                  handleNav={handleNav}
                  path="menus"
                  colorVariant={2}
                  tooltip
                  tooltipText="Menus & Dishes"
                  Icon={List}
                />

                <BottomNavButton
                  active={page}
                  handleNav={handleNav}
                  colorVariant={11}
                  path="chat"
                  tooltip
                  tooltipText="Team Messages"
                  Icon={StickyNote}
                />
              </div>
              <div className="flex-col justify-between flex pb-4">
                <div className="flex flex-col gap-2">
                  <BottomNavButton
                    active={page}
                    handleNav={handleNav}
                    tooltip
                    colorVariant={12}
                    tooltipText="Settings"
                    path="dashboard"
                    Icon={Settings}
                  />
                  <BottomNavButton
                    active={page}
                    colorVariant={13}
                    handleNav={handleNav}
                    tooltip
                    tooltipText="Team Members"
                    path="dashboard"
                    Icon={Users}
                  />
                  <BottomNavButton
                    active={page}
                    colorVariant={14}
                    handleNav={handleNav}
                    tooltip
                    tooltipText="Billing"
                    path="dashboard"
                    Icon={CreditCard}
                  />
                  <div className="w-full border border-zinc-400 dark:border-zinc-700 mb-2 "></div>
                </div>
                <div className="flex flex-col gap-2">
                  <BottomNavButton
                    active={page}
                    tooltip
                    tooltipText="Help"
                    handleNav={handleNav}
                    colorVariant={9}
                    path="dashboard"
                    Icon={HelpCircle}
                  />
                  <button
                    data-tooltip-target="tooltip-home"
                    type="button"
                    disabled={navigation.state === "submitting"}
                    name={"logout"}
                    onClick={() =>
                      submit(null, { action: "/logout", method: "POST" })
                    }
                    className="inline-flex flex-col items-center justify-center px-4 rounded-l-lg   group"
                  >
                    <div
                      className={` transition-all duration-300 w-12 h-12 sm:w-12 sm:h-12 flex items-center justify-center rounded-full dark:bg-zinc-200 bg-zinc-800 text-zinc-200 dark:text-zinc-800 xl:dark:bg-zinc-800 xl:bg-zinc-200 xl:text-zinc-800 xl:dark:text-zinc-200 `}
                    >
                      <LogOut className={"  w-7 h-7  "} />
                      <span className="sr-only">logout</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xl:hidden">
          <BottomNav page={page} setPage={setPage} />
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default AppLayout;
