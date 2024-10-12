import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";
import { Roles } from "@app/server/src/lib/auth";
import { Link, useLocation } from "@tanstack/react-router";
import {
  FolderIcon,
  FolderOpenIcon,
  RefreshCcw,
  ShieldIcon,
  ShieldPlusIcon,
  UserIcon,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import LogoutDialog from "./logout-dialog";

export default function Sidebar({ className }: { className?: string }) {
  const { auth, refresh } = useAuth();

  return (
    <aside className={className}>
      <nav className='w-full h-full flex flex-col items-center justify-between px-3 pt-6 pb-3'>
        <div className='w-full'>
          <Link
            activeOptions={{ exact: true }}
            to='/hub'>
            {(props) => (
              <Item
                name='hub'
                isActive={props.isActive}>
                Home
              </Item>
            )}
          </Link>
          <Link to='/hub/users'>
            {(props) => (
              <Item
                name='users'
                isActive={props.isActive}>
                Users
              </Item>
            )}
          </Link>
        </div>
        <div className='mt-auto text-xs w-full flex items-center w-full'>
          <Link
            to='/login'
            className='inline-flex items-center  border-l border-t border-b h-8 w-full rounded-l-lg gap-2 hover:bg-muted transition-colors'>
            {auth?.username ? (
              <div className='flex items-center gap-2 h-full px-2'>
                <RoleIcon role={auth.role}></RoleIcon>
                <span className='text-muted-foreground'>{auth?.username}</span>
              </div>
            ) : (
              <React.Fragment>
                <Skeleton className='h-4 w-4 rounded-full' />
                <Skeleton className='h-3 w-20 rounded-full' />
              </React.Fragment>
            )}
          </Link>
          <button
            onClick={() => refresh.mutate()}
            className='inline-flex items-center justify-center border-l border-t border-b h-8 w-12 hover:bg-muted transition-colors group'>
            <RefreshCcw className='h-4 w-4 group-hover:animate-spin' />
          </button>
          <LogoutDialog />
        </div>
      </nav>
    </aside>
  );
}

function Item({
  children,
  name,
}: {
  isActive: boolean;
  children: React.ReactNode;
  name: string;
}) {
  const location = useLocation();

  const path = location.pathname.split("/").filter(Boolean);

  const isActive =
    path.length === 1
      ? path[0]?.endsWith(name?.toLowerCase())
      : path[1]?.endsWith(name?.toLowerCase());

  return (
    <Button
      size='sm'
      variant={isActive ? "default" : "ghost"}
      className={cn(
        "w-full justify-start text-muted-foreground text-sm my-0.5 font-normal flex items-center gap-2 font-mono",
        // isActive &&
        // "text-foreground bg-gradient-to-r from-red-500 via-purple-500 to-blue-500",
      )}>
      {isActive ? (
        <FolderOpenIcon className='h-4 w-4' />
      ) : (
        <FolderIcon className='h-4 w-4' />
      )}
      <span className='block'>{children}</span>
    </Button>
  );
}

function RoleIcon({ role }: { role: Roles }) {
  if (role === "user")
    return <UserIcon className='h-4 w-4 text-muted-foreground' />;
  if (role === "admin")
    return <ShieldIcon className='h-4 w-4 text-muted-foreground' />;
  if (role === "superadmin")
    return <ShieldPlusIcon className='h-4 w-4 text-muted-foreground' />;
}
