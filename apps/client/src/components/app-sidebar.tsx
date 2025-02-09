import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Link, LinkProps, useLocation } from "@tanstack/react-router";
import { HomeIcon, LucideIcon, UsersRoundIcon } from "lucide-react";
import React from "react";
import { CompanySwitcher } from "./company-switcher";
import { NavUser } from "./nav-user";
import SearchInput from "./search-input";

// Menu items.
const items: SidebarItem[] = [
  {
    title: "Home",
    to: "/hub",
    icon: HomeIcon,
  },
  {
    title: "Users",
    to: "/hub/users",
    icon: UsersRoundIcon,
  },
];

export function AppSidebar() {
  const [search, setSearch] = React.useState("");
  const sidebar = useSidebar();

  return (
    <Sidebar collapsible='icon'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <CompanySwitcher />
              <SidebarSeparator
                className={cn(
                  "px-0 mx-0",
                  sidebar.state === "collapsed" && "mt-1 ",
                )}
              />
              {sidebar.state === "expanded" && (
                <SearchInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  name='search'
                  placeholder='Search pages'
                  className='bg-transparent focus-within:bg-muted border-0'
                />
              )}
              {items
                .filter((item) =>
                  item.title.toLowerCase().includes(search.toLowerCase()),
                )
                .map((item) => (
                  <Item
                    key={item.title}
                    item={item}
                    name={
                      typeof item.to === "string" ? item.to.split("/")[2] : "" // Get the first part of the path
                    }
                  />
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

interface SidebarItem extends LinkProps {
  title: string;
  icon: LucideIcon;
  activeIcon?: LucideIcon;
}

function Item({ item, name }: { item: SidebarItem; name: string }) {
  const { isMobile, toggleSidebar } = useSidebar();
  const location = useLocation();
  const { title, icon: Icon, activeIcon: ActiveIcon, ...rest } = item;
  const path = location.pathname.split("/").filter(Boolean);
  const isSubPathActive =
    path.length === 1
      ? path[0]?.endsWith(name?.toLowerCase())
      : path[1]?.endsWith(name?.toLowerCase());

  return (
    <Link
      activeOptions={{ exact: true }}
      {...rest}>
      {({ isActive }) => (
        <SidebarMenuItem key={title}>
          <SidebarMenuButton
            onClick={() => (isMobile ? toggleSidebar() : null)} // Close the sidebar on mobile
            tooltip={title}
            asChild>
            <span className={cn((isActive || isSubPathActive) && "bg-muted")}>
              {(isActive || isSubPathActive) && ActiveIcon ? (
                <ActiveIcon />
              ) : (
                <Icon />
              )}
              {title}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </Link>
  );
}
