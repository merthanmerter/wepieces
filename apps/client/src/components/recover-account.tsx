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
import { useRootContext } from "@/hooks/use-root-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { recoverAccountSchema } from "@server/api/routers/auth/definitions";
import { useMutation } from "@tanstack/react-query";
import { KeyRoundIcon, Loader2Icon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PasswordInput } from "./password-input";

export default function RecoverAccountForm() {
  const { proxy } = useRootContext();

  const [open, setOpen] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(recoverAccountSchema),
    values: {
      username: "",
      password: "",
      confirmPassword: "",
      recoveryCode: "",
    },
  });

  const mutation = useMutation({
    mutationFn: () => {
      return proxy.auth.recoverAccount.mutate(form.getValues());
    },
    onSuccess: () => {
      setOpen(false);
      form.reset();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = form.handleSubmit(() => mutation.mutate());

  const title = "Account Recovery";
  const description =
    "Recover your account by entering the recovery key provided by your administrator.";

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        form.reset();
      }}>
      <DialogTrigger asChild>
        <Button
          size='sm'
          variant='ghost'>
          <KeyRoundIcon /> <span>{title}</span>
        </Button>
      </DialogTrigger>
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

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='recoveryCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recovery Key</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
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
                    <Loader2Icon className='size-4 animate-spin' />
                  </React.Fragment>
                ) : (
                  "Submit"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
