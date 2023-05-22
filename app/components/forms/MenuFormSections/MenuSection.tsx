import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, FC, useState } from "react";
import IconButton from "~/components/buttons/IconButton";
import TextInput from "~/components/formInputs/TextInput";
import { getDishes } from "~/utils/dishes.server";
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
    <>
      <div className="flex gap-x-2 col-span-5 ">
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
      <MenuDishSection
        section={sectionName}
        sectionDishes={sectionDishes && sectionDishes}
        dishes={dishes}
      />
    </>
  );
};

export default MenuSection;
