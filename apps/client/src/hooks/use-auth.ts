import { useRootContext } from "@/hooks";
import { helpers } from "@/lib";
import { authAtom, authRevalidateIntervalStore } from "@/store/auth";
import { MESSAGES } from "@app/server/src/constants";
import { Credentials } from "@app/server/src/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai/react";
import { toast } from "sonner";

const NAVIGATE_TO = { login: "/login", me: "/me" };

export default function useAuth() {
  const navigate = useNavigate();
  const context = useRootContext();
  const auth = useAtomValue(authAtom);
  const setAuth = useSetAtom(authAtom);
  const setAuthRevalidate = useSetAtom(authRevalidateIntervalStore);

  const loginMutation = useMutation({
    mutationFn: async (data: Partial<Credentials> & { password: string }) => {
      return await context.proxy.auth.login
        .query({ username: data?.username!, password: data?.password! })
        .catch((err) => {
          throw err;
        });
    },
    onSuccess: async (data) => {
      setAuth(data.credentials);
      navigate({ to: NAVIGATE_TO.me });
    },
    onError: (res) => {
      setAuth(null);
      toast.error(res.message);
    },
  });

  const meMutation = useMutation({
    mutationFn: async () => {
      return await context.proxy.auth.me.query().catch((err) => {
        throw err;
      });
    },
    onSuccess: async (data) => setAuth(data.credentials),
    onError: () => {
      setAuth(null);
      navigate({ to: NAVIGATE_TO.login });
    },
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      return await context.proxy.auth.refresh
        .query({
          revalidate: true,
        })
        .catch((err) => {
          throw err;
        });
    },
    onSuccess: async (data) => {
      setAuth(data.credentials);
      setAuthRevalidate(0);
    },
    onError: () => {
      setAuth(null);
      navigate({ to: NAVIGATE_TO.login });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await context.proxy.auth.logout.query().catch((err) => {
        throw err;
      });
    },
    onSuccess: async () => {
      setAuth(null);
      navigate({ to: NAVIGATE_TO.login });
      toast.success("Logged out successfully");
    },
    onError: (err) => {
      setAuth(null);
      toast.error(
        err?.message ?? helpers.str(MESSAGES.unknownError).capitalizeFirst(),
      );
    },
  });

  return {
    auth,
    login: loginMutation,
    me: meMutation,
    refresh: refreshMutation,
    logout: logoutMutation,
  };
}
