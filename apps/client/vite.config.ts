import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { default as react } from "@vitejs/plugin-react";
import path from "path";
import Unfonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";
export default defineConfig(() => {
  return {
    plugins: [
      react(),
      TanStackRouterVite(),
      Unfonts({
        custom: {
          families: [
            {
              name: "Geist",
              src: "./src/assets/fonts/geist/GeistVF.woff2",
            },
            {
              name: "Geist-Mono",
              src: "./src/assets/fonts/geist/GeistMonoVF.woff2",
            },
            {
              name: "Geist-Thin",
              src: "./src/assets/fonts/geist/Geist-Thin.woff2",
            },
            {
              name: "Geist-ExtraLight",
              src: "./src/assets/fonts/geist/Geist-ExtraLight.woff2",
            },
            {
              name: "Geist-Light",
              src: "./src/assets/fonts/geist/Geist-Light.woff2",
            },
            {
              name: "Geist-Medium",
              src: "./src/assets/fonts/geist/Geist-Medium.woff2",
            },
            {
              name: "Geist-SemiBold",
              src: "./src/assets/fonts/geist/Geist-SemiBold.woff2",
            },
            {
              name: "Geist-Bold",
              src: "./src/assets/fonts/geist/Geist-Bold.woff2",
            },
            {
              name: "Geist-ExtraBold",
              src: "./src/assets/fonts/geist/Geist-ExtraBold.woff2",
            },
            {
              name: "Geist-Black",
              src: "./src/assets/fonts/geist/Geist-Black.woff2",
            },
          ],
        },
      }),
    ],
    clearScreen: false,
    server: {
      strictPort: true,
      port: 4000,
      proxy: {
        "/api": {
          target: "http://127.0.0.1:5000",
          changeOrigin: true,
          secure: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      include: [],
    },
  };
});
