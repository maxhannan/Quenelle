import { useEffect, useRef, useState } from "react";
import type { FormEventHandler } from "react";
import { useDish } from "../app.menus.dishes.$id/route";
import { getRecipes } from "~/utils/recipes.server";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
  useRevalidator,
  useSubmit,
} from "@remix-run/react";
import { uploadImage } from "~/utils/images";
import Spinner from "~/components/LoadingSpinner";
import {
  CheckCircleIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import IconButton from "~/components/buttons/IconButton";
import AppBar from "~/components/navigation/AppBar";
import DishForm from "~/components/forms/DishForm";
import type { ActionFunction } from "@remix-run/node";
import { extractDish, updateDish } from "~/utils/dishes.server";

export async function loader() {
  const recipes = await getRecipes();

  return {
    recipes,
    categories: recipes ? [...new Set(recipes.map((r) => r.category))] : [],
  };
}

export const action: ActionFunction = async ({ request, params }) => {
  const dishId = params.id;
  if (!dishId) return undefined;
  const form = await request.formData();

  const newRecipe = extractDish(form);
  const savedDish = await updateDish(dishId, newRecipe);
  console.log({ savedDish });
  if (savedDish) {
    return savedDish.id;
  } else return undefined;
};

function EditDishRoute() {
  const dish = useDish();
  const { recipes, categories } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const location = useLocation();
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const data = useActionData();
  const formRef = useRef<HTMLFormElement>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const submit = useSubmit();
  const [imageList, setImageList] = useState<string[]>(
    dish && dish.images ? dish.images : []
  );
  const [deleteImageList, setDeleteImageList] = useState<string[]>([]);
  console.log({ imageList, deleteImageList });
  const handleDeleteImage = (path: string) => {
    setDeleteImageList([...deleteImageList, path]);
    setImageList((imageList) => imageList.filter((image) => image !== path));
  };

  const handleDeleteDish = async () => {
    const data = new FormData();
    data.set("id", dish!.id);
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
      navigate(`/app/menus/dishes/${data}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (
    (navigation.state === "loading" &&
      navigation?.location?.pathname !== location.pathname) ||
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
      <Form method="post" ref={formRef} onSubmit={handleSubmit}>
        <AppBar page={`Edit Recipe`} textSize="text-3xl">
          <IconButton
            Icon={TrashIcon}
            name="delete"
            type="button"
            onClick={handleDeleteDish}
          />
          <IconButton Icon={CheckCircleIcon} name="Submit" type="submit" />
          <IconButton
            Icon={XMarkIcon}
            name="Go Back"
            type="button"
            onClick={() =>
              navigate(`/app/menus/dishes/${dish!.id}`, { replace: true })
            }
          />
        </AppBar>
        <DishForm
          dish={dish}
          imageList={imageList}
          handleDeleteImage={handleDeleteImage}
          recipes={recipes}
          categories={categories}
          formLoading={imageLoading}
        />
      </Form>
    </div>
  );
}

export default EditDishRoute;
