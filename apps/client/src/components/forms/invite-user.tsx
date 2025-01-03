import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth, useRootContext } from "@/hooks";
import { ActionDispatch } from "@/lib/dispatches";
import { userInviteSchema } from "@app/server/src/api/routers/users/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Loader2Icon, UserRoundCheckIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function InviteUserForm() {
  const { proxy } = useRootContext();
  const { invalidate } = useRouter();
  const { auth } = useAuth();

  const [action, updateAction] = React.useReducer(
    ActionDispatch<{ open: boolean }>,
    {
      open: false,
    },
  );

  const form = useForm({
    resolver: zodResolver(userInviteSchema),
    values: {
      email: "",
      role: "user" as const,
    },
  });

  const mutation = useMutation({
    mutationFn: () => {
      return proxy.users.invite.mutate(form.getValues());
    },
    onSuccess: () => {
      invalidate();
      updateAction({ open: false });
      form.reset();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = form.handleSubmit(() => mutation.mutate());

  return (
    <Dialog
      open={action.open}
      onOpenChange={(open) => {
        updateAction({ open });
        form.reset();
      }}>
      <DialogTrigger asChild>
        <Button size='sm'>
          <UserRoundCheckIcon /> <span>Invite</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle>Invite</DialogTitle>
          <DialogDescription>Invite an existing user.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className='space-y-3'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a role' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='user'>User</SelectItem>
                      <SelectItem value='admin'>Admin</SelectItem>
                      {auth?.role === "superadmin" && (
                        <SelectItem value='superadmin'>Superadmin</SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                className='mt-2'
                type='submit'
                size='sm'
                disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <React.Fragment>
                    <Loader2Icon className='size-4 animate-spin' />
                  </React.Fragment>
                ) : (
                  "Invite"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
