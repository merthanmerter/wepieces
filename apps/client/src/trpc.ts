import type { AppRouter } from "@app/server/src/app";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

/**
 * Using custom proxy settings for tRPC client.
 * @file ./vite.config.ts
 */
const url = "/api/trpc";

export const proxy = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
      // headers() {
      //   const subdomain = new URL(url).hostname;
      //   return {
      //     "x-subdomain": subdomain,
      //     "x-cache-version": new Date().getTime().toString(),
      //   };
      // },
    }),
  ],
  transformer: superjson,
});

export type TRPCProxyClient = typeof proxy;
