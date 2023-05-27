import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "~/lib/utils";
import { buttonVariants } from "~/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-3 w-full max-w-full dark:bg-zinc-900 bg-zinc-100 rounded-lg border dark:border-zinc-700 border-zinc-200 flex items-center justify-center h-auto ",
        className
      )}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center ",
        caption_label: "text-lg font-medium dark:text-zinc-200 text-zinc-700",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-9 w-9 hover:bg-indigo-500 p-0 opacity-50 hover:opacity-100 dark:text-zinc-200 text-zinc-700"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: " border-collapse space-y-1 ",
        head_row: "flex w-full  justify-between px-1 ",
        head_cell:
          "dark:text-zinc-400 text-zinc-700 rounded-md w-9 font-normal text-lg ",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative bg-transparent rounded-md [&:has([aria-selected])]:bg-transparent focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-[46px] w-[46px] font-normal aria-selected:opacity-100 dark:text-zinc-200 text-zinc-800 text-lg rounded-lg hover:bg-indigo-500 hover:dark:bg-indigo-500  "
        ),
        day_selected:
          "bg-indigo-500 dark:bg-indigo-500 text-primary-foreground hover:bg-indigo-500 hover:dark:bg-indigo-500 hover:text-primary-foreground focus:dark:bg-indigo-500 focus:indigo-500 focus:text-primary-foreground",
        day_today: "bg-zinc-200 dark:bg-zinc-700 text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
