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
import { Input } from "@/components/ui/input";
import { useCopyToClipboard, useRootContext } from "@/hooks";
import { ActionDispatch } from "@/lib/dispatches";
import { userQuerySchema } from "@app/server/src/api/routers/users/definitions";
import { MESSAGES } from "@app/server/src/constants";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import {
  CopyCheckIcon,
  CopyIcon,
  EllipsisIcon,
  KeyRoundIcon,
  UserRoundPenIcon,
  UserRoundXIcon,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/hub/users/")({
  validateSearch: zodSearchValidator(userQuerySchema),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.proxy.users.list.query(deps),
  component: Page,
});

type Actions = {
  update: string | boolean;
  dismiss: string | boolean;
  resetPassword: string | boolean;
  recoveryCode: string | boolean;
};

function Page() {
  const data = Route.useLoaderData();
  const { proxy } = useRootContext();
  const { invalidate } = useRouter();

  const [action, updateAction] = React.useReducer(ActionDispatch<Actions>, {
    update: false,
    dismiss: false,
    resetPassword: false,
    recoveryCode: false,
  });

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

  const resetPasswordFn = useMutation({
    mutationFn: async (id: string) => {
      return await proxy.users.resetPassword.mutate({ id });
    },
    onSuccess: async (res) => {
      if (res.recoveryId) {
        updateAction({ recoveryCode: res.recoveryId });
      }
      updateAction({ resetPassword: false });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const [copied, copyText] = useCopyToClipboard();

  if (!data) return null;

  return (
    <React.Fragment>
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
                    <DropdownMenuLabel>
                      {row.original.username}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => updateAction({ update: row.original.id })}>
                      <UserRoundPenIcon />
                      Update
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAction({ dismiss: row.original.id })
                      }>
                      <UserRoundXIcon />
                      Dismiss
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAction({ resetPassword: row.original.id })
                      }>
                      <KeyRoundIcon />
                      Reset Password
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
                        This action will remove the user{" "}
                        <b>{row.original.username}</b> from the company.
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

                <AlertDialog
                  open={action.resetPassword === row.original.id}
                  onOpenChange={() => updateAction({ resetPassword: false })}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will reset the password for user{" "}
                        <b>{row.original.username}</b> and prompt them to create
                        a new one at their next login.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={resetPasswordFn.isPending}
                        onClick={() => resetPasswordFn.mutate(row.original.id)}>
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
      <AlertDialog
        open={!!action.recoveryCode}
        onOpenChange={() => updateAction({ recoveryCode: false })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Recovery Code Generated</AlertDialogTitle>
            <AlertDialogDescription>
              The recovery code has been generated. Please provide it to the
              user so they can reset their password and recover their account.
            </AlertDialogDescription>
            <div className='relative py-4'>
              <Input
                value={
                  typeof action.recoveryCode === "string"
                    ? action.recoveryCode
                    : ""
                }
                readOnly
                className='w-full'
                placeholder='Recovery Code'
              />
              <button
                onClick={() => {
                  if (typeof action.recoveryCode !== "string") {
                    return;
                  }
                  copyText(action.recoveryCode);
                }}
                className='absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground p-0 m-0'>
                {copied ? (
                  <CopyCheckIcon className='size-5 text-green-500' />
                ) : (
                  <CopyIcon className='size-5' />
                )}
              </button>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => updateAction({ recoveryCode: false })}>
              Done
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
}
