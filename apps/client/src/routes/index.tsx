import { authAtom } from "@/store/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { RootContext } from "./__root";

/**
 * This page can be replaced with an actual landing
 * page or a login page. Instead we are redirecting
 * the user to a corresponding route based on their
 * auth status.
 */
const beforeLoad = async ({ context }: { context: RootContext }) => {
  throw redirect({ to: context.store.get(authAtom) ? "/me" : "/login" });
};

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad,
});

function Index() {
  return null;
}
