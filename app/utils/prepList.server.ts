import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma.server";
import { te } from "date-fns/locale";

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

export async function createListFromTemplate(data: FormData, authorId: string) {
  const templateId = data.get("templateId") as string;
  const date = new Date(data.get("templateDate") as string);
  console.log({ templateId }, { date });
  try {
    const template = await prisma.prepListTemplate.findUnique({
      where: {
        id: templateId,
      },
      include: {
        taskGroups: {
          include: {
            tasks: {
              include: {
                taskGroup: {
                  select: {
                    name: true,
                  },
                },
                linkRecipe: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            linkRecipe: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
    if (!template) return null;

    const tasks = template.taskGroups.map((tg) => tg.tasks).flat();
    const prepListData = {
      name: template.name,
      date,
      station: "",
      saveAsTemplate: false,
      taskGroups: template.taskGroups.map((t, i) => ({
        name: t.name,
        linkRecipeId: t.linkRecipe ? t.linkRecipe.id : undefined,
      })),
      tasks: tasks.map((tn, i) => ({
        name: tn.name,
        unit: tn.prepUnit ? tn.prepUnit : "",
        linkRecipeId: tn.linkRecipe ? tn.linkRecipe.id : undefined,
        taskGroup: {
          name: tn.taskGroup.name,
        },
      })),
    };
    const prepList = await CreatePrepList(prepListData, authorId);
    return prepList;
  } catch (error) {
    return null;
  }
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
    const formattedTaskGroups = prepListData.taskGroups.map((tg) => {
      if (tg.linkRecipeId) {
        return {
          name: tg.name,
          prepListId: prepList.id,

          linkRecipeId: tg.linkRecipeId,
        };
      } else {
        return {
          name: tg.name,
          prepListId: prepList.id,
        };
      }
    });
    await prisma.$transaction(
      formattedTaskGroups.map((tg) =>
        prisma.taskGroup.create({
          data: {
            ...tg,
            tasks: {
              create: [
                ...formattedTasks
                  .filter((t) => t.taskGroupName === tg.name)
                  .map((t) => ({
                    name: t.name,
                    prepUnit: t.prepUnit,
                    linkRecipeId: t.linkRecipeId,
                  })),
              ],
            },
          },
        })
      )
    );
    if (prepListData.saveAsTemplate) {
      await CreateListTemplate(prepListData, authorId);
    }
    return prepList;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function CreateListTemplate(
  prepListData: listData,
  authorId: string
) {
  try {
    const prepListTemplate = await prisma.prepListTemplate.create({
      data: {
        name: prepListData.name,

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
    const formattedTaskGroups = prepListData.taskGroups.map((tg) => {
      if (tg.linkRecipeId) {
        return {
          name: tg.name,
          templateId: prepListTemplate.id,

          linkRecipeId: tg.linkRecipeId,
        };
      } else {
        return {
          name: tg.name,
          templateId: prepListTemplate.id,
        };
      }
    });
    await prisma.$transaction(
      formattedTaskGroups.map((tg) =>
        prisma.taskGroup.create({
          data: {
            ...tg,
            tasks: {
              create: [
                ...formattedTasks
                  .filter((t) => t.taskGroupName === tg.name)
                  .map((t) => ({
                    name: t.name,
                    prepUnit: t.prepUnit,
                    linkRecipeId: t.linkRecipeId,
                  })),
              ],
            },
          },
        })
      )
    );

    return prepListTemplate;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTemplates() {
  try {
    const templates = await prisma.prepListTemplate.findMany({
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

    return templates;
  } catch (error) {
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
