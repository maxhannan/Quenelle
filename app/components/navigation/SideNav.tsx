import type { FC, Dispatch } from "react";
import { colorVariants } from "~/utils/staticLists";
import BottomNavButton from "./BottomNavButton";
import {
  ClipboardCheckIcon,
  FolderIcon,
  List,
  StickyNote,
  Settings,
  Users,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronLeftSquareIcon,
} from "lucide-react";
import { useFetcher, useNavigation, useSubmit } from "@remix-run/react";
import { type getUser } from "~/utils/auth.server";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { getFeedMessages } from "~/routes/app/route";
import FeedMessageFeed from "../display/FeedMessageFeed";
import { isToday } from "date-fns";
import NewAppBar from "./NewAppBar";
import RecipeCard from "../display/RecipesCard";

interface Props {
  page: string;
  handleNav: (page: string) => void;
  user: Awaited<ReturnType<typeof getUser>>;
  feedMessages: Awaited<ReturnType<typeof getFeedMessages>>;
  ping: boolean;
  setPing: Dispatch<React.SetStateAction<boolean>>;
}

const SideNav: FC<Props> = ({
  page,
  handleNav,
  user,
  feedMessages,
  ping,
  setPing,
}) => {
  const submit = useSubmit();
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const handleUpdateLastSeen = async () => {
    setPing(false);
    const data = new FormData();
    data.set("userId", user!.id);
    fetcher.submit(data, { method: "POST", action: "/app/userNotifications" });
  };
  const assignedListsToday = user!.assignedLists.filter((l) => {
    return isToday(new Date(l.date));
  });
  return (
    <div className="  justify-end bottom-0 top-0 left-2    fixed my-1 md:flex hidden  dark:bg-zinc-900">
      <div className="  dark:bg-zinc-800 bg-zinc-200 rounded-2xl w-full ">
        <div className="flex flex-col  justify-between  items-center h-full my-1 ">
          <div className="flex flex-col gap-4 items-center pt-2 relative">
            <Popover>
              <PopoverTrigger asChild>
                <div
                  onClick={handleUpdateLastSeen}
                  className={`${
                    colorVariants[user!.colorVariant ? user!.colorVariant : 0]
                  } relative data-[state=open]:bg-opacity-90 text-zinc-800 trasition-all z-0 cursor-pointer duration-300 inline-flex group group-hover:bg-indigo-500  group-hover:text-zinc-200 items-center  child flex-shrink-0 justify-center w-14 h-14  group-hover:border-indigo-500  rounded-2xl   `}
                >
                  {/* a notification badge on the corner of box */}

                  {ping && (
                    <span className="absolute top-0 right-0 z-50">
                      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                    </span>
                  )}
                  <span className=" text-2xl lg:text-2xl group-data-[state=open]:hidden ">
                    {(user!.firstName[0] + user!.lastName[0]).toLowerCase()}
                  </span>
                  <span className=" text-2xl lg:text-2xl group-data-[state=closed]:hidden ">
                    <ChevronLeftSquareIcon className="w-7 h-7 text-zinc-700" />
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent
                side="right"
                sideOffset={25}
                alignOffset={10}
                className=" mt-2 bg-zinc-200 dark:bg-zinc-900  rounded-2xl border-zinc-300 shadow-lg p-2 px-3 min-w-96 w-[30rem] max-h-[50rem] overflow-y-scroll dark:border-zinc-700 z-10  md:block scrollbar-none"
              >
                <NewAppBar
                  page={`Hi ${user!.firstName}!`}
                  bottomPadding="2"
                ></NewAppBar>

                <div className="mb-2">
                  {assignedListsToday.length > 0 && (
                    <div className="w-full flex flex-col gap-1 bg-zinc-200 bg-opacity-40 dark:bg-opacity-40 dark:bg-zinc-900 rounded-2xl">
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
                  )}
                </div>

                <FeedMessageFeed feedMessages={feedMessages} />
              </PopoverContent>
            </Popover>
            <BottomNavButton
              active={page}
              handleNav={handleNav}
              path="prep"
              tooltip
              color="red"
              tooltipText="Prep"
              Icon={ClipboardCheckIcon}
            />
            <BottomNavButton
              active={page}
              handleNav={handleNav}
              path="recipes"
              tooltip
              color="amber"
              tooltipText="Recipes"
              Icon={FolderIcon}
            />

            <BottomNavButton
              active={page}
              handleNav={handleNav}
              path="menus"
              color="green"
              tooltip
              tooltipText="Menus & Dishes"
              Icon={List}
            />

            <BottomNavButton
              active={page}
              handleNav={handleNav}
              color="purple"
              path="chat"
              tooltip
              tooltipText="Team Messages"
              Icon={StickyNote}
            />
          </div>
          <div className="flex-col justify-between flex pb-4">
            {user?.orgOwner && (
              <div className="flex flex-col gap-2">
                <BottomNavButton
                  active={page}
                  handleNav={handleNav}
                  tooltip
                  color="fuchsia"
                  tooltipText="Settings"
                  path="dashboard"
                  Icon={Settings}
                />
                <BottomNavButton
                  active={page}
                  color="cyan"
                  handleNav={handleNav}
                  tooltip
                  tooltipText="Team Members"
                  path="dashboard"
                  Icon={Users}
                />
                <BottomNavButton
                  active={page}
                  color="pink"
                  handleNav={handleNav}
                  tooltip
                  tooltipText="Billing"
                  path="dashboard"
                  Icon={CreditCard}
                />
                <div className="w-full border-t border-zinc-300 dark:border-zinc-700 mb-2 "></div>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <BottomNavButton
                active={page}
                tooltip
                tooltipText="Help"
                handleNav={handleNav}
                color="yellow"
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
                  className={` transition-all duration-300 w-12 h-12 sm:w-12 sm:h-12 flex items-center justify-center rounded-full dark:bg-zinc-200 bg-zinc-800 text-zinc-200 dark:text-zinc-800 md:dark:bg-zinc-800 md:bg-zinc-200 md:text-zinc-800 md:dark:text-zinc-200 `}
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
  );
};

export default SideNav;
