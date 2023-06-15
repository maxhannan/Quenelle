import type { FC, ReactNode } from "react";
import SlideDownTransition from "../animations/SlideDown";
import {
  CreditCard,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserIcon,
  UserPlus,
  Users,
} from "lucide-react";
import { useNavigate, useSubmit } from "@remix-run/react";

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

interface Props {
  page: string;
  textSize?: string;
  children?: ReactNode;
  bottomPadding?: string;
}

const NewAppBar: FC<Props> = ({
  page,
  textSize = "text-4xl",
  bottomPadding,
  children,
}: Props) => {
  const submit = useSubmit();
  const navigate = useNavigate();
  return (
    <>
      <SlideDownTransition>
        <nav
          className={`flex pt-3 ${
            bottomPadding ? `pb-${bottomPadding}` : "pb-3"
          } mx-auto  max-h-full items-center justify-between   duration-300 gap-4   w-full top-0 left-0 `}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="lg:hidden">
              <button
                className={`data-[state=open]:bg-indigo-500 data-[state=open]:border-indigo-500 dark:bg-zinc-800 bg-zinc-700 text-zinc-200 dark:text-zinc-300 trasition-all duration-300 inline-flex group-hover:bg-indigo-500  group-hover:text-zinc-200  child flex-shrink-0 items-center justify-center w-10 h-10 overflow-hidden group-hover:border-indigo-500 border-zinc-500 rounded-full  border dark:border-indigo-500`}
              >
                <UserIcon className="w-6 h-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 ml-2">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate("/app/dashboard")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Team</span>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Invite users</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        <span>Email</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Message</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>More...</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>New Team</span>
                  <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  submit(null, { action: "/logout", method: "POST" })
                }
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
