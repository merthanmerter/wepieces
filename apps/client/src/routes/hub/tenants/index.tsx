// import TenantsForm from '@/components/forms/tenants'
import TenantsForm from "@/components/forms/tenants";
import DataTable from "@/components/shared/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRootContext } from "@/hooks";
import { MESSAGES } from "@app/server/src/constants";
import { useMutation } from "@tanstack/react-query";
import {
  createFileRoute,
  useLoaderData,
  useRouter,
} from "@tanstack/react-router";
import { EllipsisIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/hub/tenants/")({
  loaderDeps: ({ search }) => search,
  component: Page,
  loader: ({ context, deps: params }) =>
    context.proxy.tenants.list.query(params),
});

function Page() {
  const data = useLoaderData({ from: "/hub/tenants/" });

  const context = useRootContext();
  const router = useRouter();

  const [edit, setEdit] = React.useState<string | boolean>(false);
  const [remove, setRemove] = React.useState<string | boolean>(false);

  const deleteFn = useMutation({
    mutationFn: async (id: string) => {
      return await context.proxy.tenants.delete.mutate({ id });
    },
    onSuccess: async () => {
      setRemove(false);
      toast.success(MESSAGES.success);
      router.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

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
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className='my-auto'>
                  <EllipsisIcon className='size-4' />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{row.original.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setEdit(row.original.id)}>
                    <SquarePenIcon />
                    Update
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRemove(row.original.id)}>
                    <Trash2Icon />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <TenantsForm
                open={edit === row.original.id}
                onOpenChange={(open) => setEdit(open)}
                initialValues={row.original}
              />

              <AlertDialog
                open={remove === row.original.id}
                onOpenChange={() => setRemove(false)}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will delete the tenant and all its data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      disabled={deleteFn.isPending}
                      onClick={() => deleteFn.mutate(row.original.id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
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
