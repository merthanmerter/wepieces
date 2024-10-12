import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import React from "react";

export default function useParentRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const router = useRouter();

  const parentRoute = React.useMemo(() => {
    const pathSegments = location.pathname?.split("/").filter(Boolean);
    return pathSegments?.length > 1
      ? `/${pathSegments.slice(0, -1).join("/")}`
      : "/";
  }, [location.pathname]);

  const navigateToParent = React.useCallback(
    async ({ invalidate = true } = {}) => {
      try {
        await navigate({ to: parentRoute });
        if (invalidate) {
          await router.invalidate();
        }
      } catch (error) {
        console.error("Navigation failed", error);
      }
    },
    [navigate, parentRoute, router],
  );

  return { parentRoute, navigateToParent };
}
