import { Transition, Dialog } from "@headlessui/react";
import { format, formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { CalendarCheck2 } from "lucide-react";
import React from "react";
import { useState } from "react";
import type { FC } from "react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";

import { cn } from "~/lib/utils";
interface Props {
  date: Date | undefined;
  handleDateChange: (date: Date) => void;
  size?: number;
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
const PrepCalendar: FC<Props> = ({ date, handleDateChange, size }) => {
  const [isOpen, setIsOpen] = useState(false);

  const changeHandler = (date: Date | undefined) => {
    if (date) {
      handleDateChange(date);
      setIsOpen(false);
    }
  };
  return (
    <>
      <Button
        variant={"outline"}
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          ` justify-start text-left text-lg w-full  font-light pl-3 pr-4 dark:border-zinc-800  border-zinc-300  h-${
            size ?? 10
          } rounded-xl  text-zinc-700 hover:bg-zinc-200 hover:dark:bg-zinc-700 dark:text-zinc-200 bg-opacity-50 dark:bg-opacity-50 hover:dark:text-zinc-200 max-w-sm bg-zinc-200 dark:bg-zinc-800`,
          !date && "text-muted-foreground"
        )}
      >
        <CalendarCheck2 className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
        {date ? (
          formatRelative(date, new Date(), { locale, weekStartsOn: 6 })
        ) : (
          <span>Pick a date</span>
        )}
      </Button>
      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50 h-screen"
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black/90 h-screen"
              aria-hidden="true"
            />
          </Transition.Child>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className=" max-w-xl bg-transparent">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={changeHandler}
                  initialFocus
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default PrepCalendar;
