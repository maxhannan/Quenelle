import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma.server";

export type FullRecipes = Prisma.PromiseReturnType<typeof getRecipes>;
export const getRecipes = async () => {
  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        dish: false,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        category: true,
        allergens: true,
        ingredients: {
          select: {
            linkRecipe: {
              select: {
                allergens: true,
              },
            },
          },
        },
        author: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    });
    return recipes;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export type FullRecipe = Prisma.PromiseReturnType<typeof getRecipeById>;
export const getRecipeById = async (id: string) => {
  try {
    const recipe = prisma.recipe.findUnique({
      where: { id: id },
      include: {
        author: true,
        ingredients: {
          include: {
            linkRecipe: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        linkedIngredients: {
          select: {
            recipe: {
              select: {
                id: true,
                name: true,
                dish: true,
              },
            },
          },
        },
      },
    });
    return recipe;
  } catch (error) {
    console.error(error);
    return null;
  }
};
