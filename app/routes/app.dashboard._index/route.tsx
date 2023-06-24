import React from "react";
import { useUserContext } from "../app.dashboard/route";
import { type LoaderArgs } from "@remix-run/node";
import { getMembers } from "~/utils/teams.server";
import { useLoaderData } from "@remix-run/react";
import NewAppBar from "~/components/navigation/NewAppBar";
import {
  ChevronDown,
  Trash,
  Trash2Icon,
  Users,
  Users2Icon,
} from "lucide-react";
import RecipeCard from "~/components/display/ListCard";
import ComboBox from "~/components/formInputs/ComboBox";
import { CheckIcon } from "@heroicons/react/24/outline";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import Avatar from "~/components/display/Avatar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { type DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import Spinner from "~/components/LoadingSpinner";

export async function loader({ request }: LoaderArgs) {
  const teams = await getMembers(request);
  return teams;
}

const colorVariants = [
  "bg-yellow-300 ",
  "bg-orange-300 ",
  "bg-pink-300 ",
  "bg-indigo-300 ",
  "bg-green-300 ",
  "bg-amber-300 ",
  "bg-lime-300 ",
  "bg-teal-300 ",
  "bg-cyan-300 ",
  "bg-sky-300",
  "bg-emerald-300 ",
  "bg-blue-300 ",
  "bg-purple-300 ",
  "bg-violet-300 ",
  "bg-rose-300 ",
  "bg-red-300 ",
];

type Checked = DropdownMenuCheckboxItemProps["checked"];
function DashBoardIndex() {
  const teams = useLoaderData<typeof loader>();
  const [role, setRole] = React.useState("bottom");
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false);
  const [showPanel, setShowPanel] = React.useState<Checked>(false);
  console.log({ teams });
  const { user } = useUserContext();
  return (
    <div className="container max-w-4xl mx-auto">
      <NewAppBar page="Teams" />
      <div className="  rounded-2xl">
        {teams.map((team) => (
          <div key={team.id} className="flex flex-col gap-2 ">
            <div className="flex  justify-between w-full items-center">
              <div>
                <div className="text-xl font-semibold dark:text-zinc-100">
                  {team.name}
                </div>
                <div className="text-base text-zinc-500">
                  {team.city}, {team.state}
                </div>
              </div>
              <div className="">
                <button className="bg-indigo-500 rounded-lg text-sm px-2 py-2 text-zinc-100 hover:bg-indigo-400">
                  {" "}
                  Invite Members{" "}
                </button>
              </div>
            </div>
            <div className="  flex flex-col border-zinc-300 dark:border-zinc-700 border rounded-2xl [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-zinc-300 [&>*:not(:last-child)]:dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800 bg-opacity-60">
              {team.members.map((m) =>
                m.approved ? (
                  <div key={m.id} className="flex flex-col p-2 gap-2 ">
                    <div className="flex justify-between  ">
                      <div className="flex gap-2 items-center">
                        <Avatar
                          color={
                            colorVariants[
                              Math.floor(
                                Math.random() * (colorVariants.length - 1)
                              )
                            ]
                          }
                          content={(
                            m.firstName[0] + m.lastName[0]
                          ).toLowerCase()}
                        />
                        <div>
                          <div className="text-base lg:text-lg font-semibold dark:text-zinc-100">
                            {m.firstName} {m.lastName}
                          </div>
                          <div className="text-sm lg:text-base text-zinc-500">
                            {m.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex  items-start md:items-center  ">
                        <div className="border border-green-500 rounded-2xl p-1 px-2 text-green-500 text-xs md:text-sm font-light">
                          Approved{" "}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        className="mr-auto bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-800 dark:text-zinc-200 border text-xs md:text-sm py-2 px-2 font-light border-red-400  h-8"
                      >
                        Remove
                        <Trash className="ml-2 h-4 w-4 text-muted-foreground" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className=" bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-800 dark:text-zinc-200 border text-sm py-2 px-2 font-light border-zinc-300 dark:border-zinc-700 h-8"
                          >
                            Teams (1)
                            <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuCheckboxItem
                            checked={showStatusBar}
                            onCheckedChange={setShowStatusBar}
                          >
                            Status Bar
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={showActivityBar}
                            onCheckedChange={setShowActivityBar}
                            disabled
                          >
                            Activity Bar
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={showPanel}
                            onCheckedChange={setShowPanel}
                          >
                            Panel
                          </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className=" bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-800 dark:text-zinc-200 border text-sm py-2 px-2 font-light border-zinc-300 dark:border-zinc-700 h-8"
                          >
                            Head Chef
                            <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>User Role</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup
                            value={role}
                            onValueChange={setRole}
                          >
                            <DropdownMenuRadioItem value="top">
                              <div>
                                <div className="text-sm font-semibold dark:text-zinc-100">
                                  Head Chef
                                </div>
                                <div className="text-xs text-zinc-500">
                                  view, edit, delete
                                </div>
                              </div>
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="bottom">
                              <div>
                                <div className="text-sm font-semibold dark:text-zinc-100">
                                  Sous Chef
                                </div>
                                <div className="text-xs text-zinc-500">
                                  view, delete
                                </div>
                              </div>
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="right">
                              <div>
                                <div className="text-sm font-semibold dark:text-zinc-100">
                                  Cook
                                </div>
                                <div className="text-xs text-zinc-500">
                                  view.
                                </div>
                              </div>
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="flex flex-col p-2 gap-2  ">
                    <div className="flex justify-between  ">
                      <div className="flex gap-2 items-center">
                        <Avatar
                          color={
                            colorVariants[
                              Math.floor(
                                Math.random() * (colorVariants.length - 1)
                              )
                            ]
                          }
                          content={(
                            m.firstName[0] + m.lastName[0]
                          ).toLowerCase()}
                        />
                        <div>
                          <div className="text-base  lg:text-lg font-semibold dark:text-zinc-100">
                            {m.firstName} {m.lastName}
                          </div>
                          <div className="text-xs  lg:text-base text-zinc-500">
                            {m.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex  items-start md:items-center ">
                        <div className="border border-red-500 rounded-2xl p-1 px-2 text-red-500 text-xs md:text-base font-light inline-flex items-center gap-2">
                          Pending
                          <Spinner size={3} />
                        </div>
                      </div>
                    </div>
                    <div className=" flex justify-end gap-2 ">
                      <Button
                        variant="outline"
                        className=" bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-800 dark:text-zinc-200 border text-xs md:text-sm py-2 px-2 font-light border-red-400  h-8"
                      >
                        Remove
                        <Trash className="ml-2 h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="outline"
                        className="mr-auto bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-800 dark:text-zinc-200 border text-xs md:text-sm py-2 px-2 font-light border-green-400  h-8"
                      >
                        Approve
                        <CheckIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-800 dark:text-zinc-200 border text-sm md:text-sm py-2 px-2 font-light border-zinc-300 dark:border-zinc-700 h-8"
                          >
                            Cook
                            <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>User Role</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup
                            value={role}
                            onValueChange={setRole}
                          >
                            <DropdownMenuRadioItem value="top">
                              <div>
                                <div className="text-sm font-semibold dark:text-zinc-100">
                                  Head Chef
                                </div>
                                <div className="text-xs text-zinc-500">
                                  view, edit, delete
                                </div>
                              </div>
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="bottom">
                              <div>
                                <div className="text-sm font-semibold dark:text-zinc-100">
                                  Sous Chef
                                </div>
                                <div className="text-xs text-zinc-500">
                                  view, delete
                                </div>
                              </div>
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="right">
                              <div>
                                <div className="text-sm font-semibold dark:text-zinc-100">
                                  Cook
                                </div>
                                <div className="text-xs text-zinc-500">
                                  view.
                                </div>
                              </div>
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashBoardIndex;
