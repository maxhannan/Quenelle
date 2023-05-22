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

export const getDishById = async (id: string) => {
  try {
    const dish = await prisma.recipe.findUnique({
      where: {
        id: id,
      },
      include: {
        menu: {
          select: {
            name: true,
            id: true,
          },
        },

        author: true,
        ingredients: {
          include: {
            linkRecipe: {
              select: {
                id: true,
                name: true,
                category: true,

                author: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return dish;
  } catch (error) {
    return null;
  }
};
export type ExtractedDish = ReturnType<typeof extractDish>;
export const extractDish = (form: FormData) => {
  const name = form.get("dishName") as string;

  const allergies = form.get("allergies") as string;
  const iNames = form.getAll("ingredientName") as string[];
  const linkIds = form.getAll("recipeLinkId") as string[];
  const ingredientAmts = form.getAll("ingredientAmt") as string[];
  const ingredientUnits = form.getAll("ingredientUnit") as string[];
  const steps = form.getAll("recipeStep") as string[];

  const savedImages = JSON.parse(form.get("imageLinks") as string);
  const ingredients = iNames.map((n, i) => {
    return {
      ingredient: n,
      qty: ingredientAmts[i],
      unit: ingredientUnits[i],
      linkId: linkIds[i].length > 0 ? linkIds[i] : undefined,
    };
  });

  return {
    name,
    allergens: allergies.length > 0 ? allergies?.split(",") : [],
    savedImages,
    ingredients,
    steps,
  };
};

export const createDish = async (dish: ExtractedDish, userid: string) => {
  const { name, allergens, ingredients, steps, savedImages } = dish;
  try {
    const savedDish = await prisma.recipe.create({
      data: {
        name,
        dish: true,
        category: "dish",
        images: savedImages || [],
        allergens,
        yieldAmt: "",
        yieldUnit: "",
        steps,
        ingredients: {
          create: [...ingredients],
        },

        author: { connect: { id: userid } },
      },
    });
    return savedDish;
  } catch (error) {
    return null;
  }
};

export const updateDish = async (id: string, dish: ExtractedDish) => {
  const { name, allergens, ingredients, steps, savedImages } = dish;
  try {
    const data = await prisma.$transaction([
      prisma.ingredient.deleteMany({ where: { recipeId: id } }),
      prisma.recipe.update({
        where: { id: id },
        data: {
          name,
          images: savedImages || [],
          allergens,

          steps,
          ingredients: {
            create: [...ingredients],
          },
        },
        include: {
          ingredients: true,
          author: true,
        },
      }),
    ]);

    return data[1];
  } catch (error) {
    return null;
  }
};
