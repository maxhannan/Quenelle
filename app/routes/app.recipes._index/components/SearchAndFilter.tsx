import { Transition } from "@headlessui/react";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import IconColorButton from "~/components/buttons/IconColorButton";
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
  searchValues: {
    searchValue: string;
    category: string | null;
    allergies: string[];
  };
  changeSearchValues: ({
    field,
    value,
  }: {
    field: "searchValue" | "category" | "allergies";
    value: string | string[] | null;
  }) => void;
}

const SearchAndFilter: FC<Props> = ({
  categories,
  searchParams,
  setSearchParams,
  searchValues,
  changeSearchValues,
}) => {
  const navigation = useNavigation();

  const [loadingSearch, setLoadingSearch] = useState(false);

  const [openFilter, setOpenFilter] = useState(
    searchValues.category !== null || searchValues.allergies.length > 0
      ? true
      : false
  );

  useEffect(() => {
    if (searchValues.category !== null || searchValues.allergies.length > 0) {
      setOpenFilter(true);
    }
  }, [searchValues.category, searchValues.allergies]);
  let [debouncedQuery, isDebouncing] = useDebounce(
    searchValues.searchValue,
    500
  );

  const handleCategorize = (category: ComboBoxOption | null) => {
    if (category) {
      searchParams.set("category", category.value);
      changeSearchValues({ field: "category", value: category.value });
      setSearchParams(searchParams);
    } else {
      searchParams.delete("category");
      changeSearchValues({ field: "category", value: null });
      setSearchParams(searchParams);
    }
  };

  const handleAllergies = (value: string[]) => {
    if (value.length > 0) {
      changeSearchValues({ field: "allergies", value: value });
      searchParams.set("allergies", value.join(","));
      setSearchParams(searchParams);
    } else {
      changeSearchValues({ field: "allergies", value: [] });
      searchParams.delete("allergies");
      setSearchParams(searchParams);
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
    if (
      navigation.state !== "loading" &&
      navigation.state === "idle" &&
      !isDebouncing
    ) {
      setLoadingSearch(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDebouncing, navigation.state]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    } else {
      handleSearchChange(debouncedQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <>
      <div className="container   mx-auto flex  gap-x-2  ">
        <div className=" grow">
          <SearchBar
            handleChange={(val) => {
              console.log({ val });

              changeSearchValues({ field: "searchValue", value: val });
            }}
            value={searchValues.searchValue}
            loading={loadingSearch}
          />
        </div>
        <div className=" flex items-center ">
          <IconColorButton
            type="button"
            Icon={openFilter ? XMarkIcon : FunnelIcon}
            onClick={() => setOpenFilter(!openFilter)}
            color={openFilter ? "rose" : "zinc"}
          ></IconColorButton>
        </div>
      </div>

      <Transition
        show={openFilter}
        className="z-30 relative flex-col flex gap-2 mt-2 mb-1"
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
          initValue={
            searchValues.category
              ? { id: searchValues.category, value: searchValues.category }
              : undefined
          }
          controlledValue={
            searchValues.category
              ? { id: searchValues.category, value: searchValues.category }
              : undefined
          }
          changeHandler={handleCategorize}
          options={categories.map((c) => ({
            id: c,
            value: c,
          }))}
        />
        <MultiSelect
          name="allergens"
          controlledValue={searchValues.allergies}
          initialValue={searchValues.allergies || undefined}
          changeHandler={handleAllergies}
          options={allergens}
          placeholder="Filter Out Allergens"
        />
      </Transition>
    </>
  );
};

export default SearchAndFilter;
