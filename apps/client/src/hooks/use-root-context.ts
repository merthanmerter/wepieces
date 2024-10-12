import { useRouteContext } from "@tanstack/react-router";

export default function useRootContext() {
  const ctx = useRouteContext({ from: "__root__" });
  return ctx;
}
