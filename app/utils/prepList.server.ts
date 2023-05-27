import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma.server";

export type PrepListSummaries = Prisma.PromiseReturnType<typeof getPrepLists>;

export async function getPrepLists() {
  try {
    const prepLists = await prisma.prepList.findMany({
      include: {
        _count: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
            id: true,
          },
        },
        taskGroups: {
          include: {
            linkRecipe: {
              select: {
                name: true,
                id: true,
              },
            },
            _count: true,
            tasks: {
              include: {
                linkRecipe: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return prepLists;
  } catch (error) {
    return null;
  }
}

export type PrepList = Prisma.PromiseReturnType<typeof getPrepListById>;
export async function getPrepListById(id: string) {
  try {
    const prepList = await prisma.prepList.findUnique({
      where: {
        id,
      },
      include: {
        _count: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
            id: true,
          },
        },
        taskGroups: {
          include: {
            linkRecipe: {
              select: {
                name: true,
                id: true,
              },
            },
            _count: true,
            tasks: {
              orderBy: {
                name: "asc",
              },
              include: {
                linkRecipe: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return prepList;
  } catch (error) {
    return null;
  }
}

export type TaskType = Prisma.PromiseReturnType<typeof getTaskById>;

const getTaskById = async (id: string) => {
  try {
    const task = await prisma.tasks.findUnique({
      where: { id },
      include: {
        linkRecipe: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    return task;
  } catch (error) {
    return null;
  }
};

interface updatedTask {
  onHand: string;
  prepQty: string;
  completed: boolean;
}
export const updateTask = async (id: string, updatedTask: updatedTask) => {
  try {
    const task = await prisma.tasks.update({
      where: {
        id,
      },
      data: {
        onHand: updatedTask.onHand,
        prepQty: updatedTask.prepQty,
        completed: updatedTask.completed,
      },
    });
    return task;
  } catch (error) {
    return null;
  }
};
