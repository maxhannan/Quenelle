import BottomNavButton from "./BottomNavButton";
import { useNavigate, useLocation } from "@remix-run/react";
import {
  FolderIcon,
  ClipboardDocumentCheckIcon,
  QueueListIcon,
  ChatBubbleBottomCenterIcon,
  HomeIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import type { Dispatch, SetStateAction } from "react";
import { ClipboardCheckIcon } from "lucide-react";

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
    <nav className="fixed z-50 w-[85vw] sm:w-96 py-3 transition-all duration-300  bottom-6 sm:bottom-6 inset-x-0 mx-auto px-2 bg-zinc-800 rounded-full  dark:bg-zinc-200 ">
      <div className="grid h-full max-w-lg  mx-auto grid-cols-5 gap-0">
        <BottomNavButton
          active={page}
          handleNav={handleNav}
          path="prep"
          Icon={ClipboardCheckIcon}
        />
        <BottomNavButton
          active={page}
          handleNav={handleNav}
          path="recipes"
          Icon={FolderIcon}
        />

        <BottomNavButton
          active={page}
          handleNav={handleNav}
          path=""
          Icon={HomeIcon}
        />
        <BottomNavButton
          active={page}
          handleNav={handleNav}
          path="menus"
          Icon={QueueListIcon}
        />

        <BottomNavButton
          active={page}
          handleNav={handleNav}
          path="chat"
          Icon={ChatBubbleBottomCenterTextIcon}
        />
      </div>
    </nav>
  );
};

export default BottomNav;
