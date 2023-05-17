import {
  useNavigate,
  useNavigation,
  useActionData,
  useSubmit,
  Form,
} from "@remix-run/react";
import { FC, FormEventHandler, useRef, useState } from "react";
import IconButton from "~/components/buttons/IconButton";
import AppBar from "~/components/navigation/AppBar";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRecipes } from "../app.recipes/route";
import RecipeForm from "~/components/forms/RecipeForm";

const AddRecipeRoute: FC = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const data = useActionData();
  const formRef = useRef<HTMLFormElement>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const submit = useSubmit();
  const { recipes, categories } = useRecipes();
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    console.log("SUBMIT");
  };
  return (
    <div className="container mx-auto max-w-4xl">
      <Form
        ref={formRef}
        method="post"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <AppBar page="Add a Recipe">
          <IconButton Icon={CheckCircleIcon} name="Submit" type="submit" />
          <IconButton
            Icon={XMarkIcon}
            name="Go Back"
            onClick={() => navigate("/app/recipes")}
          />
        </AppBar>
        <RecipeForm categories={categories} recipes={recipes} />
      </Form>
    </div>
  );
};

export default AddRecipeRoute;
