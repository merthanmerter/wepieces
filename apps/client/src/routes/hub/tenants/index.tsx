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
import { ActionDispatch } from "@/lib/dispatches";
import { tenantQuerySchema } from "@app/server/src/api/routers/tenants/definitions";
import { MESSAGES } from "@app/server/src/constants";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { EllipsisIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/hub/tenants/")({
  validateSearch: zodSearchValidator(tenantQuerySchema),
  loaderDeps: ({ search }) => search,
  loader: ({ context: { proxy }, deps }) => proxy.tenants.list.query(deps),
  component: Page,
});

type Actions = {
  update: string | boolean;
  remove: string | boolean;
};

function Page() {
  const data = Route.useLoaderData();
  const { proxy } = useRootContext();
  const { invalidate } = useRouter();

  const [action, updateAction] = React.useReducer(ActionDispatch<Actions>, {
    update: false,
    remove: false,
  });

  const deleteFn = useMutation({
    mutationFn: (id: string) => {
      return proxy.tenants.delete.mutate({ id });
    },
    onSuccess: () => {
      invalidate();
      updateAction({ remove: false });
      toast.success(MESSAGES.success);
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
                  <DropdownMenuItem
                    onClick={() => updateAction({ update: row.original.id })}>
                    <SquarePenIcon />
                    Update
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateAction({ remove: row.original.id })}>
                    <Trash2Icon />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <TenantsForm
                initialValues={row.original}
                open={action.update === row.original.id}
                onOpenChange={(open) => updateAction({ update: open })}
              />

              <AlertDialog
                open={action.remove === row.original.id}
                onOpenChange={() => updateAction({ remove: false })}>
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
