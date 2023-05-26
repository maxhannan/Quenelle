import type { FullRecipes } from "~/utils/recipes.server";

import ListCard from "~/components/display/ListCard";
import { useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";

export default function RecipeFeed({ recipes }: { recipes: FullRecipes }) {
  const location = useLocation();
  const [active, setActive] = useState<string | undefined>(
    location.pathname.split("/").slice(-1)[0]
  );
  console.log({ path: location.pathname.split("/").slice(-1)[0] });
  console.log({ location });

  useEffect(() => {
    setActive(location.pathname.split("/").slice(-1)[0]);
  }, [location]);
  return (
    <div className="grid z-0 relative grid-flow-row  auto-rows-max gap-y-2  mx-auto  mb-16 ">
      {recipes && recipes.length > 0 ? (
        recipes.map((r) => (
          <div key={r.id} onClick={() => setActive(r.id)}>
            <ListCard
              to={`/app/recipes/${r.id}`}
              name={r.name}
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
  );
}
