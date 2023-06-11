import { useState } from "react";
import type { FC } from "react";
import NewAppBar from "~/components/navigation/NewAppBar";
import FadeIn from "~/components/animations/FadeIn";

import { ArrowLeftIcon, ArrowRightIcon, ClipboardEdit } from "lucide-react";
import formatRelative from "date-fns/formatRelative";
import { enUS } from "date-fns/locale";
import { add, format, isSameDay } from "date-fns";
import { useLocation, useNavigation } from "@remix-run/react";
import Spinner from "~/components/LoadingSpinner";
import ListCard from "~/components/display/ListCard";
import type { getPrepLists } from "~/utils/prepList.server";
import PrepCalendar from "./PrepCalendar";
import IconButton from "~/components/buttons/IconButton";
interface Props {
  date: Date | undefined;
  handleDateChange: (date: Date) => void;
  prepLists: Awaited<ReturnType<typeof getPrepLists>>;
  pageChangeLoading: boolean;
  setOpenDialog: (open: boolean) => void;
}

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

const PrepPage: FC<Props> = ({
  date,
  handleDateChange,
  prepLists,
  pageChangeLoading,
  setOpenDialog,
}) => {
  const location = useLocation();
  const navigation = useNavigation();
  const [activeId, setActiveId] = useState(location.pathname.split("/")[3]);

  const prepListsToday =
    prepLists && prepLists.length > 0
      ? prepLists.filter((prepList) =>
          isSameDay(new Date(prepList.date), date!)
        )
      : null;
  return (
    <>
      <NewAppBar page="Prep">
        <div>
          <PrepCalendar date={date} handleDateChange={handleDateChange} />
        </div>

        <IconButton
          Icon={ClipboardEdit}
          name="Add"
          type="button"
          onClick={() => setOpenDialog(true)}
        />
      </NewAppBar>
      <FadeIn>
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex w-full items-center justify-between bg-zinc-200 rounded-full border h-12 border-zinc-300  dark:bg-zinc-800 dark:bg-opacity-50 dark:border-zinc-700 overflow-hidden">
            <button
              onClick={() => date && handleDateChange(add(date, { days: -1 }))}
              className="h-12 w-12 hover:text-zinc-600 hover:bg-opacity-70 text-zinc-700 dark:hover:text-zinc-400 dark:text-zinc-200 flex items-center justify-center dark:border-zinc-700 border-zinc-300 rounded-full bg-zinc-300 bg-opacity-40 dark:bg-zinc-800 dark:bg-opacity-40"
            >
              <ArrowLeftIcon className="w-6 h-6 " />
            </button>
            <span
              className={`text-xl  text-zinc-700 dark:text-zinc-100 font-normal flex items-center justify-center text-center `}
            >
              {date &&
                formatRelative(date, new Date(), { locale, weekStartsOn: 6 })}
            </span>
            <button
              onClick={() => date && handleDateChange(add(date, { days: 1 }))}
              className="h-12 w-12 hover:text-zinc-600 hover:bg-opacity-70 text-zinc-700 dark:text-zinc-300 flex items-center justify-center dark:border-zinc-700 border-zinc-300 rounded-full bg-zinc-300 bg-opacity-40 dark:bg-zinc-800 dark:bg-opacity-40"
            >
              <ArrowRightIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="grid z-0 relative grid-flow-row  auto-rows-max gap-y-2  mx-auto mb-28 w-full ">
            {navigation.state === "loading" && !pageChangeLoading ? (
              <div className="flex justify-center mt-4 ">
                <Spinner size={14} />
              </div>
            ) : (
              <div className="flex flex-col gap-3  w-full">
                <FadeIn>
                  <div className="grid z-0 relative grid-flow-row  auto-rows-max gap-y-2  mx-auto mb-28 w-full ">
                    {prepListsToday && prepListsToday.length > 0 ? (
                      prepListsToday.map((pl) => (
                        <div key={pl.id} onClick={() => setActiveId(pl.id)}>
                          <ListCard
                            key={pl.id}
                            to={pl.id}
                            active={activeId === pl.id}
                            name={pl.name}
                            subHeading={`Created: ${format(
                              new Date(pl.createdAt),
                              "PP"
                            )}`}
                            user="MH"
                          />
                        </div>
                      ))
                    ) : (
                      <h2 className="text-2xl text-zinc-700 dark:text-zinc-100 font-light text-center">
                        Nothing Found
                      </h2>
                    )}
                  </div>
                </FadeIn>
              </div>
            )}
          </div>
        </div>
      </FadeIn>
    </>
  );
};

export default PrepPage;