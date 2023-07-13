import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Form, useNavigate, useNavigation } from "@remix-run/react";
import Spinner from "~/components/LoadingSpinner";
import IconButton from "~/components/buttons/IconButton";
import AppBar from "~/components/navigation/AppBar";
import { useDishesForForm } from "../app.menus.add/route";

import MenuForm from "~/components/forms/MenuForm";
import { createMenu, extractMenu } from "~/utils/menus.server";
import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { getUser } from "~/utils/auth.server";
import FormBar from "~/components/display/FormBar";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const data = await extractMenu(form);

  const user = await getUser(request);
  const savedMenu = await createMenu({
    menu: data,
    authorId: user!.id,
    teamId: undefined,
  });
  if (savedMenu) {
    return redirect(`/app/menus/${savedMenu.id}`);
  }
  return null;
};
function AddMenuIndex() {
  const navigate = useNavigate();

  const navigation = useNavigation();
  const { dishes, services } = useDishesForForm();

  if (
    (navigation.state === "loading" || navigation.state === "submitting") &&
    navigation.location.pathname !== "/app/menus/add"
  ) {
    return (
      <div className="h-screen  flex items-center justify-center">
        <Spinner size={14} />
      </div>
    );
  }
  return (
    <Form method="post">
      <FormBar saveText="Menu" />
      <MenuForm dishes={dishes} services={services} />
    </Form>
  );
}

export default AddMenuIndex;
