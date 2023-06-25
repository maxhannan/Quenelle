import { type FC, useState } from "react";
import { v4 } from "uuid";
import type { FullSection } from "~/utils/menus.server";
import MenuSection from "./MenuSection";
import { type getDishes } from "~/utils/dishes.server";
import { PlusIcon } from "@heroicons/react/24/outline";

interface Props {
  menuSections?: FullSection[];
  dishes: Awaited<ReturnType<typeof getDishes>>;
}

const MenuSections: FC<Props> = ({ menuSections, dishes }) => {
  const [sections, setSections] = useState(
    menuSections ? menuSections.map((s) => ({ id: s!.id, value: s!.name })) : []
  );

  const addSection = () => {
    setSections([...sections, { id: v4(), value: "" }]);
  };

  const handleDelete = (id: string) => {
    setSections((sections) => sections.filter((s) => s.id !== id));
  };

  return (
    <div className="grid grid-cols-5  gap-y-4 gap-x-2 w-full  z-20">
      <div className="flex gap-x-2 col-span-5">
        <div className="grow h-14   inline-flex items-center border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 bg-zinc-200 transition-all duration-300   pl-3 font-light rounded-2xl text-lg text-zinc-800 dark:text-zinc-200  ">
          <h4 className="text-3xl  ">Sections</h4>
        </div>
      </div>
      {sections.length > 0 &&
        sections.map((s) => (
          <MenuSection
            key={s.id}
            dishes={dishes}
            handleDelete={handleDelete}
            section={s}
            sectionDishes={
              dishes &&
              dishes.filter((d) => d.section.map((ds) => ds.id).includes(s.id))
            }
          />
        ))}
      <button
        onClick={addSection}
        type="button"
        className="col-span-5   h-12 inline-flex border-r-none items-center dark:hover:text-zinc-700 justify-between px-3 dark:bg-zinc-900 bg-zinc-100 hover:bg-zinc-700 border dark:border-zinc-700 border-zinc-300 border-dashed hover:text-zinc-200 hover:dark:bg-zinc-200  transition-all duration-300  rounded-2xl text-lg text-zinc-700 dark:text-zinc-100  "
      >
        <h4 className="text-xl  ">Add Section</h4>
        <PlusIcon className="h-7 w-7" />
      </button>
    </div>
  );
};

export default MenuSections;
