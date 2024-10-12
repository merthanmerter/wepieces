import "@/assets/styles/progress.css";
import { proxy } from "@/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Provider } from "jotai/react";
import nprogress from "nprogress";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "unfonts.css";
import "./assets/styles/index.css";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { routeTree } from "./routeTree.gen";
import { ErrorBoundary } from "./routes/__root";
import store from "./store";

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Query client setup
const queryClient = new QueryClient();

// Router setup and context
const router = createRouter({
  routeTree,
  context: { proxy, store },
  defaultNotFoundComponent: () => <ErrorBoundary />,
});

// Router subscriptions for nprogress
router.subscribe("onBeforeLoad", ({ pathChanged }) => {
  if (pathChanged) nprogress.start();
  return pathChanged;
});
router.subscribe("onLoad", () => nprogress.done());

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <RouterProvider router={router} />
            <Toaster closeButton />
          </TooltipProvider>
        </QueryClientProvider>
      </Provider>
    </StrictMode>,
  );
}
