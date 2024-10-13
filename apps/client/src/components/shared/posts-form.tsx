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
import { Textarea } from "@/components/ui/textarea";
import { useRootContext } from "@/hooks";
import {
  postInsertSchema,
  postUpdateSchema,
} from "@app/server/src/api/routers/posts/definitions";
import { SelectPostWithUser } from "@app/server/src/database/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Loader2Icon, PencilIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function PostsForm({
  initialValues,
}: {
  initialValues?: SelectPostWithUser;
}) {
  const router = useRouter();
  const context = useRootContext();
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(initialValues ? postUpdateSchema : postInsertSchema),
    values: initialValues ?? {
      title: "",
      content: "",
    },
  });

  const mutation = useMutation({
    mutationFn: () => {
      if (initialValues) {
        const values = { ...form.getValues(), id: initialValues.id };
        return context.proxy.posts.update.mutate(values);
      }
      return context.proxy.posts.create.mutate(form.getValues());
    },
    onSuccess: () => {
      setOpen(false);
      router.invalidate();
      form.reset();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = form.handleSubmit(() => mutation.mutate());

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        form.reset();
      }}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='pl-2'>
          {initialValues ? (
            <React.Fragment>
              <PencilIcon className='h-3.5 w-3.5 mr-1.5 text-muted-foreground' />{" "}
              Update
            </React.Fragment>
          ) : (
            <React.Fragment>
              <PlusIcon className='h-3.5 w-3.5 mr-1.5 text-muted-foreground' />{" "}
              Create
            </React.Fragment>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle>Create</DialogTitle>
          <DialogDescription>Create a new alloy.</DialogDescription>
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
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
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
                    <Loader2Icon className='h-4 w-4 animate-spin' />
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
