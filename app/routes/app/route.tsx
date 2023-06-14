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
} from "@heroicons/react/24/outline";
import { ClipboardCheckIcon, FolderIcon, HomeIcon } from "lucide-react";
import BottomNavButton from "~/components/navigation/BottomNavButton";
import Spinner from "~/components/LoadingSpinner";

export function ErrorBoundary() {
  return <ErrorBoundaryLayout />;
}

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request);
  const user = await getUser(request);
  if (!user) return redirect("/login");
  console.log(user);
  if (!user.approved) {
    if (user.teams.length && user.orgOwner) {
      console.log("redirecting to team setup");
      return redirect(`/setup/team/${user.teams[0].id}`);
    } else {
      if (user.teams.length === 0) return redirect(`/setup/${user.id}`);
      return redirect("/pending");
    }
  }
  console.log(user);

  return user;
}

const AppLayout = () => {
  const location = useLocation();
  const [page, setPage] = useState(location.pathname.split("/")[2]);
  const navigate = useNavigate();
  const navigation = useNavigation();

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
        <div className="px-3 xl:px-0 scrollbar-thin   w-full lg:h-screen lg:overflow-y-scroll">
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

        <div className="xl:w-1/3 2xl:w-1/4   justify-center bottom-6 fixed pr-6 xl:flex hidden">
          <div className="py-3 px-2 w-96  bg-zinc-800 dark:bg-zinc-200 rounded-full">
            <div className="grid h-full max-w-lg  mx-auto grid-cols-5 gap-0">
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
                path=""
                Icon={HomeIcon}
              />
              <BottomNavButton
                active={page}
                handleNav={handleNav}
                path="menus"
                Icon={QueueListIcon}
              />

              <BottomNavButton
                active={page}
                handleNav={handleNav}
                path="chat"
                Icon={ChatBubbleBottomCenterIcon}
              />
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
