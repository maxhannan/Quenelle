import { Combobox, Transition } from "@headlessui/react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
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
  selectedLinkId?: string;
}

const ComboBox: FC<Props> = ({
  options,
  placeholder,
  name,
  allowCustom = false,
  initValue,
  changeHandler,
  selectedLinkId,
}) => {
  const [selected, setSelected] = useState(initValue || null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setSelected(initValue || null);
  }, [initValue]);
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
      <div className="relative w-full ">
        <div className="relative ">
          <input
            type="hidden"
            value={selectedLinkId || ""}
            name={`${name}Id`}
          />
          <Combobox.Input
            name={name}
            className="rounded-2xl pr-8 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none bg-zinc-100  focus:ring-2   font-light border relative  border-zinc-300 dark:border-zinc-700 h-12 w-full p-2 pl-4 text-xl text-zinc-800 dark:bg-zinc-900      placeholder-neutral-500   dark:placeholder-neutral-400 dark:text-neutral-50   "
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
              className="w-6 h-6 absolute top-3 right-2 text-indigo-500 dark:text-indigo-500 hover:text-indigo-600 "
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
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-2 bg-zinc-100 z-50 dark:bg-zinc-800 rounded-2xl  overflow-auto max-h-48 w-full  py-1 text-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none  ">
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
        </Transition>
      </div>
    </Combobox>
  );
};

export default ComboBox;
