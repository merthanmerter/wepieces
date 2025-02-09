import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAsyncNavigate } from "@/hooks/use-async-navigate";
import { useAuth } from "@/hooks/use-auth";
import { useRootContext } from "@/hooks/use-root-context";
import { SelectTenant } from "@server/database/schema";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ChevronsUpDown,
  Loader2Icon,
  PlusIcon,
  PyramidIcon,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";

export function CompanySwitcher() {
  const { isMobile } = useSidebar();
  const { auth } = useAuth();
  const { proxy } = useRootContext();
  const navigateAsync = useAsyncNavigate();
  // const routerState = useRouterState();
  const [workspace, setWorkspace] = React.useState(auth?.activeTenant);

  const changeActiveTenant = useMutation({
    mutationFn: (data: Pick<SelectTenant, "id">) => {
      return proxy.auth.changeActiveTenant.mutate(data);
    },
    onSuccess: (res) => {
      /**
       * Empty all cached matches since
       * we are changing the active tenant
       * and we don't want to show the stale data.
       * @see https://github.com/TanStack/router/discussions/2567
       */
      navigateAsync.navigate({
        to: "/hub",
        invalidate: false,
        clearCache: {
          before: true,
          after: true,
        },
        callback: () => {
          setWorkspace(res.tenant);
        },
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onSettled: () => {},
  });

  React.useEffect(() => {
    if (!auth) return;
    setWorkspace(auth.activeTenant);
  }, [auth]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                {/* {changeActiveTenant.isPending ||
                navigateAsync.isPending ||
                routerState.isLoading ? (
                  <Loader2Icon className='size-4 animate-spin' />
                ) : (
                  <PyramidIcon className='size-4' />
                )} */}

                {/* <l-quantum
                  size='25'
                  speed={
                    changeActiveTenant.isPending ||
                    navigateAsync.isPending ||
                    routerState.isLoading
                      ? 2
                      : 10
                  }
                  color='white'
                /> */}
                {/* <l-chaotic-orbit
                  size='25'
                  speed={
                    changeActiveTenant.isPending ||
                    navigateAsync.isPending ||
                    routerState.isLoading
                      ? 1.5
                      : 0
                  }
                  color='white'
                /> */}

                {changeActiveTenant.isPending || navigateAsync.isPending ? (
                  <Loader2Icon className='size-4 animate-spin' />
                ) : (
                  <PyramidIcon className='size-4' />
                )}
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold capitalize'>
                  {workspace?.name}
                </span>
                <span className='truncate text-xs'>
                  {auth?.tenants.length} workspace
                </span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}>
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              Companies
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {auth?.tenants.map((tenant) => (
              <DropdownMenuCheckboxItem
                key={tenant.id}
                className='capitalize'
                checked={tenant.id === workspace?.id}
                onCheckedChange={(checked) =>
                  checked &&
                  tenant.id &&
                  changeActiveTenant.mutate({ id: tenant.id })
                }>
                {tenant.name}
              </DropdownMenuCheckboxItem>
            ))}
            {auth?.role === "superadmin" && (
              <>
                <DropdownMenuSeparator />
                <Link to='/hub/tenants'>
                  <DropdownMenuItem>
                    <PlusIcon className='size-4' />
                    <span className='text-muted-foreground'>New tenant</span>
                  </DropdownMenuItem>
                </Link>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
