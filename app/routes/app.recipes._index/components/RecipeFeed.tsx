import type { FullRecipes } from "~/utils/recipes.server";

import ListCard from "~/components/display/ListCard";
import { useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import RecipeCard from "~/components/display/RecipesCard";
import SlideUpTransition from "~/components/animations/SlideUp";
import FadeIn from "~/components/animations/FadeIn";

export default function RecipeFeed({ recipes }: { recipes: FullRecipes }) {
  const location = useLocation();
  const [active, setActive] = useState<string | undefined>(
    location.pathname.split("/").slice(-1)[0]
  );

  useEffect(() => {
    setActive(location.pathname.split("/").slice(-1)[0]);
  }, [location]);
  return (
    <FadeIn>
      <div className="grid z-0 relative grid-flow-row  auto-rows-max gap-y-1  mx-auto  mb-32 ">
        {recipes && recipes.length > 0 ? (
          recipes.map((r) => (
            <div key={r.id} onClick={() => setActive(r.id)}>
              <RecipeCard
                to={`/app/recipes/${r.id + location.search} `}
                name={r.name}
                colorVariant={r.author.colorVariant}
                active={active === r.id}
                subHeading={r.category}
                user={r.author!.firstName[0] + r.author!.lastName[0]}
              />
            </div>
          ))
        ) : (
          <div className="w-full  text-xl dark:text-neutral-200 text-neutral-700 ">
            Nothing Found
          </div>
        )}
      </div>
    </FadeIn>
  );
}
