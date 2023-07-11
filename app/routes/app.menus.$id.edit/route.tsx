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

import MenuForm from "~/components/forms/MenuForm";
import AppBar from "~/components/navigation/AppBar";
import {
  redirect,
  type ActionFunction,
  type LoaderArgs,
} from "@remix-run/node";
import { getUser } from "~/utils/auth.server";
import { useEffect, useRef } from "react";
import { useToast } from "~/components/ui/use-toast";
import { Save, XCircle } from "lucide-react";

import { useIsVisible } from "~/hooks/useIsVisible";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  if (user!.role === "cook") return redirect("/app/menus");
  const dishes = await getDishes(user!.teams.map((t) => t.id));
  const menus = await getMenus(user!.teams.map((t) => t.id));
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
    const savedMenu = await updateMenu(params.id, newMenu, user.id, undefined);
    if (savedMenu) {
      return savedMenu.id;
    }
    return null;
  }
  return null;
};

interface LoaderData {
  dishes: Awaited<ReturnType<typeof getDishes>>;
  services: string[];
}
function EditMenuRoute() {
  const menu = useMenu();
  const navigate = useNavigate();
  const data = useActionData();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isVisible = useIsVisible(buttonRef);
  console.log({ isVisible });
  const navigation = useNavigation();
  const { dishes, services } = useLoaderData<LoaderData>();
  const { toast } = useToast();
  useEffect(() => {
    if (data !== undefined) {
      toast({
        title: `Successfully updated ${menu?.name}`,
      });
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
    <div className="mb-28 container max-w-4xl xl:pl-2 mx-auto">
      <Form method="post">
        <div className="w-screen fixed top-0 left-0 right-0 px-3  dark:bg-zinc-900 bg-zinc-100 md:bg-transparent border-zinc-300 dark:border-zinc-800 z-50 md:relative md:w-auto pb-1 md:border-none md:p-0 shadow-sm dark:border-b md:shadow-none">
          <AppBar page="">
            <button
              ref={buttonRef}
              type="submit"
              className=" font-light text-green-800  bg-green-300 rounded-xl  px-2 py-2 hover:bg-green-400 hover:text-green-900 transition-all duration-300 inline-flex gap-1 items-center "
            >
              <Save className="h-4 w-4" /> Save Menu
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className=" font-light text-red-700  bg-red-300 rounded-xl  px-2 py-2 hover:bg-opacity-90 transition-all duration-300 inline-flex gap-1 items-center "
            >
              <XCircle className="h-4 w-4" />
              Cancel
            </button>
          </AppBar>
        </div>
        <div className="h-16 md:h-0" />
        <MenuForm dishes={dishes} services={services} menu={menu} />
      </Form>
      <div className="w-full justify-end flex mt-2 ">
        <button
          className={`${
            isVisible ? "opacity-0 scale-0" : "scale-100 opacity-100"
          }  hidden md:inline-flex  font-light text-green-800  bg-green-300 rounded-xl  px-2 py-2 hover:bg-green-400 hover:text-green-900 transition-all duration-300  gap-1 items-center `}
        >
          <Save className="h-4 w-4" />
          Save Menu
        </button>
      </div>
    </div>
  );
}

export default EditMenuRoute;
