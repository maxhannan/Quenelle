import { useState } from "react";
import type { FC } from "react";
import type { DishOption } from "./MenuDishSection";
import type { getDishes } from "~/utils/dishes.server";
import ComboBox from "~/components/formInputs/ComboBox";
import IconButton from "~/components/buttons/IconButton";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  handleDelete: (id: string) => void;
  dish: DishOption;
  section: string;
  dishes: Awaited<ReturnType<typeof getDishes>>;
}

const MenuDish: FC<Props> = ({ dish, section, dishes, handleDelete }) => {
  const [selectedLink, setSelectedLink] = useState(dish.linkRecipe);
  const handleLinkChange = (value: { id: string; value: string } | null) => {
    setSelectedLink(value);
  };

  return (
    <>
      <div className="flex gap-x-2 col-span-12  relative">
        <div className="grow relative">
          <input type="hidden" name="dishSection" value={section} />
          <ComboBox
            name="recipeLink"
            placeholder="Link a recipe"
            changeHandler={handleLinkChange}
            initValue={selectedLink ? selectedLink : undefined}
            options={
              dishes ? dishes.map((r) => ({ id: r.id, value: r.name })) : []
            }
            selectedLinkId={selectedLink?.id}
          />
        </div>
        <div className="flex justify-center items-center ml-auto">
          <IconButton
            Icon={XMarkIcon}
            type="button"
            name="deleteRecipe"
            onClick={() => handleDelete(dish.id)}
          />
        </div>
      </div>

      <div className="col-span-12 border-b-4 rounded-sm dark:border-neutral-700"></div>
    </>
  );
};

export default MenuDish;
