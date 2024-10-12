import Navbar from "@/components/base/navbar";
import Sidebar from "@/components/base/sidebar";
import { authAtom } from "@/store/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import React from "react";
import { RootContext } from "./__root";

/**
 * Auth Refresh
 * This is called every time the user navigates between `hub` routes.
 * - Checks if the user is authenticated, and if not, it redirects to the login page.
 * - If revalidate counter is reached, it will revalidate the user data from the database.
 * Don't use this function in root component as it will cause an infinite loop.
 * @see https://github.com/TanStack/router/issues/1295#issuecomment-2005280746
 */
const beforeLoad = async ({ context }: { context: RootContext }) => {
  try {
    // const revalidate = authRevalidateInterval(context); // We pass context since store is already set in root context.
    const response = await context.proxy.auth.refresh.query({
      revalidate: true, // Can be set to `always` true on demand.
    });
    const isAuth = response?.success ? response?.credentials : null;
    context.store.set(authAtom, isAuth);
  } catch (error) {
    context.store.set(authAtom, null);
    throw redirect({ to: "/login" });
  }
};

export const Route = createFileRoute("/hub/_root")({
  component: Root,
  beforeLoad: beforeLoad,
});

export default function Root() {
  return (
    <React.Fragment>
      <Navbar />
      <Sidebar className='w-[250px] border-r fixed top-10 left-0 bottom-0 overflow-hidden z-10 h-[calc(100vh-2.5rem)]' />
      <main className='flex flex-row w-full bg-background overflow-hidden h-[calc(100vh-2.5rem)] z-0'>
        <div className='ml-[250px] w-full overflow-y-scroll scrollbar'>
          <div className='w-full container mx-auto p-6'>
            <Outlet />
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}
