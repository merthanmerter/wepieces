import ErrorBoundary from "@/components/error-boundary";
import Helmet from "@/components/helmet";
import { JotaiStore } from "@/store";
import { type TRPCProxyClient } from "@/trpc";
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import React from "react";

export type RootContext = {
  proxy: TRPCProxyClient;
  store: JotaiStore;
  query: QueryClient;
};

export const Route = createRootRouteWithContext<RootContext>()({
  component: Root,
  errorComponent: (props) => <ErrorBoundary {...props} />,
  notFoundComponent: (props) => <ErrorBoundary {...props} />,
});

export default function Root() {
  return (
    <React.Fragment>
      <Helmet />
      <div className='flex flex-col w-full relative overflow-hidden'>
        <Outlet />
      </div>
    </React.Fragment>
  );
}

export { ErrorBoundary };
