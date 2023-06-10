import {
  useNavigate,
  useActionData,
  useNavigation,
  Form,
  useLoaderData,
} from "@remix-run/react";
import { useMenu } from "../app.menus.$id/route";
import { getDishes } from "~/utils/dishes.server";
import { extractMenu, getMenus, updateMenu } from "~/utils/menus.server";
import { serviceList } from "~/utils/staticLists";

import Spinner from "~/components/LoadingSpinner";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import IconButton from "~/components/buttons/IconButton";
import MenuForm from "~/components/forms/MenuForm";
import AppBar from "~/components/navigation/AppBar";
import type { ActionFunction } from "@remix-run/node";
import { getUser } from "~/utils/auth.server";
import { useEffect } from "react";

export async function loader() {
  const dishes = await getDishes();
  const menus = await getMenus();
  const services = menus
    ? [...new Set([...menus.map((m) => m.service), ...serviceList])]
    : [];
  return { dishes, services };
}
export const action: ActionFunction = async ({ request, params }) => {
  const data = await request.formData();
  const newMenu = extractMenu(data);

  const user = await getUser(request);
  if (params.id && newMenu && user) {
    const savedMenu = await updateMenu(params.id, newMenu, user.id);
    if (savedMenu) {
      return savedMenu.id;
    }
    return null;
  }
  return null;
};

function EditMenuRoute() {
  const menu = useMenu();
  const navigate = useNavigate();
  const data = useActionData();
  const navigation = useNavigation();
  const { dishes, services } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (data !== undefined) {
      navigate(`/app/menus/${data}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (navigation.state === "loading" || navigation.state === "submitting") {
    return (
      <div className="h-screen  flex items-center justify-center">
        <Spinner size={14} />
      </div>
    );
  }

  return (
    <div className="mb-28 container xl:pl-2 mx-auto">
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
    </div>
  );
}

export default EditMenuRoute;
