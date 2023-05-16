import React from "react";
import { useRecipes } from "../app.recipes/route";
import { useNavigation } from "@remix-run/react";
import Spinner from "~/components/LoadingSpinner";
import RecipeFeed from "./components/RecipeFeed";

export default function RecipesIndex() {
  const { recipes, categories } = useRecipes();
  const navigation = useNavigation();
  if (navigation.state === "loading" || !recipes || !categories) {
    return (
      <div className=" mx-auto h-screen  flex items-center justify-center">
        <Spinner size={14} />
      </div>
    );
  }
  console.log(recipes, categories);
  return (
    <div className=" container mx-auto max-w-4xl">
      <div className="pb-16  ">
        {recipes && <RecipeFeed recipes={recipes} />}
      </div>
    </div>
  );
}
