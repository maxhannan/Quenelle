import { Combobox } from "@headlessui/react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import type { FC } from "react";
export interface ComboBoxOption {
  id: string;
  value: string;
}

interface Props {
  options: ComboBoxOption[];
  placeholder: string;
  name: string;
  allowCustom?: boolean;
  initValue?: ComboBoxOption;
  changeHandler?: (value: ComboBoxOption | null) => void;
}

const ComboBox: FC<Props> = ({
  options,
  placeholder,
  name,
  allowCustom = false,
  initValue,
  changeHandler,
}) => {
  const [selected, setSelected] = useState(initValue || null);
  const [query, setQuery] = useState("");

  const filteredList =
    query === ""
      ? options
      : options.filter((o) => {
          return o.value.toLowerCase().includes(query.toLowerCase());
        });

  const checkIfExists = (query: string, list: ComboBoxOption[]) => {
    let exists = false;

    list.forEach((option) => {
      if (option.value.toLowerCase() === query.toLowerCase()) {
        exists = true;
      }
    });
    return exists;
  };

  const handleChange = (value: ComboBoxOption | null) => {
    if (changeHandler) {
      changeHandler(value);
    }
    setSelected(value);
  };

  return (
    <Combobox value={selected} onChange={handleChange}>
      <div className="relative">
        <Combobox.Input
          autoComplete="off"
          name={name}
          className="rounded-xl focus:ring-neutral-500 bg-opacity-50 dark:bg-opacity-50 font-light border relative  border-neutral-300 dark:border-neutral-700 h-12 w-full p-2 pl-4 text-xl text-neutral-800    bg-neutral-200    placeholder-neutral-500 dark:bg-neutral-800  dark:placeholder-neutral-400 dark:text-neutral-50   "
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          displayValue={
            selected ? (option: ComboBoxOption) => option.value : undefined
          }
        />
        {selected !== null ? (
          <XMarkIcon
            onClick={() => {
              handleChange(null);
            }}
            className="w-6 h-6 absolute top-3 right-2 text-violet-500 dark:text-violet-500 hover:text-violet-600 "
          />
        ) : (
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon
              className="h-5 w-5 text-neutral-700"
              aria-hidden="true"
            />
          </Combobox.Button>
        )}
      </div>
      <Combobox.Options className="absolute mt-2 bg-neutral-100 z-50   rounded-r-2xl rounded-l-sm rounded-bl-2xl max-h-48 w-full  overflow-auto rounded-md  dark:bg-neutral-800 py-1 text-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none  ">
        {allowCustom && query.length > 0 && !checkIfExists(query, options) && (
          <Combobox.Option
            className={({ active }) =>
              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                active
                  ? "bg-neutral-700  text-neutral-100"
                  : "dark:text-neutral-300 text-neutral-700"
              }`
            }
            value={{ id: null, value: query }}
          >
            Create "{query}"
          </Combobox.Option>
        )}
        {!allowCustom && filteredList.length === 0 && query !== "" && (
          <div className="relative cursor-default select-none py-2 px-4 text-neutral-200">
            Nothing found.
          </div>
        )}
        {filteredList.map((option) => (
          <Combobox.Option
            className={({ active }) =>
              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                active
                  ? "bg-neutral-700  text-neutral-100"
                  : "dark:text-neutral-300 text-neutral-700"
              }`
            }
            key={option.id}
            value={option}
          >
            {option.value}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
};

export default ComboBox;
