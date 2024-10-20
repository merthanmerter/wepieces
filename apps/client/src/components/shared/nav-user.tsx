import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks";
import { Link } from "@tanstack/react-router";
import {
  ChevronsUpDown,
  LogOut,
  MoonIcon,
  SunIcon,
  SunMoonIcon,
  UserRoundIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import LogoutDialog from "./logout-dialog";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { auth } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isLogoutDialogOpen, setLogOutDialogOpen] = React.useState(false);

  if (!auth) return null;

  return (
    <React.Fragment>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarFallback className='rounded-lg bg-foreground/10'>
                    {auth.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>
                    {auth.username}
                  </span>
                  <span className='truncate text-xs'>{auth.role}</span>
                </div>
                <ChevronsUpDown className='ml-auto size-4' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
              side={isMobile ? "bottom" : "right"}
              align='end'
              sideOffset={4}>
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarFallback className='rounded-lg'>
                      {auth.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      {auth.username}
                    </span>
                    <span className='truncate text-xs'>{auth.role}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to='/me'>
                <DropdownMenuItem>
                  <UserRoundIcon />
                  Account
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0'>
                  {theme === "system" ? (
                    <SunMoonIcon className='size-4' />
                  ) : theme === "light" ? (
                    <SunIcon className='size-4' />
                  ) : (
                    <MoonIcon className='size-4' />
                  )}
                  Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className='my-1.5'>
                    <DropdownMenuCheckboxItem
                      checked={theme === "system"}
                      onCheckedChange={(checked) =>
                        checked && setTheme("system")
                      }>
                      System
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={theme === "light"}
                      onCheckedChange={(checked) =>
                        checked && setTheme("light")
                      }>
                      Light
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={theme === "dark"}
                      onCheckedChange={(checked) =>
                        checked && setTheme("dark")
                      }>
                      Dark
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setLogOutDialogOpen((prev) => !prev)}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <LogoutDialog
        open={isLogoutDialogOpen}
        onOpenChange={(open) => setLogOutDialogOpen(open)}
      />
    </React.Fragment>
  );
}
