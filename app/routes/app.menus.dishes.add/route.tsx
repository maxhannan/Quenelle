import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import type { FormEventHandler } from "react";
import Spinner from "~/components/LoadingSpinner";
import IconButton from "~/components/buttons/IconButton";
import DishForm from "~/components/forms/DishForm";

import AppBar from "~/components/navigation/AppBar";
import { getUser } from "~/utils/auth.server";
import { createDish, extractDish } from "~/utils/dishes.server";
import { uploadImage } from "~/utils/images";
import { getRecipes } from "~/utils/recipes.server";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  const recipes = await getRecipes({
    all: true,
    teamid: user!.teams.map((t) => t.id),
  });

  return {
    recipes,
    categories: recipes ? [...new Set(recipes.map((r) => r.category))] : [],
  };
}

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request);
  const form = await request.formData();

  const extractedDish = await extractDish(form);

  if (user) {
    const savedDish = await createDish(extractedDish, user.id, undefined);
    if (savedDish) {
      return savedDish.id;
    } else return undefined;
  }

  return undefined;
};

function AddDishRoute() {
  const { recipes, categories } = useLoaderData<typeof loader>();
  const [imageLoading, setImageLoading] = useState(false);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();
  const data = useActionData();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (formRef.current) {
      setImageLoading(true);
      const formData = new FormData(formRef.current);
      const Images = formData.getAll("uploadedImage") as File[];
      console.log({ Images });
      if (Images.length > 0 && Images[0].size > 0) {
        const SavedImages = await uploadImage(Images);

        formData.set("imageLinks", JSON.stringify(SavedImages));
      }

      setImageLoading(false);
      submit(formData, { method: "post" });
    }
  };

  useEffect(() => {
    if (data !== undefined) {
      navigate(`/app/menus/dishes/${data}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (
    navigation.state === "loading" ||
    navigation.state === "submitting" ||
    imageLoading
  ) {
    return (
      <div className="h-screen  flex items-center justify-center">
        <Spinner size={14} />
      </div>
    );
  }
  return (
    <div className="container mx-auto xl:pl-2">
      <Form
        ref={formRef}
        method="post"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <AppBar page="Add a Dish">
          <IconButton Icon={CheckCircleIcon} name="Submit" type="submit" />
          <IconButton
            Icon={XMarkIcon}
            name="Go Back"
            type="button"
            onClick={() => navigate(-1)}
          />
        </AppBar>
        <DishForm
          categories={categories}
          recipes={recipes}
          formLoading={imageLoading}
        />
      </Form>
    </div>
  );
}

export default AddDishRoute;
