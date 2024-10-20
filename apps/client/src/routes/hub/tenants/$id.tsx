import TenantsForm from "@/components/forms/tenants";
import DangerZone from "@/components/shared/danger-zone";
import HorizontalScrollArea from "@/components/shared/horizontal-scroll-area";
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

export const Route = createFileRoute("/hub/tenants/$id")({
  component: Page,
  loader: ({ context, params: { id } }) =>
    context.proxy.tenants.find.query({ id }),
});

function Page() {
  const data = useLoaderData({ from: "/hub/tenants/$id" });
  const context = useRootContext();

  const deleteFn = async () => {
    context.proxy.tenants.delete.mutate({ id: data.id });
  };

  const rows = [
    {
      name: "Name",
      value: data.name,
      description: "Name of the tenant",
    },
  ];

  return (
    <React.Fragment>
      <div className='flex mb-4 items-center justify-between gap-2 h-8'>
        <h1 className='font-bold text-xl'>Tenant: {data.name}</h1>
        <div className='ml-auto space-x-2 h-8'>
          <TenantsForm initialValues={data} />
        </div>
      </div>
      <div className='grid lg:grid-cols-2 gap-4 items-start lg:grid-cols-[2.5fr_1fr]'>
        <HorizontalScrollArea>
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
        <div className='space-y-3'>
          <div className='border rounded-md text-sm overflow-hidden'>
            <div className='bg-muted px-3 py-2.5 border-b'>Status</div>
            <div className='space-x-2 p-3'>
              <Badge className='capitalize'>{data.status}</Badge>
            </div>
          </div>
          <DangerZone mutationFn={deleteFn} />
        </div>
      </div>
    </React.Fragment>
  );
}
