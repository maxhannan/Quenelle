import { useRef, type FC, useState, Dispatch } from "react";
import { colorVariants } from "~/utils/staticLists";
import BottomNavButton from "./BottomNavButton";
import {
  ClipboardCheckIcon,
  FolderIcon,
  Newspaper,
  List,
  StickyNote,
  Settings,
  Users,
  CreditCard,
  HelpCircle,
  LogOut,
  XIcon,
  ChevronLeftSquareIcon,
} from "lucide-react";
import { useFetcher, useNavigation, useSubmit } from "@remix-run/react";
import { type getUser } from "~/utils/auth.server";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { getFeedMessages } from "~/routes/app/route";
import FeedMessageFeed from "../display/FeedMessageFeed";
import { set } from "date-fns";

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
  return (
    <div className="  justify-end bottom-0 top-0 left-2    fixed my-1 md:flex hidden bg-zinc-100 dark:bg-zinc-900">
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
                className=" mt-2 bg-zinc-200 dark:bg-zinc-900  rounded-2xl border-zinc-300 shadow-lg p-0  min-w-96 w-[30rem] max-h-[30rem] overflow-y-scroll dark:border-zinc-700 z-10  md:block scrollbar-none"
              >
                <FeedMessageFeed feedMessages={feedMessages} />
              </PopoverContent>
            </Popover>
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
            {user?.orgOwner && (
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
                <div className="w-full border-t border-zinc-300 dark:border-zinc-700 mb-2 "></div>
              </div>
            )}
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
