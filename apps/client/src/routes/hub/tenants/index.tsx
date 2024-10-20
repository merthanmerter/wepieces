// import TenantsForm from '@/components/forms/tenants'
import TenantsForm from "@/components/forms/tenants";
import DataTable from "@/components/shared/data-table";
import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";
import { ArrowUpRightIcon } from "lucide-react";

export const Route = createFileRoute("/hub/tenants/")({
  loaderDeps: ({ search }) => search,
  component: Page,
  loader: ({ context, deps: params }) =>
    context.proxy.tenants.list.query(params),
});

function Page() {
  const data = useLoaderData({ from: "/hub/tenants/" });

  return (
    <DataTable
      title={<h1 className='font-bold text-xl'>Tenants</h1>}
      nav={{ end: <TenantsForm /> }}
      data={data.records}
      meta={data.meta}
      columns={[
        {
          id: "action",
          accessorKey: "id",
          header: "",
          meta: {
            className: "w-10",
          },
          cell: ({ row }) => (
            <Link
              to='/hub/tenants/$id'
              params={{ id: row.original.id }}>
              <ArrowUpRightIcon className='h-4 w-4 cursor-pointer' />
            </Link>
          ),
        },
        {
          accessorKey: "name",
          header: "Name",
          meta: {
            type: "text",
            name: "name",
            placeholder: "Name",
            sortable: true,
          },
        },
        {
          accessorKey: "status",
          header: "Status",
          meta: {
            type: "select",
            name: "status",
            placeholder: "Status",
            options: [
              { value: "active", label: "Active" },
              { value: "passive", label: "Passive" },
            ],
          },
        },
      ]}
    />
  );
}
