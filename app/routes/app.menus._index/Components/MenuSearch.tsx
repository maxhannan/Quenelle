import { useNavigation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import type { Dispatch, FC } from "react";
import SearchBar from "~/components/formInputs/SearchBar";
import { useDebounce } from "~/hooks/useDebounce";

interface Props {
  searchParams: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
  searchValue: string;
  setSearchValue: Dispatch<React.SetStateAction<string>>;
}

const MenuSearch: FC<Props> = ({
  searchParams,
  setSearchParams,
  searchValue,
  setSearchValue,
}) => {
  const navigation = useNavigation();
  const [loadingSearch, setLoadingSearch] = useState(false);

  let [debouncedQuery, isDebouncing] = useDebounce(searchValue, 500);

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

  return (
    <SearchBar
      handleChange={setSearchValue}
      value={searchValue}
      loading={loadingSearch}
    />
  );
};

export default MenuSearch;
