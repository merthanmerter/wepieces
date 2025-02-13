import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { default as react } from "@vitejs/plugin-react";
import path from "path";
import unfonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";
export default defineConfig(() => {
  return {
    plugins: [
      react(),
      TanStackRouterVite(),
      unfonts({
        custom: {
          families: [
            {
              name: "Geist",
              local: "Geist",
              src: "./src/assets/fonts/geist/GeistVF.woff2",
            },
            {
              name: "Geist-Mono",
              local: "Geist-Mono",
              src: "./src/assets/fonts/geist/GeistMonoVF.woff2",
            },
            {
              name: "Geist-Thin",
              local: "Geist-Thin",
              src: "./src/assets/fonts/geist/Geist-Thin.woff2",
            },
            {
              name: "Geist-ExtraLight",
              local: "Geist-ExtraLight",
              src: "./src/assets/fonts/geist/Geist-ExtraLight.woff2",
            },
            {
              name: "Geist-Light",
              local: "Geist-Light",
              src: "./src/assets/fonts/geist/Geist-Light.woff2",
            },
            {
              name: "Geist-Medium",
              local: "Geist-Medium",
              src: "./src/assets/fonts/geist/Geist-Medium.woff2",
            },
            {
              name: "Geist-SemiBold",
              local: "Geist-SemiBold",
              src: "./src/assets/fonts/geist/Geist-SemiBold.woff2",
            },
            {
              name: "Geist-Bold",
              local: "Geist-Bold",
              src: "./src/assets/fonts/geist/Geist-Bold.woff2",
            },
            {
              name: "Geist-ExtraBold",
              local: "Geist-ExtraBold",
              src: "./src/assets/fonts/geist/Geist-ExtraBold.woff2",
            },
            {
              name: "Geist-Black",
              local: "Geist-Black",
              src: "./src/assets/fonts/geist/Geist-Black.woff2",
            },
          ],
          display: "swap",
          preload: true,
          injectTo: "head-prepend",
          prefetch: true,
        },
      }),
    ],
    clearScreen: false,
    build: {
      sourcemap: false,
      minify: true,
      cssMinify: true,
      cssCodeSplit: true,
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (warning.code === "SOURCEMAP_ERROR") {
            return;
          }

          defaultHandler(warning);
        },
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
      },
    },
    server: {
      strictPort: true,
      port: 4000,
      proxy: {
        "/api": {
          target: "http://127.0.0.1:3000",
          changeOrigin: true,
          secure: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@server": path.resolve(__dirname, "../server/src"),
      },
    },
    optimizeDeps: {
      force: true,
    },
  };
});
