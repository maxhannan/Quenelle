import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma.server";

export type PrepListSummaries = Prisma.PromiseReturnType<typeof getPrepLists>;

export function ExtractListData(data: FormData) {
  const saveAsTemplate = data.get("saveAsTemplate") ? true : false;
  const dishLink = data.getAll("dishId") as string[];
  const tgNames = data.getAll("dish") as string[];
  const tGroupNames = data.getAll("tGroupName") as string[];
  const taskNames = data.getAll("taskName") as string[];
  const recipeLinkId = data.getAll("recipeLinkId") as string[];
  const units = data.getAll("unit") as string[];
  console.log(tGroupNames, taskNames, recipeLinkId, units);
  const prepListData = {
    name: data.get("listName") as string,
    date: new Date(data.get("date") as string),
    station: data.get("station") as string,
    saveAsTemplate,
    taskGroups: tgNames.map((t, i) => ({
      name: t,
      linkRecipeId: dishLink[i].length > 0 ? dishLink[i] : undefined,
    })),
    tasks: taskNames.map((tn, i) => ({
      name: tn,
      unit: units[i],
      linkRecipeId: recipeLinkId[i].length > 0 ? recipeLinkId[i] : undefined,
      taskGroup: {
        name: tGroupNames[i],
      },
    })),
  };
  return prepListData;
}

export type listData = ReturnType<typeof ExtractListData>;

export async function CreatePrepList(prepListData: listData, authorId: string) {
  try {
    const prepList = await prisma.prepList.create({
      data: {
        name: prepListData.name,
        date: prepListData.date,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    });

    const formattedTasks = prepListData.tasks.map((task) => ({
      name: task.name,
      prepUnit: task.unit,
      linkRecipeId: task.linkRecipeId,
      taskGroupName: task.taskGroup.name,
    }));
    const taskGroups = await prisma.$transaction(
      prepListData.taskGroups.map((tg) =>
        prisma.taskGroup.create({
          data: {
            name: tg.name,
            prepList: {
              connect: {
                id: prepList.id,
              },
            },

            linkRecipe: {
              connect: {
                id: tg.linkRecipeId,
              },
            },
          },
        })
      )
    );
    if (taskGroups) {
      await prisma.$transaction(
        formattedTasks.map((task) => {
          if (task.linkRecipeId) {
            return prisma.tasks.create({
              data: {
                name: task.name,
                prepUnit: task.prepUnit,
                taskGroup: {
                  connect: {
                    id: taskGroups!.filter(
                      (tg) => tg.name === task.taskGroupName
                    )[0].id,
                  },
                },
                linkRecipe: {
                  connect: {
                    id: task.linkRecipeId,
                  },
                },
              },
            });
          } else {
            return prisma.tasks.create({
              data: {
                name: task.name,
                prepUnit: task.prepUnit,
                taskGroup: {
                  connect: {
                    id: taskGroups!.filter(
                      (tg) => tg.name === task.taskGroupName
                    )[0].id,
                  },
                },
              },
            });
          }
        })
      );
    }

    return prepList;
  } catch (error) {
    console.error(error);
    return null;
  }
}

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
