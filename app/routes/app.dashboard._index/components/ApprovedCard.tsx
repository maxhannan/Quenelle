import { useState, type FC } from "react";

import { ChevronDown, Trash } from "lucide-react";

import { Button } from "~/components/ui/button";

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
import { type getMember } from "~/utils/teams.server";

import { useFetcher } from "@remix-run/react";

interface Props {
  m: Member;
  teamId: string;
}
type Member = Awaited<ReturnType<typeof getMember>>;

type Checked = DropdownMenuCheckboxItemProps["checked"];
const ApprovedCard: FC<Props> = ({ m, teamId }) => {
  const fetcher = useFetcher();
  const { firstName, lastName, email, role, id } = m!;
  const [roleState, setRoleState] = useState(role);
  const [showStatusBar, setShowStatusBar] = useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = useState<Checked>(false);
  const [showPanel, setShowPanel] = useState<Checked>(false);
  const [deleting, setDeleting] = useState(false);
  const handleRoleChange = async (v: string) => {
    console.log({ v });
    if (v !== "headChef" && v !== "cook" && v !== "sousChef") {
      return null;
    }
    console.log({ v });
    setRoleState(v);
    const data = new FormData();
    data.append("role", v);
    data.append("id", id);
    data.append("action", "role");
    await fetcher.submit(data, { method: "POST" });
  };

  const handleRemove = async () => {
    setDeleting(true);
    const data = new FormData();
    data.append("id", id);
    data.append("action", "delete");
    data.append("teamId", teamId);
    await fetcher.submit(data, { method: "POST" });
  };

  return (
    <div
      className={`flex flex-col p-2 gap-2 transition-all duration-150  ${
        deleting && "bg-red-500 bg-opacity-20 rounded-2xl"
      }`}
    >
      <div className="flex justify-between  ">
        <div className="flex gap-2 items-center">
          <Avatar
            color={"bg-blue-400"}
            content={(firstName[0] + lastName[0]).toLowerCase()}
          />
          <div>
            <div className="text-base lg:text-lg font-semibold dark:text-zinc-100">
              {firstName} {lastName}
            </div>
            <div className="text-sm lg:text-base text-zinc-500">{email}</div>
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
          onClick={handleRemove}
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
              {roleState === "headChef"
                ? "Head Chef"
                : roleState === "sousChef"
                ? "Sous Chef"
                : "Cook"}
              <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>User Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={roleState}
              onValueChange={handleRoleChange}
            >
              <DropdownMenuRadioItem value="headChef">
                <div>
                  <div className="text-sm font-semibold dark:text-zinc-100">
                    Head Chef
                  </div>
                  <div className="text-xs text-zinc-500">
                    view, edit, delete
                  </div>
                </div>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="sousChef">
                <div>
                  <div className="text-sm font-semibold dark:text-zinc-100">
                    Sous Chef
                  </div>
                  <div className="text-xs text-zinc-500">view, delete</div>
                </div>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="cook">
                <div>
                  <div className="text-sm font-semibold dark:text-zinc-100">
                    Cook
                  </div>
                  <div className="text-xs text-zinc-500">view.</div>
                </div>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ApprovedCard;
