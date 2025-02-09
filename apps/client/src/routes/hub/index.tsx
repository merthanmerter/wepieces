import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRootContext } from "@/hooks/use-root-context";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { UsersRoundIcon } from "lucide-react";
import React from "react";

export const Route = createFileRoute("/hub/")({
  component: Page,
});

export default function Page() {
  return (
    <React.Fragment>
      <h1 className='font-bold text-xl mb-4'>Hub Dashboard</h1>
      <div className='grid lg:grid-cols-[3fr_1fr] gap-4 items-start'>
        <div>Welcome.</div>
        <ActiveUsersComponent />
      </div>
    </React.Fragment>
  );
}

function ActiveUsersComponent() {
  const context = useRootContext();
  const { data, status } = useQuery({
    queryKey: ["users"],
    queryFn: () => context.proxy.users.activeUsers.query(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <UsersRoundIcon className='size-5' /> Active Users
        </CardTitle>
        <CardDescription>List of active users in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className='flex flex-col gap-2'>
          {status === "success" ? (
            data.map((user) => (
              <li
                key={user.id}
                className='flex items-center gap-2'>
                <div className='bg-green-500 rounded-full size-3 animate-pulse' />
                <span className='leading-none text-sm font-medium'>
                  {user.username}
                </span>
              </li>
            ))
          ) : (
            <div className='flex flex-col gap-2'>
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  className='flex items-center gap-2'
                  key={idx}>
                  <Skeleton className='size-3 rounded-full' />
                  <Skeleton className='h-3 w-32 rounded-md' />
                </div>
              ))}
            </div>
          )}
        </ul>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        {status === "success" && data?.length > 0 ? (
          <>
            Total {data?.length} active {data.length > 1 ? "users" : "user"}
          </>
        ) : (
          <Skeleton className='h-3 w-32 rounded-md' />
        )}
      </CardFooter>
    </Card>
  );
}
