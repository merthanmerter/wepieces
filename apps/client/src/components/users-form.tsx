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
import { useAuth } from "@/hooks/use-auth";
import { useRootContext } from "@/hooks/use-root-context";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userInsertSchema,
  userUpdateSchema,
} from "@server/api/routers/users/definitions";
import { SelectUserWithRole } from "@server/database/schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Loader2Icon, UserRoundPlusIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PasswordInput } from "./password-input";

export default function UsersForm({
  initialValues,
  open: initialOpen,
  onOpenChange,
}: {
  initialValues?: SelectUserWithRole;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { proxy } = useRootContext();
  const { invalidate } = useRouter();
  const { auth } = useAuth();

  const [open, setOpen] = React.useState(initialOpen ?? false);

  const form = useForm({
    resolver: zodResolver(initialValues ? userUpdateSchema : userInsertSchema),
    values: initialValues ?? {
      username: "",
      email: "",
      role: "user" as const,
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: () => {
      if (initialValues) {
        const values = { ...form.getValues(), id: initialValues.id };
        return proxy.users.update.mutate(values);
      }
      return proxy.users.create.mutate(form.getValues());
    },
    onSuccess: () => {
      invalidate();
      setOpen(false);
      onOpenChange?.(false);
      form.reset();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = form.handleSubmit(() => mutation.mutate());

  const title = initialValues ? "Update" : "Create";
  const description = initialValues ? "Update user." : "Create a new user.";

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        onOpenChange?.(open);
        form.reset();
      }}>
      {!initialValues && (
        <DialogTrigger asChild>
          <Button size='sm'>
            <UserRoundPlusIcon /> <span>{title}</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
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
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            {!initialValues && (
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                ) : initialValues ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
