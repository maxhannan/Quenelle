import {
  Outlet,
  useLocation,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { useState, useEffect } from "react";
import BottomNav from "~/components/navigation/BottomNav";
import ErrorBoundaryLayout from "./ErrorBoundary";
import { redirect, type LoaderArgs } from "@remix-run/node";
import { getUser, requireUserId } from "~/utils/auth.server";
import { Toaster } from "~/components/ui/toaster";
import {
  QueueListIcon,
  ChatBubbleBottomCenterIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import {
  ClipboardCheckIcon,
  CreditCard,
  FolderIcon,
  HelpCircle,
  HomeIcon,
  List,
  LogOut,
  MessageCircle,
  Settings,
  Users,
} from "lucide-react";
import BottomNavButton from "~/components/navigation/BottomNavButton";
import Spinner from "~/components/LoadingSpinner";

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
  const [page, setPage] = useState(location.pathname.split("/")[2]);
  const navigate = useNavigate();
  const navigation = useNavigation();
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
                      ? "bg-indigo-500 text-zinc-200 dark:border-indigo-500 border-indigo-500"
                      : "dark:bg-zinc-800 bg-zinc-700 text-zinc-200 dark:text-zinc-300 dark:border-zinc-700 border-zinc-500"
                  } trasition-all duration-300 inline-flex group-hover:bg-indigo-500  group-hover:text-zinc-200 items-center  child flex-shrink-0 justify-center w-14 h-14 overflow-hidden group-hover:border-indigo-500  rounded-2xl  border `}
                >
                  <span className=" text-lg lg:text-2xl ">mh</span>
                </div>
                <BottomNavButton
                  active={page}
                  handleNav={handleNav}
                  path=""
                  Icon={HomeIcon}
                />
                <BottomNavButton
                  active={page}
                  handleNav={handleNav}
                  path="prep"
                  Icon={ClipboardCheckIcon}
                />
                <BottomNavButton
                  active={page}
                  handleNav={handleNav}
                  path="recipes"
                  Icon={FolderIcon}
                />

                <BottomNavButton
                  active={page}
                  handleNav={handleNav}
                  path="menus"
                  Icon={List}
                />
                <BottomNavButton
                  active={page}
                  handleNav={handleNav}
                  path="chat"
                  Icon={MessageCircle}
                />
              </div>
              <div className="flex-col justify-between flex pb-4">
                <div className="flex flex-col gap-2">
                  <BottomNavButton
                    active={page}
                    handleNav={handleNav}
                    path="dashboard"
                    Icon={Settings}
                  />
                  <BottomNavButton
                    active={page}
                    handleNav={handleNav}
                    path="dashboard"
                    Icon={Users}
                  />
                  <BottomNavButton
                    active={page}
                    handleNav={handleNav}
                    path="dashboard"
                    Icon={CreditCard}
                  />
                  <div className="w-full border border-zinc-400 dark:border-zinc-700 mb-2 "></div>
                </div>
                <div className="flex flex-col gap-2">
                  <BottomNavButton
                    active={page}
                    handleNav={handleNav}
                    path="dashboard"
                    Icon={HelpCircle}
                  />
                  <BottomNavButton
                    active={page}
                    handleNav={handleNav}
                    path="dashboard"
                    Icon={LogOut}
                  />
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
