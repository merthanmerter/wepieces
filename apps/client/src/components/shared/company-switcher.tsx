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
import { useAuth, useRootContext } from "@/hooks";
import { SelectTenant } from "@app/server/src/database/schema";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import {
  ChevronsUpDown,
  FactoryIcon,
  Loader2Icon,
  PlusIcon,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";

export function CompanySwitcher() {
  const { isMobile } = useSidebar();

  const { auth } = useAuth();
  const context = useRootContext();
  const router = useRouter();
  const [workspace, setWorkspace] = React.useState(auth?.activeTenant);

  const changeActiveTenant = useMutation({
    mutationFn: async (data: Pick<SelectTenant, "id">) => {
      return await context.proxy.auth.changeActiveTenant.mutate(data);
    },
    onSuccess: async (res) => {
      /**
       * Empty all cached matches since
       * we are changing the active tenant
       * and we don't want to show the stale data.
       * @method invalidate (Invalidates the current route)
       * @method clearCache (Clears the cache for the current route)
       * @method navigate (Navigates to the root route in case of no match e.g. dynamic routes)
       * @see https://github.com/TanStack/router/discussions/2567
       */
      router.invalidate();
      router.clearCache();
      router.clearExpiredCache();
      setWorkspace(res.tenant);
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onSettled: () => {
      router.navigate({ to: "/hub" });
    },
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
                {changeActiveTenant.isPending ? (
                  <Loader2Icon className='size-4 animate-spin' />
                ) : (
                  <FactoryIcon className='size-4' />
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
