import TransitionProvider from "@/components/providers/transition-provider";
import { AppSidebar } from "@/components/shared/app-sidebar";
import Breadcrumbs from "@/components/shared/breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { authAtom } from "@/store/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { RootContext } from "./__root";

/**
 * Auth Refresh
 * This is called every time the user navigates between `hub` routes.
 * - Checks if the user is authenticated, and if not, it redirects to the login page.
 * Don't use this function in root component as it will cause an infinite loop.
 * @see https://github.com/TanStack/router/issues/1295#issuecomment-2005280746
 */
const beforeLoad = async ({ context }: { context: RootContext }) => {
  try {
    const res = await context.proxy.auth.refresh.mutate();
    const isAuth = res?.success ? res?.credentials : null;
    context.store.set(authAtom, isAuth);
  } catch (error) {
    context.store.set(authAtom, null);
    throw redirect({ to: "/login" });
  }
};

export const Route = createFileRoute("/hub")({
  component: Root,
  beforeLoad,
});

export default function Root() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <header className='flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator
              orientation='vertical'
              className='mr-2 h-4'
            />
            <Breadcrumbs />
          </div>
        </header>
        <TransitionProvider className='w-full container mx-auto px-3'>
          <Outlet />
        </TransitionProvider>
      </main>
    </SidebarProvider>
  );
}
