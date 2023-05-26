import { Transition } from "@headlessui/react";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import type { ComboBoxOption } from "~/components/formInputs/ComboBox";
import ComboBox from "~/components/formInputs/ComboBox";
import MultiSelect from "~/components/formInputs/MultiSelect";
import SearchBar from "~/components/formInputs/SearchBar";
import { useDebounce } from "~/hooks/useDebounce";
import { allergens } from "~/utils/staticLists";

interface Props {
  categories: string[];
  searchParams: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
}

const SearchAndFilter: FC<Props> = ({
  categories,
  searchParams,
  setSearchParams,
}) => {
  const [category, setCategory] = useState(searchParams.get("category"));
  const [allergies, setAllergies] = useState(searchParams.get("allergies"));
  console.log({ allergies });
  const navigation = useNavigation();
  const location = useLocation();

  const [loadingSearch, setLoadingSearch] = useState(false);

  const [openFilter, setOpenFilter] = useState(
    category !== null || allergies !== null ? true : false
  );
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  let [debouncedQuery, isDebouncing] = useDebounce(searchValue, 500);

  const handleCategorize = (category: ComboBoxOption | null) => {
    if (category) {
      searchParams.set("category", category.value);
      setSearchParams(searchParams);
    } else {
      searchParams.delete("category");
      setSearchParams(searchParams);
    }
  };

  const handleAllergies = (value: string[]) => {
    if (value.length > 0) {
      searchParams.set("allergies", value.join(","));
      setSearchParams(searchParams);
      setAllergies(value.join(","));
    } else {
      searchParams.delete("allergies");
      setSearchParams(searchParams);
      setAllergies(null);
    }
  };
  let initialRender = useRef(true);

  const handleSearchChange = (debouncedQuery: string) => {
    if (debouncedQuery.length > 0) {
      searchParams.set("search", debouncedQuery);
      setSearchParams(searchParams);
    } else {
      if (searchParams.get("search")) {
        searchParams.delete("search");
        setSearchParams(searchParams);
      }
    }
  };
  useEffect(() => {
    if (navigation.state === "loading" || isDebouncing) {
      setLoadingSearch(true);
    }
    if (navigation.state !== "loading" && !isDebouncing) {
      setLoadingSearch(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation.state, isDebouncing]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    } else {
      handleSearchChange(debouncedQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  useEffect(() => {
    console.log({ category, allergies });

    setCategory(searchParams.get("category"));
    setAllergies(searchParams.get("allergies"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);
  return (
    <>
      <div className="container   mx-auto flex  gap-x-2 ">
        <div className=" grow">
          <SearchBar
            handleChange={setSearchValue}
            value={searchValue}
            loading={loadingSearch}
          />
        </div>
        <div className=" flex items-center ">
          <button
            type="button"
            onClick={() => setOpenFilter(!openFilter)}
            className={`${
              openFilter ? "rounded-xl rounded-bl-md " : "rounded-xl"
            } duration-300 text-neutral-700 bg-opacity-50 dark:bg-opacity-50  border dark:border-neutral-700 border-neutral-300 transition-all h-12 w-12 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-neutral-300 font-medium   text-sm p-2.5 text-center inline-flex items-center dark:text-neutral-500  dark:hover:text-white dark:focus:ring-neutral-800 dark:hover:bg-neutral-500`}
          >
            {openFilter ? (
              <XMarkIcon className="w-7 h-7" />
            ) : (
              <FunnelIcon className="w-7 h-7" />
            )}
            <span className="sr-only">Icon description</span>
          </button>
        </div>
      </div>

      <Transition
        show={openFilter}
        className="z-30 relative flex-col flex gap-3 mt-3 "
        enter="transition-all ease-linear duration-500  overflow-hidden"
        enterFrom="transform opacity-0 max-h-0"
        enterTo="transform opacity-100 max-h-96"
        leave="transition-all ease-linear duration-200 overflow-hidden"
        leaveFrom="transform opacity-100 max-h-96"
        leaveTo="transform opacity-0 max-h-0"
      >
        <ComboBox
          name="category"
          placeholder="Category"
          changeHandler={handleCategorize}
          initValue={
            category!
              ? {
                  id: category,
                  value: category,
                }
              : undefined
          }
          options={categories.map((c) => ({
            id: c,
            value: c,
          }))}
        />
        <MultiSelect
          name="allergens"
          changeHandler={handleAllergies}
          initialValue={allergies ? allergies.split(",") : []}
          options={allergens}
          placeholder="Filter Out Allergens"
          controlledValue={allergies ? allergies.split(",") : []}
        />
      </Transition>
    </>
  );
};

export default SearchAndFilter;
