import { useState, type FC } from "react";

import { CheckIcon, ChevronDown, Trash } from "lucide-react";

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
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import Spinner from "~/components/LoadingSpinner";
import { FetcherWithComponents } from "@remix-run/react";

interface Props {
  m: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    approved: boolean;
    chef: boolean;
    orgOwner: boolean;
  };
  fetcher: FetcherWithComponents<any>;
}

const PendingCard: FC<Props> = ({ m, fetcher }) => {
  const [role, setRole] = useState("bottom");

  const handleApprove = async () => {
    const data = new FormData();
    data.set("id", m.id);
    data.set("action", "approve");
    await fetcher.submit(data, { method: "POST" });
  };

  return (
    <div className="flex flex-col p-2 gap-2 ">
      <div className="flex justify-between  ">
        <div className="flex gap-2 items-center">
          <Avatar
            color={"bg-red-400"}
            content={(m.firstName[0] + m.lastName[0]).toLowerCase()}
          />
          <div>
            <div className="text-base  lg:text-lg font-semibold dark:text-zinc-100">
              {m.firstName} {m.lastName}
            </div>
            <div className="text-xs  lg:text-base text-zinc-500">{m.email}</div>
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
          onClick={handleApprove}
          variant="outline"
          disabled={
            fetcher.state === "loading" || fetcher.state === "submitting"
          }
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
            <DropdownMenuRadioGroup value={role} onValueChange={setRole}>
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
                  <div className="text-xs text-zinc-500">view, delete</div>
                </div>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right">
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

export default PendingCard;
