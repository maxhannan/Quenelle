import { redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
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
  useLocation,
  useNavigate,
  useNavigation,
  useRevalidator,
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
import { useToast } from "~/components/ui/use-toast";

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

  const [template, setTemplate] = useState(prepListTemplate);

  useEffect(() => {
    setTemplate(prepListTemplate);
  }, [prepListTemplate]);

  console.log({ template });

  const navigation = useNavigation();
  const navigate = useNavigate();
  const data = useActionData();
  const { toast } = useToast();

  useEffect(() => {
    if (data !== undefined) {
      toast({
        title: "Successfully updated prep list!",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (!template) return <h1>No Template Found </h1>;
  return (
    <div className="mb-28 container max-w-4xl mx-auto">
      {navigation.state === "loading" ||
        (navigation.state === "submitting" && (
          <div
            className="fixed inset-0 bg-white/90 dark:bg-black/90 z-50"
            aria-hidden="true"
          >
            <div className="w-screen h-screen  flex justify-center items-center">
              <Spinner size={14} />
            </div>
          </div>
        ))}
      <Form method="post">
        <AppBar textSize="text-3xl md:text-4xl" page={`Edit ${template.name}`}>
          <IconButton Icon={CheckCircleIcon} name="Submit" type="submit" />
          <IconButton
            Icon={XMarkIcon}
            name="Go Back"
            type="button"
            onClick={() => navigate(-1)}
          />
        </AppBar>
        <PrepListForm recipeList={allRecipes} template={template} />
      </Form>
    </div>
  );
}

export default EditTemplateRoute;
