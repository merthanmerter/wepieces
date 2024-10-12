import { AUTH_REVALIDATE_INTERVAL } from "@/constants";
import { RootContext } from "@/routes/__root";
import { Credentials } from "@app/server/src/lib/auth";
import { atomWithStorage } from "jotai/utils";

export const authAtom = atomWithStorage<Credentials>("auth", null);

/**
 * Auth Revalidate Interval
 * Every 10 requests, user data is revalidated
 * so we don't make database calls every time we refresh the token.
 * @file './constants/index.ts' to change the interval.
 * With this, we can update user name, role, etc from remote
 * while using stateless auth.
 */
export const authRevalidateIntervalStore = atomWithStorage<number>(
  "auth_revalidate_interval",
  0,
);

export const authRevalidateInterval = (context: RootContext) => {
  const authRevalidateIntervalGetter = context.store.get(
    authRevalidateIntervalStore,
  );
  const authRevalidateIntervalSetter = (interval: number) =>
    context.store.set(authRevalidateIntervalStore, interval);
  authRevalidateIntervalGetter === 10
    ? authRevalidateIntervalSetter(0)
    : authRevalidateIntervalSetter(authRevalidateIntervalGetter + 1);

  const revalidate =
    authRevalidateIntervalGetter === AUTH_REVALIDATE_INTERVAL ? true : false;
  return revalidate;
};
