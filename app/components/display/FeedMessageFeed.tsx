import type { FC } from "react";
import { type getFeedMessages } from "~/routes/app/route";
import { colorVariants } from "~/utils/staticLists";
import Avatar from "./Avatar";
import { BadgePlusIcon, DeleteIcon, FileEdit } from "lucide-react";
import RecipeCard from "./RecipesCard";
import { formatDistance } from "date-fns";

interface Props {
  feedMessages: Awaited<ReturnType<typeof getFeedMessages>>;
}

const FeedMessageFeed: FC<Props> = ({ feedMessages }) => {
  return (
    <div className="flex flex-col gap-2 rounded-2xl  ">
      {feedMessages.map((m) => (
        <div
          key={m.id}
          className="flex flex-col gap-2 rounded-2xl  text-zinc-700 "
        >
          <div className="flex gap-2 items-center   ">
            <h3 className=" dark:text-zinc-200 text-zinc-700 px-1 text-sm md:text-base">
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
          <div className="w-full h-[3px] bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
        </div>
      ))}
      {/* divider span */}
    </div>
  );
};

export default FeedMessageFeed;
