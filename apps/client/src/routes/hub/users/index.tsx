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
import { MESSAGES } from "@app/server/src/constants";
import { useMutation } from "@tanstack/react-query";
import {
  createFileRoute,
  useLoaderData,
  useRouter,
} from "@tanstack/react-router";
import { EllipsisIcon, UserRoundPenIcon, UserRoundXIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/hub/users/")({
  loaderDeps: ({ search }) => search,
  component: Page,
  loader: ({ context, deps: params }) => context.proxy.users.list.query(params),
  wrapInSuspense: true,
});

function Page() {
  const data = useLoaderData({ from: "/hub/users/" });

  const context = useRootContext();
  const router = useRouter();

  const [edit, setEdit] = React.useState<string | boolean>(false);
  const [dismiss, setDismiss] = React.useState<string | boolean>(false);

  const dismissFn = useMutation({
    mutationFn: async (id: string) => {
      return await context.proxy.users.dismiss.mutate({ id });
    },
    onSuccess: async () => {
      setDismiss(false);
      toast.success(MESSAGES.success);
      router.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

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
                  <EllipsisIcon className='h-4 w-4' />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{row.original.username}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setEdit(row.original.id)}>
                    <UserRoundPenIcon />
                    Update
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDismiss(row.original.id)}>
                    <UserRoundXIcon />
                    Dismiss
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <UsersForm
                open={edit === row.original.id}
                onOpenChange={(open) => setEdit(open)}
                initialValues={row.original}
              />

              <AlertDialog
                open={dismiss === row.original.id}
                onOpenChange={() => setDismiss(false)}>
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
