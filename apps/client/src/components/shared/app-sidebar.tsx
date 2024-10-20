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
import { HomeIcon, LucideIcon, RssIcon, UsersRoundIcon } from "lucide-react";
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
    title: "Posts",
    to: "/hub/posts",
    icon: RssIcon,
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
              <SidebarSeparator className='px-0 mx-0' />
              {sidebar.state === "expanded" && (
                <SearchInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  name='search'
                  placeholder='Search...'
                  className='bg-muted border-0'
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
                    name={item.title}
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
}

function Item({ item, name }: { item: SidebarItem; name: string }) {
  const location = useLocation();

  const path = location.pathname.split("/").filter(Boolean);

  const isActive =
    path.length === 1
      ? path[0]?.endsWith(name?.toLowerCase())
      : path[1]?.endsWith(name?.toLowerCase());

  return (
    <Link
      activeOptions={{ exact: true }}
      to={item.to}>
      {(props) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            tooltip={item.title}
            asChild>
            <span className={cn((props.isActive || isActive) && "bg-muted")}>
              <item.icon />
              {item.title}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </Link>
  );
}
