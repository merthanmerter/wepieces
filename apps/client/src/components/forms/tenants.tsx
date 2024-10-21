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
import { useRootContext } from "@/hooks";
import { ActionDispatch } from "@/lib/dispatches";
import {
  tenantInsertSchema,
  tenantUpdateSchema,
} from "@app/server/src/api/routers/tenants/definitions";
import { SelectTenant } from "@app/server/src/database/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Loader2Icon, PlusIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function TenantsForm({
  initialValues,
  open,
  onOpenChange,
}: {
  initialValues?: SelectTenant;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { proxy } = useRootContext();
  const { invalidate, clearCache, clearExpiredCache } = useRouter();

  const [action, updateAction] = React.useReducer(
    ActionDispatch<{ open: boolean }>,
    { open: open ?? false },
  );

  const form = useForm({
    resolver: zodResolver(
      initialValues ? tenantUpdateSchema : tenantInsertSchema,
    ),
    values: initialValues ?? {
      name: "",
      status: "active" as const,
    },
  });

  const mutation = useMutation({
    mutationFn: () => {
      if (initialValues) {
        const values = { ...form.getValues(), id: initialValues.id };
        return proxy.tenants.update.mutate(values);
      }
      return proxy.tenants.create.mutate(form.getValues());
    },
    onSuccess: () => {
      invalidate();
      clearCache();
      clearExpiredCache();
      updateAction({ open: false });
      onOpenChange?.(false);
      form.reset();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = form.handleSubmit(() => mutation.mutate());

  const title = initialValues ? "Update" : "Create";
  const description = initialValues ? "Update tenant." : "Create a new tenant.";

  return (
    <Dialog
      open={action.open}
      onOpenChange={(open) => {
        updateAction({ open });
        onOpenChange?.(open);
        form.reset();
      }}>
      {!initialValues && (
        <DialogTrigger asChild>
          <Button size='sm'>
            <PlusIcon /> <span>{title}</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className='max-w-lg'>
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
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {initialValues && (
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Change status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='active'>Active</SelectItem>
                        <SelectItem value='passive'>Passive</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
