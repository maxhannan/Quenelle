import { Listbox } from "@headlessui/react";
import { useState } from "react";
import type { FC } from "react";
interface Props {
  name: string;
  initialValue?: string[];
  changeHandler?: (value: string[]) => void;
  placeholder?: string;
  options: string[];
}

const MultiSelect: FC<Props> = ({
  name,
  initialValue,
  changeHandler,
  placeholder = "Select Allergens",
}) => {
  const [selected, setSelected] = useState(initialValue || []);

  const handleChange = (value: string[]) => {
    if (changeHandler) {
      changeHandler(value);
    }
    setSelected(value);
  };

  return (
    <div className="w-full z-30">
      <input type="hidden" value={selected.join(",")} name={name} />
      <Listbox value={selected} onChange={handleChange} multiple>
        <div className="relative "></div>
      </Listbox>
    </div>
  );
};

export default MultiSelect;
