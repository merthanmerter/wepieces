import { cn } from "@/lib/utils";
import { SearchIcon, XIcon } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";

export default function SearchInput(props: React.ComponentProps<typeof Input>) {
  return (
    <div
      className={cn(
        "w-full relative flex h-9 w-full rounded-md border border-input bg-transparent py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        props.className,
      )}>
      <input
        name={props.name ?? "search"}
        {...props}
        id='search'
        type='text'
        autoComplete='off'
        aria-autocomplete='none'
        aria-label='Search'
        className='peer pl-8 pr-6 w-full bg-transparent outline-none border-none ring-0'
      />
      <SearchIcon className='absolute left-1.5 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground peer-focus:text-foreground' />
      {props.value && (
        <button
          type='button'
          onClick={() =>
            props?.onChange?.({
              target: {
                value: "",
              },
            } as React.ChangeEvent<HTMLInputElement>)
          }
          className='absolute right-1.5 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground peer-focus:text-foreground'>
          <XIcon className='size-4' />
        </button>
      )}
    </div>
  );
}
