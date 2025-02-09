import { useLocation } from "@tanstack/react-router";

export function useBreadcrumbs() {
  const current = useLocation();

  const routeHistory = current.pathname
    .split("/")
    .filter((x) => x && x.length > 0);

  const breadcrumbs = routeHistory
    .reduce((acc: { name: string; path: string }[], route) => {
      const prev_path = acc[acc.length - 1]?.path ?? "";
      acc.push({ name: route, path: `${prev_path}/${route}` });
      return acc;
    }, [])
    /*
    return only the first two items
    since we only need the root paths
    this can be customized according
    to requirements of the application
    e.g. use meta data
    */
    .slice(0, 2);

  return breadcrumbs;
}
