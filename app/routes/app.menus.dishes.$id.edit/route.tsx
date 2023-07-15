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
import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { extractDish, updateDish } from "~/utils/dishes.server";
import { useToast } from "~/components/ui/use-toast";
import { getUser } from "~/utils/auth.server";
import FormControls from "~/components/display/FormControls";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  const recipes = await getRecipes({
    all: true,
    teamid: user!.teams.map((t) => t.id),
  });

  return {
    recipes,
    categories: recipes ? [...new Set(recipes.map((r) => r.category))] : [],
    user,
  };
}

export const action: ActionFunction = async ({ request, params }) => {
  const dishId = params.id;
  if (!dishId) return undefined;
  const form = await request.formData();
  const userId = form.get("userId") as string;
  const newRecipe = extractDish(form);
  const savedDish = await updateDish(dishId, newRecipe, userId);
  console.log({ savedDish });
  if (savedDish) {
    return savedDish.id;
  } else return undefined;
};

function EditDishRoute() {
  const dish = useDish();
  const { recipes, categories, user } = useLoaderData<typeof loader>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const data = useActionData();
  const formRef = useRef<HTMLFormElement>(null);
  const revalidator = useRevalidator();
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
    data.set("dish", "true");
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
      formData.set("userId", user!.id);
      submit(formData, { method: "post" });
    }
  };

  useEffect(() => {
    if (data !== undefined) {
      toast({
        title: `${dish!.name} has been updated`,
      });
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
        <FormControls saveText="dish" />
        <div className="h-16 md:h-0" />
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
