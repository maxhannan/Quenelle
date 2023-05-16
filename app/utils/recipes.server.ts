import { Prisma } from "@prisma/client";
import { prisma } from "./prisma.server";

export type FullRecipes = Prisma.PromiseReturnType<typeof getRecipes>;
export const getRecipes = async () => {
  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        dish: false,
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
  }
};
