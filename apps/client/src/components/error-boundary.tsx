import { useParentRoute } from "@/hooks/use-parent-route";
import { cn } from "@/lib/utils";
import { ErrorComponentProps } from "@tanstack/react-router";
import { TRPCClientError } from "@trpc/client";
import { AlertTriangleIcon } from "lucide-react";
import { useEffect } from "react";
import { Button } from "./ui/button";

type ErrorBoundaryProps = (ErrorComponentProps | object) & {
  className?: string;
};

export default function ErrorBoundary(props?: ErrorBoundaryProps) {
  const { navigateToParent } = useParentRoute();
  const error =
    props && "error" in props
      ? props?.error
      : "The page you are looking for could not be found.";

  useEffect(() => {
    console.log("Props:", props);
  }, [props]);

  return (
    <div
      className={cn(
        "grid h-dvh w-full items-center justify-center",
        props?.className,
      )}>
      <div className='grid place-items-center gap-4'>
        <p className='text-muted-foreground text-2xl uppercase font-bold'>
          {error ? <AlertTriangleIcon className='h-8 w-8' /> : "404"}
        </p>
        <p className='text-foreground font-medium'>
          {error instanceof TRPCClientError
            ? error.message
            : typeof error === "string"
              ? error
              : JSON.stringify(error)}
        </p>
        <Button
          variant='ghost'
          onClick={() => navigateToParent()}>
          Go Back
        </Button>
      </div>
    </div>
  );
}
