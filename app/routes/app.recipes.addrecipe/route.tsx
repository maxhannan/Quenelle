import {
  useNavigate,
  useNavigation,
  useActionData,
  useSubmit,
  Form,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import type { FC, FormEventHandler } from "react";
import IconButton from "~/components/buttons/IconButton";
import AppBar from "~/components/navigation/AppBar";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRecipes } from "../app.recipes/route";
import RecipeForm from "~/components/forms/RecipeForm";
import { uploadImage } from "~/utils/images";
import type { ActionFunction } from "@remix-run/node";
import { getUser } from "~/utils/auth.server";
import { createRecipe, extractRecipe } from "~/utils/recipes.server";
import Spinner from "~/components/LoadingSpinner";

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request);
  const form = await request.formData();

  const newRecipe = await extractRecipe(form);

  if (user) {
    const savedRecipe = await createRecipe(newRecipe, user.id, undefined);
    console.log({ savedRecipe });

    return savedRecipe.id;
  }

  return undefined;
};

const AddRecipeRoute: FC = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const data = useActionData();
  const formRef = useRef<HTMLFormElement>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const submit = useSubmit();
  const { recipes, categories } = useRecipes();

  useEffect(() => {
    if (data !== undefined) {
      navigate(`/app/recipes/${data}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
    <>
      <AppBar page="">
        <IconButton Icon={CheckCircleIcon} name="Submit" type="submit" />
        <IconButton
          Icon={XMarkIcon}
          name="Go Back"
          type="button"
          onClick={() => navigate("/app/recipes")}
        />
      </AppBar>

      <div className="container mx-auto max-w-3xl xl:mt-1 lg:pl-2">
        <Form
          ref={formRef}
          method="post"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <RecipeForm
            categories={categories}
            recipes={recipes}
            formLoading={imageLoading}
          />
        </Form>
      </div>
    </>
  );
};

export default AddRecipeRoute;
