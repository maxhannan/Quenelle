import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { formatDistance } from "date-fns";
import { BadgePlusIcon, DeleteIcon, FileEdit } from "lucide-react";

import Spinner from "~/components/LoadingSpinner";
import Avatar from "~/components/display/Avatar";
import RecipeCard from "~/components/display/RecipesCard";
import NewAppBar from "~/components/navigation/NewAppBar";

import { getUser } from "~/utils/auth.server";
import { prisma } from "~/utils/prisma.server";
import { colorVariants } from "~/utils/staticLists";

const isToday = (someDate: Date) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};
export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  const feedMessages = await prisma.feedMessage.findMany({
    where: {
      teams: {
        some: {
          members: {
            some: {
              id: user!.id,
            },
          },
        },
      },
    },
    take: 50,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      linkRecipe: {
        include: {
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
              id: true,
              firstName: true,
              lastName: true,
              colorVariant: true,
            },
          },
        },
      },
      linkMenu: {
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
              colorVariant: true,
            },
          },
          _count: {
            select: {
              sections: true,
              dishes: true,
            },
          },
        },
      },
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          colorVariant: true,
        },
      },
    },
  });
  const assignedLists = user!.assignedLists;

  return { user, feedMessages, assignedLists };
};

function HomeRoute() {
  const { user, feedMessages, assignedLists } = useLoaderData<typeof loader>();
  console.log({ user, feedMessages });
  const assignedListsToday = assignedLists.filter((l) => {
    return isToday(new Date(l.date));
  });
  const navigation = useNavigation();

  if (navigation.state === "loading")
    return (
      <div className=" mx-auto h-screen  flex items-center justify-center">
        <Spinner size={14} />
      </div>
    );
  if (!user) return null;
  return (
    <div className=" container mx-auto max-w-4xl   flex flex-col  mb-28">
      <NewAppBar page={`Hi ${user.firstName}!`} bottomPadding="2"></NewAppBar>
      <div className="mb-2">
        {assignedListsToday.length > 0 && (
          <div className="w-full flex flex-col gap-2 p-2 px-3 bg-zinc-200 bg-opacity-40 dark:bg-opacity-40 dark:bg-zinc-800 rounded-2xl">
            <div className="text-lg text-indigo-500  ">
              Your prep list{assignedListsToday.length > 1 && "s"} for today.
            </div>

            {assignedListsToday.map((l) => (
              <RecipeCard
                key={l.id}
                to={`/app/prep/${l.id}`}
                subHeading={`Assigned By ${l.author.firstName} ${l.author.lastName}`}
                user={(
                  l.author.firstName[0] + l.author.lastName[0]
                ).toLowerCase()}
                name={l.name}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 rounded-2xl bg-zinc-200 bg-opacity-40 dark:bg-opacity-40 dark:bg-zinc-800 p-2">
        {feedMessages.map((m) => (
          <div
            key={m.id}
            className="flex flex-col gap-2 rounded-2xl bg-zinc-100 dark:bg-zinc-900 p-2 text-zinc-700"
          >
            <div className="flex gap-2 items-center px-2">
              <h3 className=" dark:text-zinc-200 text-zinc-700 text-sm md:text-base ">
                {m.content}
              </h3>
              {m.content.includes("updated") ? (
                <FileEdit className="w-5 h-5 text-yellow-500 ml-auto flex-none" />
              ) : m.content.includes("created") ? (
                <BadgePlusIcon className="w-5 h-5 text-green-500 ml-auto flex-none" />
              ) : m.content.includes("deleted") ? (
                <DeleteIcon className="w-5 h-5 text-red-500 ml-auto flex-none" />
              ) : (
                ""
              )}
            </div>
            {m.linkRecipe && (
              <RecipeCard
                to={`/app/${m.linkRecipe.dish ? "menus/dishes/" : "recipes/"}${
                  m.linkRecipe.id
                }`}
                subHeading={
                  m.linkRecipe.dish
                    ? `${m.linkRecipe._count.ingredients} Component${
                        m.linkRecipe._count.ingredients !== 1 ? "s" : ""
                      } `
                    : m.linkRecipe.category
                }
                colorVariant={m.linkRecipe.author.colorVariant}
                user={(
                  m.linkRecipe.author.firstName[0] +
                  m.linkRecipe.author.lastName[0]
                ).toLowerCase()}
                name={m.linkRecipe.name}
              />
            )}
            {m.linkMenu && (
              <RecipeCard
                to={`/app/menus/${m.linkMenu.id}`}
                subHeading={`${m.linkMenu._count.dishes} Dish${
                  m.linkMenu._count.dishes !== 1 ? "es" : ""
                }`}
                colorVariant={m.linkMenu.author.colorVariant}
                user={(
                  m.linkMenu.author.firstName[0] + m.linkMenu.author.lastName[0]
                ).toLowerCase()}
                name={m.linkMenu.name}
              />
            )}
            <div className="w-full flex justify-end">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDistance(new Date(m.createdAt), new Date()) + " ago"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeRoute;
