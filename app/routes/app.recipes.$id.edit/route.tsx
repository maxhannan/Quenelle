import { useEffect, useRef, useState } from "react";
import type { FC, FormEventHandler } from "react";
import { useRecipe } from "../app.recipes.$id/route";

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

import { uploadImage } from "~/utils/images";

import {
  redirect,
  type ActionFunction,
  type LoaderArgs,
} from "@remix-run/node";
import {
  extractRecipe,
  getRecipes,
  updateRecipe,
} from "~/utils/recipes.server";
import Spinner from "~/components/LoadingSpinner";
import { useToast } from "~/components/ui/use-toast";
import { getUser } from "~/utils/auth.server";
import DeleteModal from "~/components/display/DeleteModal";
import FormBar from "~/components/display/FormBar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import FormControls from "~/components/display/FormControls";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  if (user!.role === "cook") {
    return redirect("/app/recipes");
  }

  const recipes = await getRecipes({
    all: true,
    teamid: user!.teams.map((t) => t.id),
  });

  return {
    user,
    recipes,
    categories: recipes ? [...new Set(recipes.map((r) => r.category))] : [],
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const recipeId = params.id;
  const form = await request.formData();
  const userId = (await form.get("userId")) as string;
  const newRecipe = extractRecipe(form);

  await updateRecipe(recipeId!, newRecipe, userId);
  return recipeId;
};

type LoaderDataType = {
  user: Awaited<ReturnType<typeof getUser>>;
  recipes: Awaited<ReturnType<typeof getRecipes>>;
  categories: string[];
};
const EditRecipeRoute: FC = () => {
  const { recipe } = useRecipe();
  const { user, recipes, categories } = useLoaderData<LoaderDataType>();

  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const data = useActionData();
  const formRef = useRef<HTMLFormElement>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [visible, setVisible] = useState(true);
  const formBarRef = useRef<HTMLDivElement>(null);
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
      formData.set("userId", user!.id);
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
          <DeleteModal
            isOpen={openDeleteModal}
            setIsOpen={setOpenDeleteModal}
            deleteFn={handleDeleteRecipe}
          />
        </div>

        <div className="container mx-auto max-w-5xl lg:pl-2">
          <FormControls saveText="Recipe" />
          <div className="h-20 md:h-2" />
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
