import { PasswordInput } from "@/components/password-input";
import RecoverAccountForm from "@/components/recover-account";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { authAtom } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { authLoginSchema } from "@server/api/routers/auth/definitions";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { RootContext } from "../__root";

/**
 * Auth Check
 * Since we auth check and revalidate in the `hub` root route,
 * for the routes that are excluded we can use this auth check function
 * from the jotai store and redirect to any route we want.
 * In this case we are redirecting the user to `/me` route
 * if they are already logged in.
 */
const beforeLoad = async ({ context }: { context: RootContext }) => {
  if (context.store.get(authAtom)) throw redirect({ to: "/me" });
};

export const Route = createFileRoute("/(auth)/login")({
  component: Login,
  beforeLoad,
});

export default function Login() {
  const { login } = useAuth();

  const form = useForm({
    resolver: zodResolver(authLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(() => login.mutate(form.getValues()));

  return (
    <>
      <div className='flex flex-col gap-3 items-center justify-center h-dvh max-w-sm w-full mx-auto'>
        <Form {...form}>
          <form
            className='w-full space-y-3 text-center'
            onSubmit={handleSubmit}>
            <h1 className='text-center text-xl font-bold'>Login</h1>

            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <div className='flex justify-between items-center'>
                    <FormLabel htmlFor='username'>Username</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      className='w-full bg-background'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <div className='flex justify-between items-center'>
                    <FormLabel htmlFor='password'>Password</FormLabel>
                  </div>
                  <FormControl>
                    <PasswordInput
                      id='password'
                      placeholder='******'
                      autoComplete='current-password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={login.isPending}
              className='w-full'>
              {login.isPending && (
                <Loader2Icon className='size-4 animate-spin mr-1' />
              )}
              Login
            </Button>
          </form>
        </Form>
        <RecoverAccountForm />
      </div>
    </>
  );
}
