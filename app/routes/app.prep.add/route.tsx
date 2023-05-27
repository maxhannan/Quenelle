import { XMarkIcon } from "@heroicons/react/24/outline";
import type { LoaderArgs } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { CheckCircleIcon } from "lucide-react";
import Spinner from "~/components/LoadingSpinner";
import IconButton from "~/components/buttons/IconButton";
import PrepListForm from "~/components/forms/PrepListForm";

import AppBar from "~/components/navigation/AppBar";

import { getRecipes } from "~/utils/recipes.server";

export async function loader(args: LoaderArgs) {
  const allRecipes = await getRecipes(true);
  return allRecipes;
}

function PrepListAddRoute() {
  const allRecipes = useLoaderData<typeof loader>();
  const navigate = useNavigate();

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
        <AppBar page="Add a Prep List">
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
