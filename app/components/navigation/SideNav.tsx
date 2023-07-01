import type { FC } from "react";
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
} from "lucide-react";
import { useNavigation, useSubmit } from "@remix-run/react";
import { type getUser } from "~/utils/auth.server";

interface Props {
  page: string;
  handleNav: (page: string) => void;
  user: Awaited<ReturnType<typeof getUser>>;
}

const SideNav: FC<Props> = ({ page, handleNav, user }) => {
  const submit = useSubmit();
  const navigation = useNavigation();
  return (
    <div className="  justify-end bottom-0 top-0 left-2    fixed my-1 md:flex hidden bg-zinc-100 dark:bg-zinc-900">
      <div className="  dark:bg-zinc-800 bg-zinc-200 rounded-2xl w-full ">
        <div className="flex flex-col  justify-between  items-center h-full my-1 ">
          <div className="flex flex-col gap-4 items-center pt-2 ">
            <div
              className={`${
                colorVariants[user!.colorVariant ? user!.colorVariant : 0]
              } text-zinc-800 trasition-all duration-300 inline-flex group-hover:bg-indigo-500  group-hover:text-zinc-200 items-center  child flex-shrink-0 justify-center w-14 h-14 overflow-hidden group-hover:border-indigo-500  rounded-full   `}
            >
              <span className=" text-2xl lg:text-2xl ">
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
              <div className="w-full border-t border-zinc-300 dark:border-zinc-700 mb-2 "></div>
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
