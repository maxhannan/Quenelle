import { type FC, useState } from "react";
import { v4 } from "uuid";
import type { getDishes } from "~/utils/dishes.server";
import MenuDish from "./MenuDish";
import { PlusIcon } from "@heroicons/react/24/outline";

interface Props {
  section: string;
  sectionDishes?: Awaited<ReturnType<typeof getDishes>>;
  dishes: Awaited<ReturnType<typeof getDishes>>;
}
export interface DishOption {
  id: string;
  linkRecipe: { id: string; value: string } | null;
}

const MenuDishSection: FC<Props> = ({ sectionDishes, dishes, section }) => {
  const [dishesList, setDishesList] = useState<DishOption[] | []>(
    sectionDishes
      ? sectionDishes.map((d) => ({
          id: d.id,
          linkRecipe: { id: d.id, value: d.name },
        }))
      : []
  );

  const addDish = () => {
    const newDish = {
      id: v4(),

      linkRecipe: null,
    };
    setDishesList([...dishesList, newDish]);
  };

  const handleDelete = (id: string) => {
    setDishesList((dishes) => dishes.filter((d) => d.id !== id));
  };

  return (
    <div className="grid grid-cols-12 col-span-5 gap-x-2 gap-y-4">
      {dishesList.length > 0 &&
        dishesList.map((d) => (
          <MenuDish
            dishes={dishes}
            handleDelete={handleDelete}
            section={section}
            dish={d}
            key={d.id}
          />
        ))}

      <button
        onClick={addDish}
        type="button"
        className="col-span-12   h-12 inline-flex border-r-none items-center dark:hover:text-neutral-700 justify-between px-3 dark:bg-neutral-900  hover:bg-neutral-700 border dark:border-neutral-700 border-neutral-300 border-dashed hover:text-neutral-200 hover:dark:bg-neutral-200  transition-all duration-300 rounded-2xl text-lg text-neutral-700 dark:text-neutral-100  "
      >
        <h4 className="text-xl  ">Add Dish</h4>
        <PlusIcon className="h-7 w-7" />
      </button>
    </div>
  );
};

export default MenuDishSection;
