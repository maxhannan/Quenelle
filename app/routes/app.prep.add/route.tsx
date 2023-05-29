import { XMarkIcon } from "@heroicons/react/24/outline";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { CheckCircleIcon } from "lucide-react";
import { useEffect } from "react";
import Spinner from "~/components/LoadingSpinner";
import IconButton from "~/components/buttons/IconButton";
import PrepListForm from "~/components/forms/PrepListForm";

import AppBar from "~/components/navigation/AppBar";
import { getUser } from "~/utils/auth.server";
import { ExtractListData, createPrepList } from "~/utils/prepList.server";

import { getRecipes } from "~/utils/recipes.server";

export async function loader(args: LoaderArgs) {
  const allRecipes = await getRecipes(true);
  return allRecipes;
}

export async function action({ request }: ActionArgs) {
  const form = await request.formData();

  const extractList = ExtractListData(form);
  const user = await getUser(request);

  if (user) {
    const savedList = await createPrepList(extractList, user.id);
    console.log({ savedList });
    if (savedList) {
      return savedList.id;
    }
  }
  return undefined;
}

function PrepListAddRoute() {
  const allRecipes = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const data = useActionData();

  useEffect(() => {
    if (data !== undefined) {
      navigate(`/app/prep/${data}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const navigation = useNavigation();
  if (navigation.state === "loading" || navigation.state === "submitting") {
    return (
      <div className="h-screen  flex items-center justify-center">
        <Spinner size={14} />
      </div>
    );
  }
  return (
    <div className="mb-28 container max-w-4xl mx-auto">
      <Form method="post">
        <AppBar textSize="text-2xl md:text-4xl" page="Add a Prep List">
          <IconButton Icon={CheckCircleIcon} name="Submit" type="submit" />
          <IconButton
            Icon={XMarkIcon}
            name="Go Back"
            type="button"
            onClick={() => navigate(-1)}
          />
        </AppBar>
        <PrepListForm recipeList={allRecipes} />
      </Form>
    </div>
  );
}

export default PrepListAddRoute;
