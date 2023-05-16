import React from "react";
import { FullRecipes } from "~/utils/recipes.server";
import RecipeCard from "./RecipeCard";

export default function RecipeFeed({ recipes }: { recipes: FullRecipes }) {
  return (
    <div className="grid z-0 relative grid-flow-row  auto-rows-max gap-y-2  mx-auto mt-3 mb-16">
      {recipes && recipes.length > 0 ? (
        recipes.map((r) => (
          <RecipeCard
            key={r.id}
            id={r.id}
            name={r.name}
            category={r.category}
            user={r.author!.firstName[0] + r.author!.lastName[0]}
          />
        ))
      ) : (
        <div className="w-full  text-xl dark:text-neutral-200 text-neutral-700 ">
          Nothing Found
        </div>
      )}
    </div>
  );
}
