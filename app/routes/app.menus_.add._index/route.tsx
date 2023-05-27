import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import Spinner from "~/components/LoadingSpinner";
import IconButton from "~/components/buttons/IconButton";
import AppBar from "~/components/navigation/AppBar";
import { useDishesForForm } from "../app.menus_.add/route";

import MenuForm from "~/components/forms/MenuForm";
import {
  createMenu,
  extractMenu,
  getMenuById,
  getMenus,
} from "~/utils/menus.server";
import { ActionFunction, redirect } from "@remix-run/node";
import { getUser } from "~/utils/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const data = await extractMenu(form);

  const user = await getUser(request);
  const savedMenu = await createMenu(data, user!.id);
  if (savedMenu) {
    return redirect(`/app/menus/${savedMenu.id}`);
  }
  return null;
};
function AddMenuIndex() {
  const navigate = useNavigate();
  const data = useActionData();

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
      <MenuForm dishes={dishes} services={services} />
    </Form>
  );
}

export default AddMenuIndex;
