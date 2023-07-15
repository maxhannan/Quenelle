import BottomNavButton from "./BottomNavButton";
import { useNavigate, useLocation } from "@remix-run/react";
import { QueueListIcon } from "@heroicons/react/24/outline";
import type { Dispatch, SetStateAction } from "react";
import {
  ClipboardCheckIcon,
  List,
  NewspaperIcon,
  StickyNote,
  UserCircle,
  UserCircle2Icon,
} from "lucide-react";
import { FolderIcon } from "lucide-react";
interface Props {
  page: string;
  setPage: Dispatch<SetStateAction<string>>;
}

const BottomNav = ({ page, setPage }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string) => {
    const pathString = `/app/${path}`;
    if (location.pathname === pathString) {
      setPage(path);
      return;
    }
    setPage(path);
    navigate(pathString);
  };

  return (
    <nav
      style={{
        WebkitBackdropFilter: "blur(4px)",
      }}
      className="fixed z-50 w-[90vw] sm:w-96 py-3 transition-all duration-300  bottom-6 sm:bottom-6 inset-x-0 mx-auto px-2 dark:bg-zinc-800/70 rounded-2xl  bg-zinc-50/70 backdrop-blur-sm backdrop-saturate-200 "
    >
      <div className="grid h-full max-w-lg  mx-auto grid-cols-5 gap-0">
        <BottomNavButton
          active={page}
          handleNav={handleNav}
          path="prep"
          tooltipPosition="top"
          color="red"
          Icon={ClipboardCheckIcon}
        />
        <BottomNavButton
          active={page}
          handleNav={handleNav}
          path="recipes"
          tooltipPosition="top"
          color="amber"
          Icon={FolderIcon}
        />

        <BottomNavButton
          active={page}
          handleNav={handleNav}
          path="dashboard"
          tooltipPosition="top"
          color="blue"
          Icon={UserCircle}
        />
        <BottomNavButton
          active={page}
          handleNav={handleNav}
          path="menus"
          tooltipPosition="top"
          color="green"
          Icon={List}
        />

        <BottomNavButton
          active={page}
          handleNav={handleNav}
          path="chat"
          color="purple"
          Icon={StickyNote}
        />
      </div>
    </nav>
  );
};

export default BottomNav;
