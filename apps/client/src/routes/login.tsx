import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks";
import { authAtom } from "@/store/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { RootContext } from "./__root";

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

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad,
});

export default function Login() {
  const { auth, login } = useAuth();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (auth) return;
        const formData = new FormData(e.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;
        login.mutate({ username, password });
      }}
      className='flex flex-col gap-4 items-center justify-center w-full h-screen mx-auto max-w-xs'>
      <h1 className='text-center text-xl font-bold'>Login</h1>
      <Input
        name='username'
        placeholder='Username'
        className='w-full bg-background'
      />
      <Input
        name='password'
        type='password'
        placeholder='Password'
        className='w-full bg-background'
      />
      <Button
        disabled={login.isPending}
        className='w-full'>
        {login.isPending && (
          <Loader2Icon className='h-4 w-4 animate-spin mr-1' />
        )}
        Login
      </Button>
    </form>
  );
}
