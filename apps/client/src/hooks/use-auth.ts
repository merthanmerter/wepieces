import { useRootContext } from "@/hooks";
import { authAtom } from "@/store/auth";
import { MESSAGES } from "@app/server/src/constants";
import { SelectUser } from "@app/server/src/database/schema";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai/react";
import { toast } from "sonner";

const NAVIGATE_TO = { login: "/login", me: "/me" };

export default function useAuth() {
  const navigate = useNavigate();
  const router = useRouter();
  const { proxy } = useRootContext();
  const auth = useAtomValue(authAtom);
  const setAuth = useSetAtom(authAtom);

  const login = useMutation({
    mutationFn: async (data: Pick<SelectUser, "username" | "password">) => {
      return await proxy.auth.login
        .mutate({ username: data.username, password: data.password })
        .catch((err) => {
          throw err;
        });
    },
    onSuccess: async (data) => {
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
    mutationFn: async () => {
      return await proxy.auth.validate.mutate();
    },
    onSuccess: async (data) => setAuth(data.credentials),
    onError: () => {
      setAuth(null);
      navigate({ to: NAVIGATE_TO.login });
    },
  });

  const refresh = useMutation({
    mutationFn: async () => {
      return await proxy.auth.refresh.mutate();
    },
    onSuccess: async (data) => {
      setAuth(data.credentials);
    },
    onError: () => {
      setAuth(null);
      navigate({ to: NAVIGATE_TO.login });
    },
  });

  const logout = useMutation({
    mutationFn: async ({ allDevices }: { allDevices: boolean }) => {
      return await proxy.auth.logout
        .mutate({
          allDevices,
        })
        .catch((err) => {
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
