
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

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
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "hidden", // Hide the default caption label that shows month and year together
        caption_dropdowns: "flex justify-center gap-1 items-center", // Better spacing for dropdowns
        dropdown: "appearance-none bg-white border rounded-md px-3 py-1 text-base focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary", // Improved dropdown styling
        dropdown_month: "mr-1", // Add spacing between month dropdown and year dropdown 
        dropdown_year: "ml-1", // Add spacing between dropdowns
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-9 w-9 bg-transparent p-0 opacity-70 hover:opacity-100" // Larger buttons and improved visibility
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-10 font-medium text-[0.9rem]", // Increased size
        row: "flex w-full mt-2",
        cell: "h-10 w-10 text-center text-base p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20", // Increased size for better tap targets
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal text-base aria-selected:opacity-100" // Larger text for better readability
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground font-bold", // Made today's date bolder
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-5 w-5" />, // Larger navigation icons
        IconRight: ({ ..._props }) => <ChevronRight className="h-5 w-5" />, // Larger navigation icons
        Dropdown: ({ value, onChange, children, ...props }) => {
          // Custom dropdown styling to ensure clear separation
          return (
            <select
              value={value}
              onChange={onChange}
              className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1 text-base focus:outline-none focus:ring-1 focus:ring-primary"
              {...props}
            >
              {children}
            </select>
          );
        }
      }}
      captionLayout="dropdown-buttons"
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
