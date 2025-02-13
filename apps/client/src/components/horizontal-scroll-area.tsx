import { cn } from "@/lib/utils";
import React from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export default function HorizontalScrollArea({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ScrollArea
      className={cn("w-full rounded-md border whitespace-nowrap", className)}>
      <div className='min-w-fit'>{children}</div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
