import { ActionArgs, redirect } from "@remix-run/node";
import {
  ExtractListData,
  getTemplateById,
  updateTemplate,
} from "~/utils/prepList.server";
import type { LoaderArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "lucide-react";
import Spinner from "~/components/LoadingSpinner";
import IconButton from "~/components/buttons/IconButton";
import PrepListForm from "~/components/forms/PrepListForm";
import AppBar from "~/components/navigation/AppBar";
import { getRecipes } from "~/utils/recipes.server";
import { getUser } from "~/utils/auth.server";
import { useEffect, useState } from "react";
export async function loader({ params }: LoaderArgs) {
  const id = params.id;

  if (!id) redirect("/app/prep");

  const prepListTemplate = await getTemplateById(id!);

  if (!prepListTemplate) redirect("/app/prep");

  const allRecipes = await getRecipes(true);
  return { allRecipes, prepListTemplate };
}

export async function action({ request, params }: ActionArgs) {
  const form = await request.formData();

  const extractList = ExtractListData(form);
  const user = await getUser(request);
  const id = params.id;
  if (user && id) {
    const savedList = await updateTemplate(id, extractList, user.id);
    console.log({ savedList });
    if (savedList) {
      return savedList.id;
    }
  }
  return undefined;
}

function EditTemplateRoute() {
  const { allRecipes, prepListTemplate } = useLoaderData<typeof loader>();
  const [success, setSuccess] = useState(false);
  const navigation = useNavigation();
  const navigate = useNavigate();
  const data = useActionData();
  useEffect(() => {
    if (data !== undefined) {
      setSuccess(true);
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
    <div className="mb-28 container max-w-4xl mx-auto">
      {success && (
        <div className="bg-green-500 p-3 text-zinc-200 rounded-2xl mt-1 text-xl">
          Successfully updated prep list!
        </div>
      )}
      <Form method="post">
        <AppBar textSize="text-3xl md:text-4xl" page="Add a Prep List">
          <IconButton Icon={CheckCircleIcon} name="Submit" type="submit" />
          <IconButton
            Icon={XMarkIcon}
            name="Go Back"
            type="button"
            onClick={() => navigate(-1)}
          />
        </AppBar>
        <PrepListForm recipeList={allRecipes} template={prepListTemplate} />
      </Form>
    </div>
  );
}

export default EditTemplateRoute;