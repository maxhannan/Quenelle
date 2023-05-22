import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Form,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import Spinner from "~/components/LoadingSpinner";
import IconButton from "~/components/buttons/IconButton";
import AppBar from "~/components/navigation/AppBar";
import { useDishesForForm } from "../app.menus_.add/route";

import MenuForm from "~/components/forms/MenuForm";
import { getMenuById, getMenus } from "~/utils/menus.server";

export async function loader() {
  const menu = getMenuById("clhnq6phs000slc0h88lmakz6");
  return menu;
}

function AddMenuIndex() {
  const navigate = useNavigate();
  const menu = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const navigation = useNavigation();
  const { dishes, services } = useDishesForForm();
  console.log({ dishes, services });
  if (navigation.state === "loading" || navigation.state === "submitting") {
    return (
      <div className="h-screen  flex items-center justify-center">
        <Spinner size={14} />
      </div>
    );
  }
  return (
    <Form method="post">
      <AppBar page="Add a Menu">
        <IconButton Icon={CheckCircleIcon} name="Submit" type="submit" />
        <IconButton
          Icon={XMarkIcon}
          name="Go Back"
          type="button"
          onClick={() => navigate(-1)}
        />
      </AppBar>
      <MenuForm dishes={dishes} services={services} menu={menu} />
    </Form>
  );
}

export default AddMenuIndex;
