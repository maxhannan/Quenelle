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
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import IconButton from "~/components/buttons/IconButton";
import CustomModal from "~/components/display/CustomModal";
import ComboBox from "~/components/formInputs/ComboBox";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import LoadingButton from "~/components/buttons/LoadingButton";
import Spinner from "~/components/LoadingSpinner";
import SearchBar from "~/components/formInputs/SearchBar";
import { enUS } from "date-fns/locale";
import { redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { getUser } from "~/utils/auth.server";
import { createListFromTemplate } from "~/utils/prepList.server";

const formatRelativeLocale = {
  lastWeek: "'Last' eeee",
  yesterday: "'Yesterday'",
  today: "'Today'",
  tomorrow: "'Tomorrow'",
  nextWeek: "'This' eeee",
  other: "dd.MM.yyyy",
};

const locale = {
  ...enUS,
  // @ts-ignore
  formatRelative: (token) => formatRelativeLocale[token],
};

export async function action({ request }: ActionArgs) {
  const form = await request.formData();

  const user = await getUser(request);

  if (user) {
    const savedList = await createListFromTemplate(form, user.id);
    console.log({ savedList });
    if (savedList) {
      return redirect(savedList.id);
    }
  }
  return undefined;
}

function PrepListsRoute() {
  const { prepLists, templates } = usePrepLists();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const [date, setDate] = useState<Date>(
    new Date(searchParams.get("date") ?? Date.now())
  );
  const [templateDate, setTemplateDate] = useState<Date>(date);
  const data = useActionData();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>();
  useEffect(() => {
    if (data !== undefined) {
      navigate(`/app/prep/${data}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (date) {
      setTemplateDate(date);
    }
  }, [date]);

  const [openDialog, setOpenDialog] = useState(false);
  const prepListsToday =
    prepLists && prepLists.length > 0
      ? prepLists.filter((prepList) =>
          isSameDay(new Date(prepList.date), date!)
        )
      : null;

  const handleDateChange = (date: Date) => {
    searchParams.set("date", date.toDateString());
    setSearchParams(searchParams);
    setDate(date);
  };

  const handleTemplateDateChange = (date: Date) => {
    setTemplateDate(date);
  };

  const handleTemplateChange = (
    value: { id: string; value: string } | null
  ) => {
    if (value) {
      setSelectedTemplate(value.id);
    }
  };

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
    <div className=" container mx-auto max-w-4xl">
      <nav className=" flex pt-3 pb-1 mx-auto max-h-full items-center justify-between  duration-300 bg-zinc-100 dark:bg-zinc-900 font-light  w-full top-0 left-0  ">
        <h1 className={`text-4xl mr-6 text-zinc-800 dark:text-zinc-100`}>
          Prep
        </h1>
        <div className="grow flex justify-end gap-2">
          <div>
            <PrepCalendar date={date} handleDateChange={handleDateChange} />
          </div>

          <IconButton
            Icon={DocumentPlusIcon}
            name="Add"
            type="button"
            onClick={() => setOpenDialog(true)}
          />
        </div>
      </nav>
      {navigation.state !== "loading" && (
        <CustomModal isOpen={openDialog} setIsOpen={setOpenDialog}>
          <div className=" p-4 flex flex-col  gap-2">
            <Form method="post">
              <div className="flex gap-2 flex-col">
                <ComboBox
                  name="template"
                  required
                  changeHandler={handleTemplateChange}
                  selectedLinkId={selectedTemplate ?? undefined}
                  options={
                    templates
                      ? templates.map((t) => ({ id: t.id, value: t.name }))
                      : []
                  }
                  placeholder="Template"
                />
                <div className="w-full flex gap-2  ">
                  <div className="grow">
                    <input
                      type="hidden"
                      name="templateDate"
                      value={templateDate.toString()}
                    />
                    <PrepCalendar
                      date={templateDate}
                      handleDateChange={handleTemplateDateChange}
                    />
                  </div>
                  <div className="flex-none">
                    <IconButton
                      Icon={ArrowRightIcon}
                      type="submit"
                      disabled={navigation.state === "submitting"}
                      loading={navigation.state === "submitting"}
                      name="create"
                      onClick={() => console.log("hello")}
                    />
                  </div>
                </div>
              </div>
            </Form>
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-zinc-700"></div>
              <span className="flex-shrink mx-4 text-zinc-400">Or</span>
              <div className="flex-grow border-t border-zinc-700"></div>
            </div>
            <div className="w-full flex flex-col gap-2  ">
              <ComboBox
                name="template"
                required
                changeHandler={handleTemplateChange}
                selectedLinkId={selectedTemplate ?? undefined}
                options={
                  templates
                    ? templates.map((t) => ({ id: t.id, value: t.name }))
                    : []
                }
                placeholder="Template"
              />
              <div className="grow">
                <LoadingButton
                  disabled={navigation.state === "submitting"}
                  buttonText="Edit Template"
                  Icon={ArrowRightIcon}
                  action={() =>
                    selectedTemplate && navigate(`edit/${selectedTemplate}`)
                  }
                  buttonName="Add list"
                />
              </div>
            </div>
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-zinc-700"></div>
              <span className="flex-shrink mx-4 text-zinc-400">Or</span>
              <div className="flex-grow border-t border-zinc-700"></div>
            </div>
            <div className="w-full flex gap-2  ">
              <div className="grow">
                <LoadingButton
                  disabled={navigation.state === "submitting"}
                  buttonText="Create Custom List"
                  Icon={ArrowRightIcon}
                  action={() => navigate("add")}
                  buttonName="Add list"
                />
              </div>
            </div>
          </div>
        </CustomModal>
      )}
      <div className="flex flex-col gap-3 mt-2">
        <SearchBar
          handleChange={() => (e: string) => console.log(e)}
          value={""}
          loading={false}
        />{" "}
        <div className="flex w-full items-center justify-between bg-zinc-200 rounded-xl border border-zinc-300 p-1 dark:bg-zinc-800 dark:bg-opacity-50 dark:border-zinc-700">
          <button
            onClick={() => date && handleDateChange(add(date, { days: -1 }))}
            className="h-9 w-9 border flex items-center justify-center dark:border-zinc-700 border-zinc-300 rounded-xl bg-indigo-500"
          >
            <ArrowLeftIcon className="w-5 h-5 text-zinc-100" />
          </button>
          <span
            className={`text-xl  text-zinc-700 dark:text-zinc-100 font-light flex items-center justify-center text-center`}
          >
            {date &&
              formatRelative(date, new Date(), { locale, weekStartsOn: 6 })}
          </span>
          <button
            onClick={() => date && handleDateChange(add(date, { days: 1 }))}
            className="h-10 w-10 border flex items-center justify-center dark:border-zinc-700 border-zinc-300 rounded-xl bg-indigo-500"
          >
            <ArrowRightIcon className="w-5 h-5 text-zinc-100" />
          </button>
        </div>
        <div className="grid z-0 relative grid-flow-row  auto-rows-max gap-y-2  mx-auto mb-28 w-full ">
          {navigation.state === "loading" && !pageChangeLoading ? (
            <div className="flex justify-center mt-4 ">
              <Spinner size={14} />
            </div>
          ) : (
            <div className="flex flex-col gap-3  w-full">
              <div className="grid z-0 relative grid-flow-row  auto-rows-max gap-y-2  mx-auto mb-28 w-full ">
                {prepListsToday && prepListsToday.length > 0 ? (
                  prepListsToday.map((pl) => (
                    <ListCard
                      key={pl.id}
                      to={pl.id}
                      name={pl.name}
                      subHeading={`Created: ${format(
                        new Date(pl.createdAt),
                        "PP"
                      )}`}
                      user="MH"
                    />
                  ))
                ) : (
                  <h2 className="text-2xl text-zinc-700 dark:text-zinc-100 font-light text-center">
                    Nothing Found
                  </h2>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PrepListsRoute;
