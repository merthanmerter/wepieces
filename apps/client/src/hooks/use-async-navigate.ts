import { LinkProps, useRouter } from "@tanstack/react-router";
import React from "react";

/**
 * Asynchronously navigates to the given route, allowing us to invalidate
 * and clear expired cache after the navigation is complete.
 *
 * This prevents stale data flickering from the route where the action was triggered.
 * Additionally, it ensures that cache invalidation happens after navigation,
 * preventing requests to non-existent APIs (e.g., dynamic routes).
 */

type AsyncNavigateOptions = {
  to: LinkProps["to"];
  search?: LinkProps["search"];
  invalidate?: boolean;
  clearCache?: {
    before?: boolean;
    after?: boolean;
  };
  callback?: () => void;
};

export function useAsyncNavigate() {
  const router = useRouter();
  const [isPending, setPending] = React.useState(false);
  const navigateAsync = async ({
    to,
    search,
    invalidate = false,
    clearCache = { before: false, after: false },
    callback,
  }: AsyncNavigateOptions) => {
    if (clearCache.before) {
      router.clearCache();
      router.clearExpiredCache();
    }

    // await router.navigate({ to, search }).then(() => {
    //   if (invalidate) router.invalidate();
    //   if (clearCache.after) {
    //     router.clearCache();
    //     router.clearExpiredCache();
    //   }
    //   callback?.();
    // });

    setPending(true);
    await router.navigate({ to, search });
    if (invalidate) router.invalidate();
    if (clearCache.after) {
      router.clearCache();
      router.clearExpiredCache();
    }
    setPending(false);
    callback?.();
  };

  return { navigate: navigateAsync, isPending };
}
