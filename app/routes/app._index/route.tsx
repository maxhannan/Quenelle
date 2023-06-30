import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { formatDistance, isSameDay } from "date-fns";
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
        },
      },
    },
  });
  const assignedListsToday = user!.assignedLists.filter((l) => {
    console.log({
      listDate: new Date(l.date),
      today: new Date(Date.now()),
      isSame: isSameDay(new Date(l.date), new Date(Date.now())),
      isToday: isToday(new Date(l.date)),
    });
    return isToday(new Date(l.date));
  });

  return { user, feedMessages, assignedListsToday };
};

function HomeRoute() {
  const { user, feedMessages, assignedListsToday } =
    useLoaderData<typeof loader>();
  console.log({ user, feedMessages });

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
      <NewAppBar page="" bottomPadding="0"></NewAppBar>
      <div className="mb-4">
        <div className="text-[3rem] md:text-4xl   items-center  w-full    dark:text-neutral-200  font-bold text-neutral-600 rounded-2xl  ">
          <h1>Hi {user.firstName}!</h1>
        </div>
        {assignedListsToday.length > 0 && (
          <div className="w-full flex flex-col gap-2 ">
            <div className="text-lg text-indigo-500 font-semibold ">
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
      <div className="flex flex-col gap-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 p-2">
        {feedMessages.map((m) => (
          <div
            key={m.id}
            className="flex flex-col gap-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 p-2 text-zinc-700"
          >
            <div className="flex gap-2 items-center">
              <Avatar
                content={(
                  m.author.firstName[0] + m.author.lastName[0]
                ).toLowerCase()}
                color={
                  colorVariants[
                    Math.floor(Math.random() * (colorVariants.length - 1))
                  ]
                }
              />

              <h3 className=" dark:text-zinc-200 text-zinc-700 text-sm md:text-base">
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
