import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma.server";

export const extractMenu = (form: FormData) => {
  const name = form.get("menuName") as string;
  const service = form.get("service") as string;
  const sections = form.getAll("sectionName") as string[];
  const dishSections = form.getAll("dishSection") as string[];
  const linkIds = form.getAll("dishLinkId") as string[];

  const dishes = linkIds.map((l, i) => ({
    section: dishSections[i],
    id: l,
  }));

  return {
    name,
    service,
    sections: sections.map((s) => ({ name: s })),
    dishes,
  };
};

export const deleteMenu = async (id: string) => {
  await prisma.menu.delete({
    where: {
      id: id,
    },
  });

  return null;
};

export const updateMenu = async (
  id: string,
  menu: menuForm,
  authorId: string
) => {
  const dishes = menu.dishes;
  const dishIds = dishes.map((d) => ({ id: d.id }));
  try {
    const data = await prisma.$transaction([
      prisma.menu.delete({
        where: {
          id: id,
        },
      }),
      prisma.menu.create({
        data: {
          name: menu.name,
          service: menu.service,
          author: {
            connect: {
              id: authorId,
            },
          },
          sections: {
            createMany: {
              data: menu.sections,
            },
          },
          dishes: {
            connect: dishIds,
          },
        },
        include: {
          sections: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);
    if (data[1]) {
      await prisma.$transaction(
        dishes.map((dish) =>
          prisma.recipe.update({
            where: { id: dish.id },
            data: {
              section: {
                connect: {
                  id: data[1].sections.find((s) => s.name === dish.section)?.id,
                },
              },
            },
          })
        )
      );
    }
    return data[1];
  } catch (error) {
    return null;
  }
};

export const getMenus = async () => {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        _count: {
          select: {
            dishes: true,
            sections: true,
          },
        },
        id: true,
        name: true,
        service: true,
        sections: {
          select: {
            name: true,
            id: true,
            _count: {
              select: {
                dishes: true,
              },
            },
          },
        },
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        createdAt: true,
      },
    });

    return menus;
  } catch (error) {
    console.log({ error });
    return null;
  }
};

export const getMenuById = async (id: string) => {
  try {
    const menu = await prisma.menu.findUnique({
      where: {
        id: id,
      },
      select: {
        _count: {
          select: {
            dishes: true,
            sections: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        name: true,
        id: true,
        service: true,
        sections: {
          select: {
            name: true,
            id: true,
            dishes: {
              select: {
                id: true,
                name: true,
                allergens: true,
                category: true,
                section: {
                  select: {
                    id: true,
                  },
                },
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
              },
            },
          },
        },
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },

        dishes: {
          select: {
            id: true,
            name: true,
            allergens: true,
            category: true,
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
              },
            },
          },
        },
      },
    });
    return menu;
  } catch (error) {
    return null;
  }
};

export const getSectionbyId = async (id: string) => {
  try {
    const section = await prisma.menuSection.findUnique({
      where: {
        id: id,
      },
      select: {
        name: true,
        id: true,
        dishes: {
          select: {
            id: true,
            name: true,
            allergens: true,
            category: true,
            section: {
              select: {
                id: true,
              },
            },
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
          },
        },
      },
    });
    return section;
  } catch (error) {
    return null;
  }
};

export type FullSection = Prisma.PromiseReturnType<typeof getSectionbyId>;

type menuForm = ReturnType<typeof extractMenu>;
export const createMenu = async (menu: menuForm, authorId: string) => {
  try {
    console.log("dishes", menu.dishes);
    const dishes = menu.dishes;
    const dishIds = dishes.map((d) => ({ id: d.id }));
    const savedMenu = await prisma.menu.create({
      data: {
        name: menu.name,
        service: menu.service,
        author: {
          connect: {
            id: authorId,
          },
        },
        sections: {
          createMany: {
            data: menu.sections,
          },
        },
        dishes: {
          connect: dishIds,
        },
      },
      include: {
        sections: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    console.log(dishes);
    console.log("sections", savedMenu.sections, menu.sections);
    await prisma.$transaction(
      dishes.map((dish) =>
        prisma.recipe.update({
          where: { id: dish.id },
          data: {
            section: {
              connect: {
                id: savedMenu.sections.find((s) => s.name === dish.section)?.id,
              },
            },
          },
        })
      )
    );
    console.log(savedMenu);
    return savedMenu;
  } catch (error) {
    console.log(error);
    return null;
  }
};
