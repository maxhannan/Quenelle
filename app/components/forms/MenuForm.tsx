import type { FC } from "react";
import type { getDishes } from "~/utils/dishes.server";
import TextInput from "../formInputs/TextInput";
import type { getMenuById } from "~/utils/menus.server";
import ComboBox from "../formInputs/ComboBox";
import MenuSections from "./MenuFormSections/MenuSections";
import SlideUpTransition from "../animations/SlideUp";

interface Props {
  dishes: Awaited<ReturnType<typeof getDishes>>;
  menu?: Awaited<ReturnType<typeof getMenuById>>;
  services: string[];
}

const MenuForm: FC<Props> = ({ dishes, menu, services }) => {
  console.log({ services }, "FORM");
  const menuValue = menu
    ? formatMenu(menu)
    : {
        name: "",
        service: undefined,
      };
  return (
    <SlideUpTransition>
      <div className="flex flex-col gap-3 mt-2 relative">
        <TextInput
          name="menuName"
          placeholder="Menu Name"
          initValue={menuValue.name}
        />
        <ComboBox
          name="service"
          placeholder="Service"
          allowCustom
          initValue={
            menuValue.service
              ? { id: menuValue.service, value: menuValue.service }
              : undefined
          }
          options={services.map((c) => ({
            id: c,
            value: c,
          }))}
        />
        <MenuSections
          dishes={dishes}
          menuSections={menu ? menu.sections : undefined}
        />
      </div>
    </SlideUpTransition>
  );
};

const formatMenu = (menu: Awaited<ReturnType<typeof getMenuById>>) => {
  const { name, service } = menu!;
  return { name, service };
};
export default MenuForm;
