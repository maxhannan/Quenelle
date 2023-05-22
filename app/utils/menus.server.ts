import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma.server";

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
