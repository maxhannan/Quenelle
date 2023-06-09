import React, { useEffect, useState } from "react";
import { usePrepLists } from "../app.prep/route";

import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { add, format, formatRelative, isSameDay } from "date-fns";

import PrepCalendar from "./components/PrepCalendar";
import ListCard from "~/components/display/ListCard";

import IconButton from "~/components/buttons/IconButton";
import CustomModal from "~/components/display/CustomModal";
import ComboBox from "~/components/formInputs/ComboBox";
import { ArrowLeftIcon, ArrowRightIcon, ClipboardEdit } from "lucide-react";
import LoadingButton from "~/components/buttons/LoadingButton";
import Spinner from "~/components/LoadingSpinner";
import SearchBar from "~/components/formInputs/SearchBar";
import { enUS } from "date-fns/locale";
import { redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { getUser } from "~/utils/auth.server";
import { createListFromTemplate } from "~/utils/prepList.server";
import NewAppBar from "~/components/navigation/NewAppBar";
import FadeIn from "~/components/animations/FadeIn";
import PrepPage from "./components/PrepPage";

const formatRelativeLocale = {
  lastWeek: "'Last' eeee",
  yesterday: "'Yesterday'",
  today: "'Today'",
  tomorrow: "'Tomorrow'",
  nextWeek: "'This' eeee",
  other: "MM/dd/yyyy",
};

const locale = {
  ...enUS,
  // @ts-ignore
  formatRelative: (token) => formatRelativeLocale[token],
};

function PrepListsRoute() {
  const { prepLists, setOpenDialog, handleDateChange, date } = usePrepLists();

  const navigate = useNavigate();
  const navigation = useNavigation();

  const pageChangeLoading =
    navigation.state === "loading" &&
    navigation.location.pathname !== "/app/prep";

  if (navigation.state === "loading" && pageChangeLoading) {
    return (
      <div className=" mx-auto h-screen  flex items-center justify-center">
        <Spinner size={14} />
      </div>
    );
  }
  return (
    <>
      <div className=" h-screen w-full  items-center justify-center text-2xl text-zinc-800 dark:text-zinc-200 hidden xl:flex ">
        <h1>Select A List</h1>
      </div>
      <div className=" container mx-auto max-w-4xl xl:hidden">
        <PrepPage
          date={date}
          handleDateChange={handleDateChange}
          pageChangeLoading={pageChangeLoading}
          prepLists={prepLists}
          setOpenDialog={setOpenDialog}
        />
      </div>
    </>
  );
}

export default PrepListsRoute;
