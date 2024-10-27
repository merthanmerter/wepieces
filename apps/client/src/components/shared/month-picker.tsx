import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  add,
  eachMonthOfInterval,
  endOfYear,
  format,
  isEqual,
  isFuture,
  parse,
  startOfMonth,
  startOfToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

function getStartOfCurrentMonth() {
  return startOfMonth(startOfToday());
}

interface MonthPickerProps {
  currentMonth: Date;
  onMonthChange: (newMonth: Date) => void;
  children?: React.ReactNode;
  onClear?: () => void;
}

export default function MonthPicker({
  currentMonth,
  onMonthChange,
  onClear,
  children,
}: MonthPickerProps) {
  const [currentYear, setCurrentYear] = React.useState(
    format(currentMonth, "yyyy"),
  );
  const firstDayCurrentYear = parse(currentYear, "yyyy", new Date());

  const months = eachMonthOfInterval({
    start: firstDayCurrentYear,
    end: endOfYear(firstDayCurrentYear),
  });

  function previousYear() {
    const firstDayNextYear = add(firstDayCurrentYear, { years: -1 });
    setCurrentYear(format(firstDayNextYear, "yyyy"));
  }

  function nextYear() {
    const firstDayNextYear = add(firstDayCurrentYear, { years: 1 });
    setCurrentYear(format(firstDayNextYear, "yyyy"));
  }

  const [open, setOpen] = React.useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size='sm'
          variant='outline'>
          {children ?? format(currentMonth, "MMMM yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-fit'>
        <div className='space-y-4'>
          <div className='relative flex items-center justify-center pt-1'>
            <div
              className='text-sm font-medium'
              aria-live='polite'
              role='presentation'
              id='month-picker'>
              {format(firstDayCurrentYear, "yyyy")}
            </div>
            <div className='flex items-center space-x-1'>
              <button
                name='previous-year'
                aria-label='Go to previous year'
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                  "absolute left-1",
                )}
                type='button'
                onClick={previousYear}>
                <ChevronLeft className='h-4 w-4' />
              </button>
              <button
                name='next-year'
                aria-label='Go to next year'
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                  "absolute right-1 disabled:bg-background",
                )}
                type='button'
                disabled={isFuture(add(firstDayCurrentYear, { years: 1 }))}
                onClick={nextYear}>
                <ChevronRight className='h-4 w-4' />
              </button>
            </div>
          </div>
          <div
            className='grid w-full grid-cols-3 gap-2'
            role='grid'
            aria-labelledby='month-picker'>
            {months.map((month) => (
              <div
                key={month.toString()}
                className='relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-muted first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md dark:[&:has([aria-selected])]:bg-foreground'
                role='presentation'>
                <button
                  name='day'
                  className={cn(
                    "inline-flex h-9 w-16 items-center justify-center rounded-md p-0 text-sm font-normal ring-offset-white transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-foreground focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-selected:opacity-100 dark:ring-offset-foreground dark:hover:bg-foreground dark:hover:text-background dark:focus-visible:ring-muted-foreground",
                    isEqual(month, currentMonth) &&
                      "bg-foreground text-background hover:bg-foreground hover:text-background focus:bg-foreground focus:text-background dark:bg-muted dark:text-foreground dark:hover:bg-muted dark:hover:text-foreground dark:focus:bg-muted dark:focus:text-foreground",
                    !isEqual(month, currentMonth) &&
                      isEqual(month, getStartOfCurrentMonth()) &&
                      "bg-muted text-foreground dark:bg-foreground dark:text-background",
                  )}
                  disabled={isFuture(month)}
                  role='gridcell'
                  tabIndex={-1}
                  type='button'
                  onClick={() => {
                    onMonthChange(month);
                    setOpen(false);
                  }}>
                  <time dateTime={format(month, "yyyy-MM-dd")}>
                    {format(month, "MMM")}
                  </time>
                </button>
              </div>
            ))}
          </div>
          {onClear && (
            <div className='flex items-center justify-center space-x-2'>
              <Button
                className='w-full'
                variant='outline'
                size='sm'
                onClick={() => {
                  onClear();
                  setOpen(false);
                }}>
                Clear Date
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
