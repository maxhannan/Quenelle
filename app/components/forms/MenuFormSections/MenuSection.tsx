import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import type { ChangeEvent, FC } from "react";
import IconButton from "~/components/buttons/IconButton";
import TextInput from "~/components/formInputs/TextInput";
import type { getDishes } from "~/utils/dishes.server";
import MenuDishSection from "./MenuDishSection";

interface Props {
  handleDelete: (id: string) => void;
  section: { id: string; value: string };
  dishes: Awaited<ReturnType<typeof getDishes>>;
  sectionDishes?: Awaited<ReturnType<typeof getDishes>>;
}

const MenuSection: FC<Props> = ({
  handleDelete,
  section,
  dishes,
  sectionDishes,
}) => {
  const [sectionName, setSectionName] = useState(
    section.value ? section.value : ""
  );

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSectionName(e.target.value);
  };
  return (
    <div className="border border-zinc-300 dark:border-zinc-700 rounded-2xl col-span-5 flex flex-col gap-2 ">
      <div className="flex gap-x-2 items-center bg-zinc-200 dark:bg-zinc-800 p-2 h-16 rounded-tl-2xl rounded-tr-2xl  ">
        <TextInput
          placeholder="Section Name"
          name="sectionName"
          initValue={section.value}
          changeHandler={changeHandler}
          required
        />
        <div className="flex justify-center items-center ml-auto">
          <IconButton
            Icon={XMarkIcon}
            name="deleteRecipe"
            onClick={() => handleDelete(section.id)}
          />
        </div>
      </div>
      <div className="p-2">
        <MenuDishSection
          section={sectionName}
          sectionDishes={sectionDishes && sectionDishes}
          dishes={dishes}
        />
      </div>
    </div>
  );
};

export default MenuSection;
