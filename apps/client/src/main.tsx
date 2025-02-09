import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { proxy } from "@/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Provider as JotaiProvider } from "jotai/react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "unfonts.css";
import "./assets/styles/index.css";
import { routeTree } from "./routeTree.gen";
import { ErrorBoundary } from "./routes/__root";
import store from "./store";

/**
 * Register the router instance for type safety
 */
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

/**
 * Query client setup
 * This also lives inside the router context
 * so we can access it in loader methods too.
 */
const queryClient = new QueryClient();

/**
 * Router setup and context
 */
const router = createRouter({
  routeTree,
  context: {
    proxy, // rpc proxy client
    store, // jotai store
    query: queryClient, // query client
  },
  defaultNotFoundComponent: () => <ErrorBoundary />,
});

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <JotaiProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <TooltipProvider>
              <HelmetProvider>
                <RouterProvider router={router} />
              </HelmetProvider>
              <Toaster closeButton />
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </JotaiProvider>
    </StrictMode>,
  );
}
