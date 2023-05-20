import { prisma } from "./prisma.server";

export const getDishes = async () => {
  try {
    const dishes = await prisma.recipe.findMany({
      where: {
        dish: true,
      },
      select: {
        _count: {
          select: {
            ingredients: true,
            linkedIngredients: true,
            menu: true,
            section: true,
          },
        },
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        id: true,
        name: true,
        allergens: true,
        category: true,
        menu: {
          select: {
            id: true,
            name: true,
            author: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
    return dishes;
  } catch (error) {
    return null;
  }
};
