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
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { HomeIcon, LucideIcon, RssIcon, UsersRoundIcon } from "lucide-react";
import { CompanySwitcher } from "./company-switcher";
import { NavUser } from "./nav-user";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/hub",
    icon: HomeIcon,
  },
  {
    title: "Posts",
    url: "/hub/posts",
    icon: RssIcon,
  },
  {
    title: "Users",
    url: "/hub/users",
    icon: UsersRoundIcon,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible='icon'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <CompanySwitcher />
              <SidebarSeparator className='px-0 mx-0 my-1' />
              {items.map((item) => (
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

export type SidebarItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

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
      to={item.url}>
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
