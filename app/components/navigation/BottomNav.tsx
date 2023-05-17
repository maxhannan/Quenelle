import BottomNavButton from "./BottomNavButton";
import { useNavigate, useLocation } from "@remix-run/react";
import {
  FolderIcon,
  ClipboardDocumentCheckIcon,
  QueueListIcon,
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
    <nav className="fixed z-50 w-full  h-24   bottom-0 left-0 bg-neutral-100 border-t    dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700">
      <div className="grid h-full max-w-lg  pb-4 md:p-3 mx-auto grid-cols-3 gap-0">
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
          path="menus"
          Icon={QueueListIcon}
        />

        {/* <BottomNavButton
          active={page}
          handleNav={handleNav}
          path="chat"
          Icon={ChatBubbleBottomCenterIcon}
  />*/}
      </div>
    </nav>
  );
};

export default BottomNav;
