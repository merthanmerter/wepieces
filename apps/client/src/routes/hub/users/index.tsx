import InviteUserForm from "@/components/forms/invite-user";
import UsersForm from "@/components/forms/users";
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
import { MESSAGES } from "@app/server/src/constants";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { EllipsisIcon, UserRoundPenIcon, UserRoundXIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/hub/users/")({
  component: Page,
  loader: ({ context, location }) =>
    context.proxy.users.list.query(location.search),
});

function Page() {
  const data = Route.useLoaderData();
  const { proxy } = useRootContext();
  const { invalidate } = useRouter();

  const [action, updateAction] = React.useReducer(
    ActionDispatch<{ update: string | boolean; dismiss: string | boolean }>,
    { update: false, dismiss: false },
  );

  const dismissFn = useMutation({
    mutationFn: async (id: string) => {
      return await proxy.users.dismiss.mutate({ id });
    },
    onSuccess: async () => {
      invalidate();
      updateAction({ dismiss: false });
      toast.success(MESSAGES.success);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  if (!data) return null;

  return (
    <DataTable
      title={<h1 className='font-bold text-xl'>Users</h1>}
      nav={{
        end: (
          <>
            <UsersForm />
            <InviteUserForm />
          </>
        ),
      }}
      data={data.records}
      meta={data.meta}
      columns={[
        {
          id: "action",
          accessorKey: "id",
          header: "",
          meta: {
            className: "w-10 inline-flex items-center",
          },
          cell: ({ row }) => (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className='my-auto'>
                  <EllipsisIcon className='size-4' />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{row.original.username}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => updateAction({ update: row.original.id })}>
                    <UserRoundPenIcon />
                    Update
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateAction({ dismiss: row.original.id })}>
                    <UserRoundXIcon />
                    Dismiss
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <UsersForm
                initialValues={row.original}
                open={action.update === row.original.id}
                onOpenChange={(open) => updateAction({ update: open })}
              />

              <AlertDialog
                open={action.dismiss === row.original.id}
                onOpenChange={() => updateAction({ dismiss: false })}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will remove the user from the company.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      disabled={dismissFn.isPending}
                      onClick={() => dismissFn.mutate(row.original.id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
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
            type: "select",
            name: "role",
            placeholder: "Role",
            sortable: true,
            options: [
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
            ],
          },
        },
      ]}
    />
  );
}
