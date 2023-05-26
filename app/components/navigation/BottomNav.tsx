import BottomNavButton from "./BottomNavButton";
import { useNavigate, useLocation } from "@remix-run/react";
import {
  FolderIcon,
  ClipboardDocumentCheckIcon,
  QueueListIcon,
  ChatBubbleBottomCenterIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import type { Dispatch, SetStateAction } from "react";

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
    <nav className="fixed z-50 w-full sm:w-96 p-4   bottom-0 sm:bottom-6 inset-x-0 mx-auto  bg-zinc-200 rounded-tl-3xl rounded-tr-3xl sm:rounded-3xl pb-6 sm:pb-4 dark:bg-zinc-900 ">
      <div className="grid h-full max-w-lg  mx-auto grid-cols-5 gap-0">
        <BottomNavButton
          active={page}
          handleNav={handleNav}
          path="prep"
          Icon={ClipboardDocumentCheckIcon}
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
          path="/"
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
          Icon={ChatBubbleBottomCenterIcon}
        />
      </div>
    </nav>
  );
};

export default BottomNav;
