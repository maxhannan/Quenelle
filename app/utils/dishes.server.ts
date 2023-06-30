import { prisma } from "./prisma.server";

export const getDishes = async (teamid: string[]) => {
  try {
    const dishes = await prisma.recipe.findMany({
      orderBy: {
        name: "asc",
      },
      where: {
        dish: true,
        teams: {
          some: {
            id: {
              in: teamid,
            },
          },
        },
      },
      select: {
        section: {
          select: {
            id: true,
          },
        },
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
            colorVariant: true,
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
                    colorVariant: true,
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

export const createDish = async (
  dish: ExtractedDish,
  userid: string,
  teamId: string | undefined
) => {
  const { name, allergens, ingredients, steps, savedImages } = dish;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userid },
      select: {
        firstName: true,
        lastName: true,
        teams: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!user) return null;
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
        teams: {
          connect: teamId ? [{ id: teamId }] : user.teams,
        },
        author: { connect: { id: userid } },
      },
      include: {
        teams: {
          select: {
            id: true,
          },
        },
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    await prisma.feedMessage.create({
      data: {
        content: `${savedDish.author.firstName} ${savedDish.author.lastName} created the dish ${savedDish.name}`,
        author: { connect: { id: userid } },
        teams: { connect: savedDish.teams.map((t: any) => ({ id: t.id })) },
        linkRecipe: { connect: { id: savedDish.id } },
      },
    });
    return savedDish;
  } catch (error) {
    return null;
  }
};

export const updateDish = async (
  id: string,
  dish: ExtractedDish,
  userId: string
) => {
  const { name, allergens, ingredients, steps, savedImages } = dish;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true },
    });
    if (!user) return null;
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
          teams: {
            select: {
              id: true,
            },
          },
        },
      }),
    ]);

    await prisma.feedMessage.create({
      data: {
        content: `${user.firstName} ${user.lastName} updated the dish ${data[1].name}`,
        author: { connect: { id: userId } },
        teams: { connect: data[1].teams.map((t: any) => ({ id: t.id })) },
        linkRecipe: { connect: { id: id } },
      },
    });
    return data[1];
  } catch (error) {
    return null;
  }
};
