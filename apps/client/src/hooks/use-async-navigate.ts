import { LinkProps, useRouter } from "@tanstack/react-router";

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
  invalidate?: boolean;
  clearCache?: {
    before?: boolean;
    after?: boolean;
  };
  callback?: () => void;
};
export default function useAsyncNavigate() {
  const router = useRouter();
  const navigateAsync = async ({
    to,
    invalidate = false,
    clearCache = { before: false, after: false },
    callback,
  }: AsyncNavigateOptions) => {
    if (clearCache.before) {
      router.clearCache();
      router.clearExpiredCache();
    }

    await router.navigate({ to }).then(() => {
      if (invalidate) router.invalidate();
      if (clearCache.after) {
        router.clearCache();
        router.clearExpiredCache();
      }
      callback?.();
    });
  };

  return navigateAsync;
}
