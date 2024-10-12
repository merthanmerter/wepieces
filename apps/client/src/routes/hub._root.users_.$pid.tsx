import HorizontalScrollArea from "@/components/base/horizontal-scroll-area";
import DangerZone from "@/components/shared/danger-zone";
import UsersForm from "@/components/shared/users-form";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { useRootContext } from "@/hooks";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/hub/_root/users/$pid")({
  component: Page,
  loader: ({ context, params: { pid } }) =>
    context.proxy.users.find.query({ id: pid }),
});

function Page() {
  const data = useLoaderData({ from: "/hub/_root/users/$pid" });
  const context = useRootContext();

  const deleteFn = async () => {
    context.proxy.users.delete.mutate({ id: data.id });
  };

  const rows = [
    {
      name: "Username",
      value: data.username,
      description: "Username of the user",
    },
    {
      name: "Email",
      value: data.email,
      description: "Registered email",
    },
    {
      name: "Role",
      value: data.role,
      description: "Granted role",
    },
  ];

  return (
    <React.Fragment>
      <div className='flex mb-4 items-center justify-between gap-2 h-8'>
        <h1 className='font-bold text-xl'>User: {data.username}</h1>
        <div className='ml-auto space-x-2 h-8'>
          <UsersForm initialValues={data} />
        </div>
      </div>
      <div className='grid lg:grid-cols-2 gap-4 items-start lg:grid-cols-[2.5fr_1fr]'>
        <HorizontalScrollArea className='bg-popover'>
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
              {rows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.value}</TableCell>
                  <TableCell>{row.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </HorizontalScrollArea>
        <div className='space-y-4'>
          <div className='border rounded-md text-sm overflow-hidden'>
            <div className='bg-popover p-4 border-b'>
              <b>{data.username}</b> is a member of the following groups
            </div>
            <div className='mt-2 space-x-2 p-4'>
              <Badge className='capitalize'>{data.role}</Badge>
            </div>
          </div>
          <DangerZone mutationFn={deleteFn} />
        </div>
      </div>
    </React.Fragment>
  );
}
