import type { FullRecipes } from "./recipes.server";

export const filterAndCategorize = (
  recipes: FullRecipes,
  search: string | null,
  category: string | null
) => {
  const categorizedRecipes = category
    ? recipes!.filter((r) => r.category === category)
    : recipes;

  const recipeList = search
    ? categorizedRecipes!.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
      )
    : categorizedRecipes;

  return recipeList;
};

const filterAllergies = (recipes: FullRecipes, allergies: string[]) => {
  if (!allergies.length) return recipes;
  const filteredRecipes = recipes!.filter((r) => {
    let combinedAllergies = [...r.allergens];
    r.ingredients.forEach((i) => {
      if (i.linkRecipe && i.linkRecipe.allergens) {
        combinedAllergies = [...combinedAllergies, ...i.linkRecipe.allergens];
      }
    });

    let allergyFree = true;
    allergies.forEach((a) => {
      if (combinedAllergies.includes(a)) {
        allergyFree = false;
      }
    });

    return allergyFree;
  });
  return filteredRecipes;
};

export const getFilteredRecipes = (
  recipes: FullRecipes,
  search: string | null,
  category: string | null,
  allergies: string[]
) => {
  let filteredRecipes = filterAndCategorize(recipes, search, category);
  if (filteredRecipes && filteredRecipes.length > 0 && allergies.length) {
    filteredRecipes = filterAllergies(filteredRecipes, allergies);
  }
  return filteredRecipes;
};
