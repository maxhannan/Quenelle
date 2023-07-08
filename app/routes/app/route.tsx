import {
  Outlet,
  useLoaderData,
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

import Spinner from "~/components/LoadingSpinner";

import SideNav from "~/components/navigation/SideNav";
import { prisma } from "~/utils/prisma.server";
import { compareAsc } from "date-fns";

export function ErrorBoundary() {
  return <ErrorBoundaryLayout />;
}

export const getFeedMessages = async (userId: string) => {
  const feedMessages = await prisma.feedMessage.findMany({
    where: {
      teams: {
        some: {
          members: {
            some: {
              id: userId,
            },
          },
        },
      },
    },
    take: 50,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      linkRecipe: {
        include: {
          _count: {
            select: {
              ingredients: true,
              linkedIngredients: true,
              menu: true,
              section: true,
            },
          },
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              colorVariant: true,
            },
          },
        },
      },
      linkMenu: {
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
              colorVariant: true,
            },
          },
          _count: {
            select: {
              sections: true,
              dishes: true,
            },
          },
        },
      },
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          colorVariant: true,
        },
      },
    },
  });
  return feedMessages;
};
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

  const feedMessages = await getFeedMessages(user.id);

  const assignedLists = user!.assignedLists;

  return { user, feedMessages, assignedLists };
}
type RouteData = {
  user: Awaited<ReturnType<typeof getUser>>;
  feedMessages: Awaited<ReturnType<typeof getFeedMessages>>;
};
const AppLayout = () => {
  const location = useLocation();
  const { user, feedMessages } = useLoaderData<RouteData>();
  const [page, setPage] = useState(location.pathname.split("/")[2]);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const [ping, setPing] = useState(false);
  useEffect(() => {
    if (
      feedMessages.filter((m) => {
        if (
          compareAsc(new Date(m.createdAt), new Date(user!.lastLogin)) === 1
        ) {
          return true;
        } else {
          return false;
        }
      }).length > 0
    ) {
      setPing(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedMessages]);

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
        <div className="px-3 md:px-3  md:pl-[6rem] scrollbar-thin   w-full lg:h-screen lg:overflow-y-scroll">
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

        <SideNav
          handleNav={handleNav}
          page={page}
          setPing={setPing}
          // @ts-ignore weird date type error
          user={user}
          // @ts-ignore weird date type error
          feedMessages={feedMessages}
          ping={ping}
        />
        <div className="md:hidden">
          <BottomNav page={page} setPage={setPage} />
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default AppLayout;
