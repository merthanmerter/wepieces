import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { authAtom } from "@/store/auth";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { RootContext } from "../__root";

/**
 * Auth Check
 * Since we auth check and revalidate in the `hub` root route,
 * for the routes that are excluded we can use this auth check function
 * from the jotai store and redirect to any route we want.
 * In this case we are redirecting the user to `/login` route
 * if they are not logged in.
 */
const beforeLoad = async ({ context }: { context: RootContext }) => {
  if (!context.store.get(authAtom)) throw redirect({ to: "/login" });
};

export const Route = createFileRoute("/(auth)/me")({
  component: Login,
  beforeLoad,
});

export default function Login() {
  const { auth, validate, refresh, logout } = useAuth();

  return (
    <div className='flex flex-col gap-4 items-center justify-center w-full h-dvh mx-auto'>
      <div className='space-y-2'>
        <pre className='border font-mono p-3 rounded-md bg-background text-sm'>
          {JSON.stringify(auth, null, 2)}
        </pre>

        <div className='grid grid-cols-2 gap-2'>
          <Button
            asChild
            size='sm'
            variant='outline'
            type='button'
            className='w-full'>
            <Link to='/hub'>Dashboard</Link>
          </Button>

          <Button
            size='sm'
            variant='outline'
            onClick={() => logout.mutate({ allDevices: false })}
            type='button'
            className='w-full'>
            Logout
          </Button>

          <Button
            size='sm'
            variant='outline'
            onClick={() => refresh.mutate()}
            type='button'
            className='w-full'>
            Refresh Auth
          </Button>

          <Button
            size='sm'
            variant='outline'
            onClick={() => validate.mutate()}
            type='button'
            className='w-full'>
            Validate Auth
          </Button>
        </div>
      </div>
    </div>
  );
}
