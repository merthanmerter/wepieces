import DataTable from "@/components/base/data-table";
import UsersForm from "@/components/shared/users-form";
import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";
import { EllipsisIcon } from "lucide-react";

export const Route = createFileRoute("/hub/_root/users")({
  loaderDeps: ({ search }) => search,
  component: Page,
  loader: ({ context, deps: params }) => context.proxy.users.list.query(params),
});

function Page() {
  const data = useLoaderData({ from: "/hub/_root/users" });

  return (
    <DataTable
      title={<h1 className='font-bold text-xl'>Users</h1>}
      nav={<UsersForm />}
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
            <Link to={`/hub/users/${row.original.id}`}>
              <EllipsisIcon className='h-4 w-4 cursor-pointer' />
            </Link>
          ),
        },
        {
          accessorKey: "username",
          header: "Username",
          meta: {
            type: "text",
            name: "username",
            placeholder: "Username",
            sortable: true,
          },
        },
        {
          accessorKey: "email",
          header: "Email",
          meta: {
            type: "text",
            name: "email",
            placeholder: "Email",
            sortable: true,
          },
        },
        {
          accessorKey: "role",
          header: "Role",
          meta: {
            type: "text",
            name: "role",
            placeholder: "Role",
            sortable: true,
          },
        },
      ]}
    />
  );
}
