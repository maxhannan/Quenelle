import {
  useNavigate,
  useNavigation,
  useLocation,
  Outlet,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import Spinner from "~/components/LoadingSpinner";
import MenuButtons from "./components/MenuButtons";
import IconButton from "~/components/buttons/IconButton";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import SlideDownTransition from "~/components/animations/SlideDown";

export default function MenusLayout() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(
    location.pathname === "/app/menus" ? "Menus" : "Dishes"
  );

  useEffect(() => {
    setActiveTab(location.pathname === "/app/menus" ? "Menus" : "Dishes");
  }, [location]);

  const pageChangeLoading =
    (navigation.state === "loading" &&
      !navigation.location.pathname.includes("/app/menus")) ||
    (navigation.state === "loading" &&
      navigation.location.pathname === "/app/menus/dishes/add");

  if (pageChangeLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size={14} />
      </div>
    );
  }

  return (
    <div className=" container mx-auto max-w-4xl">
      <SlideDownTransition>
        <nav className=" flex pt-3 pb-1 mx-auto max-h-full items-center justify-between  duration-300 bg-neutral-100 dark:bg-neutral-900 font-light  w-full top-0 left-0  ">
          <MenuButtons activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="grow flex justify-end gap-2">
            <IconButton
              Icon={DocumentPlusIcon}
              name="Add"
              type="button"
              onClick={() =>
                navigate(`${activeTab === "Dishes" ? "dishes/" : ""}add`)
              }
            />
          </div>
        </nav>
      </SlideDownTransition>
      <div className=" mb-28">
        <Outlet />
      </div>
    </div>
  );
}
