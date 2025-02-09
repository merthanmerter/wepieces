import { authAtom } from "@/store/auth";
import { MESSAGES } from "@server/constants";
import { SelectUser } from "@server/database/schema";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai/react";
import { toast } from "sonner";
import { useRootContext } from "./use-root-context";

const NAVIGATE_TO = { login: "/login", me: "/me" };

export function useAuth() {
  const navigate = useNavigate();
  const router = useRouter();
  const { proxy } = useRootContext();
  const auth = useAtomValue(authAtom);
  const setAuth = useSetAtom(authAtom);

  const login = useMutation({
    mutationFn: (data: Pick<SelectUser, "username" | "password">) => {
      return proxy.auth.login
        .mutate({ username: data.username, password: data.password })
        .catch((err) => {
          throw err;
        });
    },
    onSuccess: (data) => {
      setAuth(data.credentials);
      router.invalidate();
      router.clearCache();
      router.clearExpiredCache();
    },
    onError: (err) => {
      setAuth(null);
      toast.error(err.message);
    },
    onSettled: () => {
      router.navigate({ to: NAVIGATE_TO.me });
    },
  });

  const validate = useMutation({
    mutationFn: () => proxy.auth.validate.mutate(),
    onSuccess: (data) => setAuth(data.credentials),
    onError: () => {
      setAuth(null);
      navigate({ to: NAVIGATE_TO.login });
    },
  });

  const refresh = useMutation({
    mutationFn: () => proxy.auth.refresh.mutate(),
    onSuccess: (data) => {
      setAuth(data.credentials);
    },
    onError: () => {
      setAuth(null);
      navigate({ to: NAVIGATE_TO.login });
    },
  });

  const logout = useMutation({
    mutationFn: ({ allDevices }: { allDevices: boolean }) => {
      return proxy.auth.logout.mutate({
        allDevices,
      });
    },
    onSuccess: () => {
      setAuth(null);
      navigate({ to: NAVIGATE_TO.login });
      toast.success("Logged out successfully");
    },
    onError: (err) => {
      setAuth(null);
      toast.error(err?.message ?? MESSAGES.unknownError);
    },
  });

  return {
    auth,
    login,
    validate,
    refresh,
    logout,
  };
}
