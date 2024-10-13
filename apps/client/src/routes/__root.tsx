import Helmet from "@/components/base/helmet";
import { Button } from "@/components/ui/button";
import { useParentRoute } from "@/hooks";
import { JotaiStore } from "@/store";
import { type TRPCProxyClient } from "@/trpc";
import {
  createRootRouteWithContext,
  ErrorComponentProps,
  Outlet,
} from "@tanstack/react-router";
import { TRPCClientError } from "@trpc/client";
import { AlertTriangleIcon } from "lucide-react";
import React from "react";

export type RootContext = {
  proxy: TRPCProxyClient;
  store: JotaiStore;
};

export const Route = createRootRouteWithContext<RootContext>()({
  component: Root,
  errorComponent: (ctx) => <ErrorBoundary ctx={ctx} />,
  notFoundComponent: () => <ErrorBoundary />,
});

export default function Root() {
  return (
    <React.Fragment>
      <Helmet />
      <div className='flex flex-col w-full relative h-screen overflow-hidden'>
        <Outlet />
      </div>
    </React.Fragment>
  );
}

export const ErrorBoundary = ({ ctx }: { ctx?: ErrorComponentProps }) => {
  const { navigateToParent } = useParentRoute();
  const error =
    ctx?.error ?? "The page you are looking for could not be found.";
  return (
    <div className='grid h-dvh w-full items-center justify-center'>
      <div className='grid place-items-center gap-4'>
        <p className='text-muted-foreground text-2xl uppercase font-bold'>
          {ctx?.error ? <AlertTriangleIcon className='h-8 w-8' /> : "404"}
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
};
