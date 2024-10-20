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
import {
  userInsertSchema,
  userUpdateSchema,
} from "@app/server/src/api/routers/users/definitions";
import { SelectUserWithoutPassword } from "@app/server/src/database/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { FilePenLineIcon, Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function UsersForm({
  initialValues,
  open,
  onOpenChange,
}: {
  initialValues?: SelectUserWithoutPassword;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const router = useRouter();
  const context = useRootContext();
  const [_open, setOpen] = useState(open ?? false);
  const { auth } = useAuth();

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
        return context.proxy.users.update.mutate(values);
      }
      return context.proxy.users.create.mutate(form.getValues());
    },
    onSuccess: () => {
      setOpen(false);
      onOpenChange?.(false);
      router.invalidate();
      form.reset();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = form.handleSubmit(() => mutation.mutate());

  const title = initialValues ? "Update" : "Create";
  const description = initialValues ? "Update user." : "Create a new user.";

  return (
    <Dialog
      open={_open}
      onOpenChange={(open) => {
        setOpen(open);
        onOpenChange?.(open);
        form.reset();
      }}>
      {!initialValues && (
        <DialogTrigger asChild>
          <Button size='sm'>
            <FilePenLineIcon /> <span>{title}</span>
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
                      <Input
                        type='password'
                        {...field}
                      />
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
