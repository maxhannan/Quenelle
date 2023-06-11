import { useEffect, useRef, useState } from "react";
import type { FC, FormEventHandler } from "react";
import { useRecipe } from "../app.recipes.$id/route";
import {
  CheckCircleIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  useNavigate,
  useNavigation,
  useFetcher,
  useActionData,
  useSubmit,
  Form,
  useRevalidator,
  useLoaderData,
} from "@remix-run/react";
import RecipeForm from "~/components/forms/RecipeForm";
import AppBar from "~/components/navigation/AppBar";
import { uploadImage } from "~/utils/images";
import IconButton from "~/components/buttons/IconButton";
import type { ActionFunction } from "@remix-run/node";
import {
  extractRecipe,
  getRecipes,
  updateRecipe,
} from "~/utils/recipes.server";
import Spinner from "~/components/LoadingSpinner";
import { useToast } from "~/components/ui/use-toast";

export const loader = async () => {
  const recipes = await getRecipes();
  return {
    recipes,
    categories: recipes ? [...new Set(recipes.map((r) => r.category))] : [],
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const recipeId = params.id;
  const form = await request.formData();

  const newRecipe = extractRecipe(form);
  const savedRecipe = await updateRecipe(recipeId!, newRecipe);
  console.log({ savedRecipe });
  return recipeId;
};

const EditRecipeRoute: FC = () => {
  const { recipe } = useRecipe();
  const { recipes, categories } = useLoaderData<typeof loader>();

  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const data = useActionData();
  const formRef = useRef<HTMLFormElement>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const submit = useSubmit();
  const { toast } = useToast();
  const [imageList, setImageList] = useState<string[]>(
    recipe && recipe.images ? recipe.images : []
  );
  const [deleteImageList, setDeleteImageList] = useState<string[]>([]);

  const handleDeleteImage = (path: string) => {
    setDeleteImageList([...deleteImageList, path]);
    setImageList((imageList) => imageList.filter((image) => image !== path));
  };

  const handleDeleteRecipe = async () => {
    const data = new FormData();
    data.set("id", recipe!.id);
    submit(data, { method: "delete", action: "/app/recipes/deleterecipe" });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setImageLoading(true);
    if (deleteImageList.length > 0) {
      const data = new FormData();
      data.set("deleted", JSON.stringify(deleteImageList));
      fetcher.submit(data, { action: "/app/ImageLink", method: "delete" });
    }
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const Images = formData.getAll("uploadedImage") as File[];
      console.log({ Images });
      if (Images.length > 0 && Images[0].size > 0) {
        const savedImages = await uploadImage(Images);
        formData.set(
          "imageLinks",
          JSON.stringify([...savedImages, ...imageList])
        );
      } else {
        formData.set("imageLinks", JSON.stringify(imageList));
      }
      setImageLoading(false);
      submit(formData, { method: "post" });
    }
  };

  useEffect(() => {
    if (data !== undefined) {
      revalidator.revalidate();
      toast({
        title: `${recipe!.name} has been updated`,
      });
      navigate(`/app/recipes/${data}`, { replace: true });
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
    <div>
      <Form method="post" ref={formRef} onSubmit={handleSubmit}>
        <div className="">
          <AppBar page={``} textSize="text-3xl lg:text-4xl ">
            <IconButton
              Icon={TrashIcon}
              name="delete"
              type="button"
              onClick={handleDeleteRecipe}
            />
            <IconButton Icon={CheckCircleIcon} name="Submit" type="submit" />
            <IconButton
              Icon={XMarkIcon}
              name="Go Back"
              type="button"
              onClick={() =>
                navigate(`/app/recipes/${recipe!.id}`, { replace: true })
              }
            />
          </AppBar>
        </div>
        <div className="container mx-auto max-w-4xl lg:pl-2">
          <RecipeForm
            recipe={recipe}
            imageList={imageList}
            handleDeleteImage={handleDeleteImage}
            recipes={recipes}
            categories={categories}
            formLoading={imageLoading}
          />
        </div>
      </Form>
    </div>
  );
};

export default EditRecipeRoute;
