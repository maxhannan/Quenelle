import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma.server";

export type PrepListSummaries = Prisma.PromiseReturnType<typeof getPrepLists>;

export function ExtractListData(data: FormData) {
  const saveAsTemplate = !!data.get("saveAsTemplate");
  const dishIds = data.getAll("dishId") as string[];
  const tgNames = data.getAll("dish") as string[];
  const tGroupNames = data.getAll("tGroupName") as string[];
  const taskNames = data.getAll("taskName") as string[];
  const recipeLinkIds = data.getAll("recipeLinkId") as string[];
  const units = data.getAll("unit") as string[];

  const prepListData = {
    name: data.get("listName") as string,
    date: new Date(data.get("date") as string),
    station: data.get("station") as string,
    saveAsTemplate,
    taskGroups: tgNames.map((name, i) => ({
      name,
      linkRecipeId: dishIds[i] || undefined,
    })),
    tasks: taskNames.map((name, i) => ({
      name,
      unit: units[i] || "",
      linkRecipeId: recipeLinkIds[i] || undefined,
      taskGroup: {
        name: tGroupNames[i],
      },
    })),
  };

  return prepListData;
}

export async function getTemplateById(id: string) {
  try {
    const template = await prisma.prepListTemplate.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        author: { select: { id: true, username: true } },
        taskGroups: {
          orderBy: { name: "asc" },
          include: {
            tasks: {
              orderBy: { name: "asc" },
              include: {
                taskGroup: { select: { name: true } },
                linkRecipe: { select: { id: true, name: true } },
              },
            },
            linkRecipe: { select: { id: true, name: true } },
          },
        },
      },
    });

    return template;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createListFromTemplate(data: FormData, authorId: string) {
  const templateId = data.get("templateId") as string;
  const date = new Date(data.get("templateDate") as string);
  console.log({ templateId }, { date });

  try {
    const template = await getTemplateById(templateId);

    if (!template) return null;

    const taskGroupsData = template.taskGroups.map((tg) => ({
      name: tg.name,
      linkRecipeId: tg.linkRecipe ? tg.linkRecipe.id : undefined,
    }));

    const tasksData = template.taskGroups
      .flatMap((tg) => tg.tasks)
      .map((task) => ({
        name: task.name,
        unit: task.prepUnit || "",
        linkRecipeId: task.linkRecipe ? task.linkRecipe.id : undefined,
        taskGroup: { name: task.taskGroup.name },
      }));

    const prepListData = {
      name: template.name,
      date,
      station: "",
      saveAsTemplate: false,
      taskGroups: taskGroupsData,
      tasks: tasksData,
    };

    const prepList = await createPrepList(prepListData, authorId);
    return prepList;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export type listData = ReturnType<typeof ExtractListData>;

export async function createPrepList(prepListData: listData, authorId: string) {
  try {
    const { name, date, tasks, taskGroups, saveAsTemplate } = prepListData;

    const prepList = await prisma.prepList.create({
      data: {
        name,
        date,
        author: {
          connect: { id: authorId },
        },
        taskGroups: {
          create: taskGroups.map(({ name, linkRecipeId }) => ({
            name,
            linkRecipe: linkRecipeId
              ? { connect: { id: linkRecipeId } }
              : undefined,
            tasks: {
              create: tasks
                .filter((task) => task.taskGroup.name === name)
                .map(({ name, unit, linkRecipeId }) => ({
                  name,
                  prepUnit: unit,
                  linkRecipe: linkRecipeId
                    ? { connect: { id: linkRecipeId } }
                    : undefined,
                })),
            },
          })),
        },
      },
      include: {
        taskGroups: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (saveAsTemplate) {
      await createPrepListTemplate(prepListData, authorId);
    }

    return prepList;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createPrepListTemplate(
  prepListData: listData,
  authorId: string
) {
  try {
    const { name, tasks, taskGroups } = prepListData;

    const template = await prisma.prepListTemplate.create({
      data: {
        name,

        author: {
          connect: { id: authorId },
        },
        taskGroups: {
          create: taskGroups.map(({ name, linkRecipeId }) => ({
            name,
            linkRecipe: linkRecipeId
              ? { connect: { id: linkRecipeId } }
              : undefined,
            tasks: {
              create: tasks
                .filter((task) => task.taskGroup.name === name)
                .map(({ name, unit, linkRecipeId }) => ({
                  name,
                  prepUnit: unit,
                  linkRecipe: linkRecipeId
                    ? { connect: { id: linkRecipeId } }
                    : undefined,
                })),
            },
          })),
        },
      },
      include: {
        taskGroups: {
          include: {
            tasks: true,
          },
        },
      },
    });

    return template;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateTemplate(
  id: string,
  prepListData: listData,
  authorId: string
) {
  try {
    const { name, tasks, taskGroups } = prepListData;
    const data = await prisma.$transaction([
      prisma.prepListTemplate.delete({
        where: {
          id,
        },
      }),
      prisma.prepListTemplate.create({
        data: {
          id: id,
          name,
          author: {
            connect: { id: authorId },
          },
          taskGroups: {
            create: taskGroups.map(({ name, linkRecipeId }) => ({
              name,
              linkRecipe: linkRecipeId
                ? { connect: { id: linkRecipeId } }
                : undefined,
              tasks: {
                create: tasks
                  .filter((task) => task.taskGroup.name === name)
                  .map(({ name, unit, linkRecipeId }) => ({
                    name,
                    prepUnit: unit,
                    linkRecipe: linkRecipeId
                      ? { connect: { id: linkRecipeId } }
                      : undefined,
                  })),
              },
            })),
          },
        },
        include: {
          taskGroups: {
            include: {
              tasks: true,
            },
          },
        },
      }),
    ]);
    return data[1];
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
        assignedTo: {
          select: {
            firstName: true,
            lastName: true,
            id: true,
          },
        },
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
