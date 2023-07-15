import type { FC, ReactNode } from "react";
import SlideDownTransition from "../animations/SlideDown";
import {
  ChevronLeftSquareIcon,
  CreditCard,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import {
  useFetcher,
  useMatches,
  useNavigate,
  useSubmit,
} from "@remix-run/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { colorVariants } from "~/utils/staticLists";
import { useRouteData } from "~/hooks/useRouteData";
import { type getUser } from "~/utils/auth.server";
import { getFeedMessages } from "~/routes/app/route";
import { buttonStyleVariants } from "../buttons/ColorButton";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { isToday } from "date-fns";
import RecipeCard from "../display/RecipesCard";
import FeedMessageFeed from "../display/FeedMessageFeed";

interface Props {
  page: string;
  textSize?: string;
  children?: ReactNode;
  bottomPadding?: string;
}
type RouteData = {
  user: Awaited<ReturnType<typeof getUser>>;
  feedMessages: Awaited<ReturnType<typeof getFeedMessages>>;
};
const NewAppBar: FC<Props> = ({
  page,
  textSize = "text-4xl",
  bottomPadding,
  children,
}: Props) => {
  const submit = useSubmit();
  const data = useRouteData<RouteData>("routes/app");
  const { user, feedMessages } = data!;
  const assignedListsToday = user!.assignedLists.filter((l) => {
    return isToday(new Date(l.date));
  });
  const fetcher = useFetcher();
  const handleUpdateLastSeen = async () => {
    // setPing(false);
    const data = new FormData();
    data.set("userId", user!.id);
    fetcher.submit(data, { method: "POST", action: "/app/userNotifications" });
  };
  const ping = true;
  console.log({ feedMessages });
  const navigate = useNavigate();
  const colors = Object.values(buttonStyleVariants).filter(
    (color) => !color.includes("zinc") || !color.includes("gray")
  );
  return (
    <>
      <SlideDownTransition>
        <nav
          className={`flex pt-3 ${
            bottomPadding ? `pb-${bottomPadding}` : "pb-3"
          } mx-auto  max-h-full items-center justify-between   duration-300 gap-2   w-full top-0 left-0 `}
        >
          <div className="md:hidden md:opacity-0 md:-z-50">
            <Popover>
              <PopoverTrigger asChild>
                <div
                  onClick={handleUpdateLastSeen}
                  className={`${
                    colors[user!.colorVariant ? user!.colorVariant : 0]
                  } relative data-[state=open]:bg-opacity-90  trasition-all z-0 cursor-pointer duration-300 inline-flex group group-hover:bg-indigo-500  group-hover:text-zinc-200 items-center  child flex-shrink-0 justify-center w-10 h-10  group-hover:border-indigo-500  rounded-lg   `}
                >
                  {/* a notification badge on the corner of box */}

                  {ping && (
                    <span className="absolute -top-[1px] -right-[1px]  z-50">
                      <span className="absolute -top-[1px] -right-[1px] w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                      <span className="absolute -top-[1px] -right-[1px] w-2 h-2 bg-red-500 rounded-full"></span>
                    </span>
                  )}
                  <span className=" text-base group-data-[state=open]:hidden ">
                    {(user!.firstName[0] + user!.lastName[0]).toLowerCase()}
                  </span>
                  <span className=" text-base group-data-[state=closed]:hidden ">
                    <XCircle className="w-5 h-5 " />
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                style={{
                  WebkitBackdropFilter: "blur(10px)",
                }}
                className=" md:hidden md:opacity-0 md:h-0 md:-z-50 ml-2 bg-zinc-50/40 backdrop-blur-lg dark:bg-zinc-900/80 [-webkit-backdrop-filter: blur(10px);] rounded-2xl border-zinc-300 shadow-lg p-2 px-3 w-[90vw]  max-h-[55vh] overflow-y-scroll dark:border-zinc-700 z-10  md:block scrollbar-none"
              >
                <SlideDownTransition>
                  <h3 className="text-3xl dark:text-zinc-200 mb-2">
                    Hi {user?.firstName}!
                  </h3>
                </SlideDownTransition>

                {assignedListsToday.length > 0 && (
                  <div className="mb-4">
                    <div className="w-full flex flex-col gap-1  bg-opacity-40 dark:bg-opacity-40  rounded-2xl">
                      <div className="text-lg text-indigo-500  ">
                        Your prep list{assignedListsToday.length > 1 && "s"} for
                        today.
                      </div>

                      {assignedListsToday.map((l) => (
                        <RecipeCard
                          key={l.id}
                          to={`/app/prep/${l.id}`}
                          subHeading={`Assigned By ${l.author.firstName} ${l.author.lastName}`}
                          user={(
                            l.author.firstName[0] + l.author.lastName[0]
                          ).toLowerCase()}
                          name={l.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <FeedMessageFeed feedMessages={feedMessages} />
              </PopoverContent>
            </Popover>
          </div>
          <h1
            className={` text-3xl lg:text-4xl  text-zinc-800 dark:text-zinc-100`}
          >
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </h1>
          <div className="grow flex justify-end gap-2 items-center relative">
            {children && children}
          </div>
        </nav>
      </SlideDownTransition>
    </>
  );
};

export default NewAppBar;
