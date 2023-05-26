import type { FullRecipes } from "~/utils/recipes.server";

import ListCard from "~/components/display/ListCard";

export default function RecipeFeed({ recipes }: { recipes: FullRecipes }) {
  return (
    <div className="grid z-0 relative grid-flow-row  auto-rows-max gap-y-2  mx-auto  mb-16 xl:overflow-scroll xl:h-screen scrollbar-none">
      {recipes && recipes.length > 0 ? (
        recipes.map((r) => (
          <ListCard
            key={r.id}
            to={`/app/recipes/${r.id}`}
            name={r.name}
            subHeading={r.category}
            user={r.author!.firstName[0] + r.author!.lastName[0]}
          />
        ))
      ) : (
        <div className="w-full  text-xl dark:text-neutral-200 text-neutral-700 ">
          Nothing Found
        </div>
      )}
    </div>
  );
}
