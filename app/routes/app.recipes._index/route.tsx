import React from "react";
import { useRecipes } from "../app.recipes/route";
import { useNavigation, useSubmit } from "@remix-run/react";
import Spinner from "~/components/LoadingSpinner";
import RecipeFeed from "./components/RecipeFeed";
import { useRouteData } from "~/hooks/useRouteData";
import AppBar from "~/components/navigation/AppBar";
import IconButton from "~/components/buttons/IconButton";
import { DocumentPlusIcon, UserIcon } from "@heroicons/react/24/outline";

export default function RecipesIndex() {
  const { recipes, categories } = useRecipes();
  const navigation = useNavigation();
  const user = useRouteData("routes/app");
  const submit = useSubmit();
  console.log({ user });
  if (navigation.state === "loading" || !recipes || !categories) {
    return (
      <div className=" mx-auto h-screen  flex items-center justify-center">
        <Spinner size={14} />
      </div>
    );
  }

  return (
    <div className=" container mx-auto max-w-4xl">
      <AppBar page={"Recipes"}>
        <IconButton
          onClick={() => console.log("clicked")}
          Icon={DocumentPlusIcon}
          name="Add Recipe"
        />
        <IconButton
          onClick={() => submit(null, { action: "/logout", method: "post" })}
          Icon={UserIcon}
          name="Add Recipe"
        />
      </AppBar>
      <div className="pb-16  ">
        {recipes && <RecipeFeed recipes={recipes} />}
      </div>
    </div>
  );
}
