import {
  ArrowUturnLeftIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

import { useLocation, useNavigate, useNavigation } from "@remix-run/react";
import React from "react";
import Spinner from "~/components/LoadingSpinner";
import IconButton from "~/components/buttons/IconButton";
import AppBar from "~/components/navigation/AppBar";
import { useMenu } from "../app.menus.$id/route";
import ListCard from "~/components/display/ListCard";
import MultiSelect from "~/components/formInputs/MultiSelect";
import { allergens } from "~/utils/staticLists";
import SlideUpTransition from "~/components/animations/SlideUp";
import RecipeCard from "~/components/display/RecipesCard";

function MenuIndex() {
  const menu = useMenu();

  const navigate = useNavigate();
  const navigation = useNavigation();

  const [allergies, setAllergies] = React.useState<string[]>([]);
  const location = useLocation();

  if (
    navigation.state === "loading" &&
    navigation.location.pathname !== location.pathname
  )
    return (
      <div className=" mx-auto h-screen  flex items-center justify-center">
        <Spinner size={14} />
      </div>
    );
  if (!menu) return <span>Menu not found</span>;

  const handleChange = (v: string[]) => {
    setAllergies(v);
  };

  const filteredSections = menu.sections.map((s) => {
    return {
      ...s,
      dishes: s.dishes.filter((d) => {
        let allergyFree = true;
        d.allergens.forEach((a) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          allergies.includes(a) ? (allergyFree = false) : null;
        });
        return allergyFree;
      }),
    };
  });

  const filteredMenu = { ...menu, sections: filteredSections };

  return (
    <div className=" mb-28 container mx-auto xl:pl-2 ">
      <AppBar page={""}>
        <IconButton
          name="Edit"
          onClick={() => navigate("edit", { replace: true })}
          Icon={PencilSquareIcon}
        />
        <IconButton
          name="goBack"
          onClick={() => navigate(-1)}
          Icon={ArrowUturnLeftIcon}
        />
      </AppBar>
      <SlideUpTransition>
        <div className="text-3xl md:text-4xl   w-full items-center flex pl-1 justify-between mb-3  dark:text-neutral-200  font-bold text-neutral-600 rounded-xl ">
          <div>{menu.name}</div>
        </div>
        <div className="mb-2  ">
          <MultiSelect
            name="allergens"
            options={allergens}
            changeHandler={handleChange}
          />
        </div>
        <div className="w-full grid  gap-2 ">
          {filteredMenu.sections.map((s) => s.dishes).join("").length === 0 && (
            <div className="w-full text-2xl text-zinc-800 dark:text-zinc-200 flex justify-center">
              No dishes found
            </div>
          )}
          <div className="flex flex-col gap-2">
            {filteredMenu.sections
              .slice(0, Math.ceil(filteredMenu.sections.length / 2))
              .map((s) => {
                if (s.dishes.length === 0) return null;
                return (
                  <div
                    key={s.id}
                    className="flex flex-col gap-2 bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-2 border border-zinc-300 dark:border-zinc-700 "
                  >
                    <div className="text-2xl border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 gap-3 bg-opacity-75 bg-zinc-200  px-4 w-full items-center flex justify-between dark:text-zinc-200 p-4  text-zinc-600 rounded-xl font-light ">
                      <div>{s.name}</div>
                    </div>
                    {s.dishes.map((d) => (
                      <RecipeCard
                        name={d.name}
                        colorVariant={d.author.colorVariant}
                        key={d.id}
                        to={`/app/menus/dishes/${d.id}`}
                        subHeading={`${d._count.ingredients} Component${
                          d._count.ingredients !== 1 ? "s" : ""
                        } `}
                        user={d.author!.firstName[0] + d.author!.lastName[0]}
                      />
                    ))}
                  </div>
                );
              })}
          </div>
          <div className="flex flex-col gap-2">
            {filteredMenu.sections
              .slice(Math.ceil(filteredMenu.sections.length / 2))
              .map((s) => {
                if (s.dishes.length === 0) return null;
                return (
                  <div
                    key={s.id}
                    className="flex flex-col gap-2 bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-2 border border-zinc-300 dark:border-zinc-700 "
                  >
                    <div className="text-2xl border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 gap-3 bg-opacity-75 bg-zinc-200  px-4 w-full items-center flex justify-between dark:text-zinc-200 p-4  text-zinc-600 rounded-xl font-light ">
                      <div>{s.name}</div>
                    </div>
                    {s.dishes.map((d) => (
                      <RecipeCard
                        name={d.name}
                        key={d.id}
                        to={`/app/menus/dishes/${d.id}`}
                        colorVariant={d.author.colorVariant}
                        subHeading={`${d._count.ingredients} Component${
                          d._count.ingredients !== 1 ? "s" : ""
                        } `}
                        user={d.author!.firstName[0] + d.author!.lastName[0]}
                      />
                    ))}
                  </div>
                );
              })}
          </div>
        </div>
      </SlideUpTransition>
    </div>
  );
}

export default MenuIndex;
