/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from "./routes/__root";
import { Route as HubImport } from "./routes/hub";
import { Route as IndexImport } from "./routes/index";
import { Route as HubIndexImport } from "./routes/hub/index";
import { Route as authMeImport } from "./routes/(auth)/me";
import { Route as authLoginImport } from "./routes/(auth)/login";
import { Route as HubUsersIndexImport } from "./routes/hub/users/index";
import { Route as HubTodoIndexImport } from "./routes/hub/todo/index";
import { Route as HubTenantsIndexImport } from "./routes/hub/tenants/index";
import { Route as HubPostsIndexImport } from "./routes/hub/posts/index";
import { Route as HubPostsIdImport } from "./routes/hub/posts/$id";

// Create/Update Routes

const HubRoute = HubImport.update({
  id: "/hub",
  path: "/hub",
  getParentRoute: () => rootRoute,
} as any);

const IndexRoute = IndexImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => rootRoute,
} as any);

const HubIndexRoute = HubIndexImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => HubRoute,
} as any);

const authMeRoute = authMeImport.update({
  id: "/(auth)/me",
  path: "/me",
  getParentRoute: () => rootRoute,
} as any);

const authLoginRoute = authLoginImport.update({
  id: "/(auth)/login",
  path: "/login",
  getParentRoute: () => rootRoute,
} as any);

const HubUsersIndexRoute = HubUsersIndexImport.update({
  id: "/users/",
  path: "/users/",
  getParentRoute: () => HubRoute,
} as any);

const HubTodoIndexRoute = HubTodoIndexImport.update({
  id: "/todo/",
  path: "/todo/",
  getParentRoute: () => HubRoute,
} as any);

const HubTenantsIndexRoute = HubTenantsIndexImport.update({
  id: "/tenants/",
  path: "/tenants/",
  getParentRoute: () => HubRoute,
} as any);

const HubPostsIndexRoute = HubPostsIndexImport.update({
  id: "/posts/",
  path: "/posts/",
  getParentRoute: () => HubRoute,
} as any);

const HubPostsIdRoute = HubPostsIdImport.update({
  id: "/posts/$id",
  path: "/posts/$id",
  getParentRoute: () => HubRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/";
      path: "/";
      fullPath: "/";
      preLoaderRoute: typeof IndexImport;
      parentRoute: typeof rootRoute;
    };
    "/hub": {
      id: "/hub";
      path: "/hub";
      fullPath: "/hub";
      preLoaderRoute: typeof HubImport;
      parentRoute: typeof rootRoute;
    };
    "/(auth)/login": {
      id: "/(auth)/login";
      path: "/login";
      fullPath: "/login";
      preLoaderRoute: typeof authLoginImport;
      parentRoute: typeof rootRoute;
    };
    "/(auth)/me": {
      id: "/(auth)/me";
      path: "/me";
      fullPath: "/me";
      preLoaderRoute: typeof authMeImport;
      parentRoute: typeof rootRoute;
    };
    "/hub/": {
      id: "/hub/";
      path: "/";
      fullPath: "/hub/";
      preLoaderRoute: typeof HubIndexImport;
      parentRoute: typeof HubImport;
    };
    "/hub/posts/$id": {
      id: "/hub/posts/$id";
      path: "/posts/$id";
      fullPath: "/hub/posts/$id";
      preLoaderRoute: typeof HubPostsIdImport;
      parentRoute: typeof HubImport;
    };
    "/hub/posts/": {
      id: "/hub/posts/";
      path: "/posts";
      fullPath: "/hub/posts";
      preLoaderRoute: typeof HubPostsIndexImport;
      parentRoute: typeof HubImport;
    };
    "/hub/tenants/": {
      id: "/hub/tenants/";
      path: "/tenants";
      fullPath: "/hub/tenants";
      preLoaderRoute: typeof HubTenantsIndexImport;
      parentRoute: typeof HubImport;
    };
    "/hub/todo/": {
      id: "/hub/todo/";
      path: "/todo";
      fullPath: "/hub/todo";
      preLoaderRoute: typeof HubTodoIndexImport;
      parentRoute: typeof HubImport;
    };
    "/hub/users/": {
      id: "/hub/users/";
      path: "/users";
      fullPath: "/hub/users";
      preLoaderRoute: typeof HubUsersIndexImport;
      parentRoute: typeof HubImport;
    };
  }
}

// Create and export the route tree

interface HubRouteChildren {
  HubIndexRoute: typeof HubIndexRoute;
  HubPostsIdRoute: typeof HubPostsIdRoute;
  HubPostsIndexRoute: typeof HubPostsIndexRoute;
  HubTenantsIndexRoute: typeof HubTenantsIndexRoute;
  HubTodoIndexRoute: typeof HubTodoIndexRoute;
  HubUsersIndexRoute: typeof HubUsersIndexRoute;
}

const HubRouteChildren: HubRouteChildren = {
  HubIndexRoute: HubIndexRoute,
  HubPostsIdRoute: HubPostsIdRoute,
  HubPostsIndexRoute: HubPostsIndexRoute,
  HubTenantsIndexRoute: HubTenantsIndexRoute,
  HubTodoIndexRoute: HubTodoIndexRoute,
  HubUsersIndexRoute: HubUsersIndexRoute,
};

const HubRouteWithChildren = HubRoute._addFileChildren(HubRouteChildren);

export interface FileRoutesByFullPath {
  "/": typeof IndexRoute;
  "/hub": typeof HubRouteWithChildren;
  "/login": typeof authLoginRoute;
  "/me": typeof authMeRoute;
  "/hub/": typeof HubIndexRoute;
  "/hub/posts/$id": typeof HubPostsIdRoute;
  "/hub/posts": typeof HubPostsIndexRoute;
  "/hub/tenants": typeof HubTenantsIndexRoute;
  "/hub/todo": typeof HubTodoIndexRoute;
  "/hub/users": typeof HubUsersIndexRoute;
}

export interface FileRoutesByTo {
  "/": typeof IndexRoute;
  "/login": typeof authLoginRoute;
  "/me": typeof authMeRoute;
  "/hub": typeof HubIndexRoute;
  "/hub/posts/$id": typeof HubPostsIdRoute;
  "/hub/posts": typeof HubPostsIndexRoute;
  "/hub/tenants": typeof HubTenantsIndexRoute;
  "/hub/todo": typeof HubTodoIndexRoute;
  "/hub/users": typeof HubUsersIndexRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  "/": typeof IndexRoute;
  "/hub": typeof HubRouteWithChildren;
  "/(auth)/login": typeof authLoginRoute;
  "/(auth)/me": typeof authMeRoute;
  "/hub/": typeof HubIndexRoute;
  "/hub/posts/$id": typeof HubPostsIdRoute;
  "/hub/posts/": typeof HubPostsIndexRoute;
  "/hub/tenants/": typeof HubTenantsIndexRoute;
  "/hub/todo/": typeof HubTodoIndexRoute;
  "/hub/users/": typeof HubUsersIndexRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths:
    | "/"
    | "/hub"
    | "/login"
    | "/me"
    | "/hub/"
    | "/hub/posts/$id"
    | "/hub/posts"
    | "/hub/tenants"
    | "/hub/todo"
    | "/hub/users";
  fileRoutesByTo: FileRoutesByTo;
  to:
    | "/"
    | "/login"
    | "/me"
    | "/hub"
    | "/hub/posts/$id"
    | "/hub/posts"
    | "/hub/tenants"
    | "/hub/todo"
    | "/hub/users";
  id:
    | "__root__"
    | "/"
    | "/hub"
    | "/(auth)/login"
    | "/(auth)/me"
    | "/hub/"
    | "/hub/posts/$id"
    | "/hub/posts/"
    | "/hub/tenants/"
    | "/hub/todo/"
    | "/hub/users/";
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  HubRoute: typeof HubRouteWithChildren;
  authLoginRoute: typeof authLoginRoute;
  authMeRoute: typeof authMeRoute;
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  HubRoute: HubRouteWithChildren,
  authLoginRoute: authLoginRoute,
  authMeRoute: authMeRoute,
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/hub",
        "/(auth)/login",
        "/(auth)/me"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/hub": {
      "filePath": "hub.tsx",
      "children": [
        "/hub/",
        "/hub/posts/$id",
        "/hub/posts/",
        "/hub/tenants/",
        "/hub/todo/",
        "/hub/users/"
      ]
    },
    "/(auth)/login": {
      "filePath": "(auth)/login.tsx"
    },
    "/(auth)/me": {
      "filePath": "(auth)/me.tsx"
    },
    "/hub/": {
      "filePath": "hub/index.tsx",
      "parent": "/hub"
    },
    "/hub/posts/$id": {
      "filePath": "hub/posts/$id.tsx",
      "parent": "/hub"
    },
    "/hub/posts/": {
      "filePath": "hub/posts/index.tsx",
      "parent": "/hub"
    },
    "/hub/tenants/": {
      "filePath": "hub/tenants/index.tsx",
      "parent": "/hub"
    },
    "/hub/todo/": {
      "filePath": "hub/todo/index.tsx",
      "parent": "/hub"
    },
    "/hub/users/": {
      "filePath": "hub/users/index.tsx",
      "parent": "/hub"
    }
  }
}
ROUTE_MANIFEST_END */
