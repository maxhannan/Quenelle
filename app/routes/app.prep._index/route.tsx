import React, { useState } from "react";
import { usePrepLists } from "../app.prep/route";
import { Calendar } from "~/components/ui/calendar";
import { useNavigate, useNavigation, useSearchParams } from "@remix-run/react";
import { format, isSameDay } from "date-fns";
import PrepListSummary from "./components/PrepListSummary";
import PrepCalendar from "./components/PrepCalendar";
import ListCard from "~/components/display/ListCard";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import IconButton from "~/components/buttons/IconButton";
import CustomModal from "~/components/display/CustomModal";
import ComboBox from "~/components/formInputs/ComboBox";
import { ArrowRightIcon } from "lucide-react";
import LoadingButton from "~/components/buttons/LoadingButton";
import Spinner from "~/components/LoadingSpinner";
import SearchBar from "~/components/formInputs/SearchBar";

function PrepListsRoute() {
  const prepLists = usePrepLists();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const [date, setDate] = useState<Date | undefined>(
    new Date(searchParams.get("date") ?? Date.now())
  );
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

  return (
    <div className=" container mx-auto max-w-4xl">
      <nav className=" flex pt-3 pb-1 mx-auto max-h-full items-center justify-between  duration-300 bg-zinc-100 dark:bg-zinc-900 font-light  w-full top-0 left-0  ">
        <h1 className={`text-4xl mr-6 text-zinc-800 dark:text-zinc-100`}>
          Prep
        </h1>
        <div className="grow flex justify-end gap-2">
          <PrepCalendar date={date} handleDateChange={handleDateChange} />
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
            <div className="w-full flex gap-2  ">
              <div className="grow">
                <ComboBox
                  name="Template"
                  options={[
                    { id: "1", value: "PM Grill" },
                    { id: "1", value: "PM Grill" },
                    { id: "1", value: "PM Grill" },
                    { id: "1", value: "PM Grill" },
                    { id: "1", value: "PM Grill" },
                    { id: "1", value: "PM Grill" },
                    { id: "1", value: "PM Grill" },
                    { id: "1", value: "PM Grill" },
                  ]}
                  placeholder="Template"
                />
              </div>
              <div className="flex-none">
                <IconButton
                  Icon={ArrowRightIcon}
                  name="create"
                  onClick={() => console.log("hello")}
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
                  buttonText="Create Custom List"
                  Icon={ArrowRightIcon}
                  action={() => setOpenDialog(true)}
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
        />
        <div className="grid z-0 relative grid-flow-row  auto-rows-max gap-y-2  mx-auto mb-28 w-full ">
          {navigation.state === "loading" ? (
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
