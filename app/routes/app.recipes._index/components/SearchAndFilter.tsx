import { useNavigation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { ComboBoxOption } from "~/components/formInputs/ComboBox";
import { useDebounce } from "~/hooks/useDebounce";

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
  const category = searchParams.get("category");
  const allergies = searchParams.get("allergies");

  const navigation = useNavigation();

  const [loadingSearch, setLoadingSearch] = useState(false);

  const [openFilter, setOpenFilter] = useState(
    category !== null || allergies !== null ? true : false
  );
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  let [debouncedQuery, isDebouncing] = useDebounce(searchValue, 500);

  const handleSearch: (search: string) => void = (search: string) => {
    console.log({ search });
    setSearchValue(search);
  };

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
    } else {
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
    if (initialRender.current) {
      initialRender.current = false;
      return;
    } else {
      handleSearchChange(debouncedQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return <div>SearchAndFilter</div>;
};

export default SearchAndFilter;
