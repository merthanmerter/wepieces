// vite.config.ts
import { TanStackRouterVite } from "file:///C:/Merthan/GitHub/wepieces/node_modules/@tanstack/router-plugin/dist/esm/vite.js";
import { default as react } from "file:///C:/Merthan/GitHub/wepieces/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import Unfonts from "file:///C:/Merthan/GitHub/wepieces/node_modules/unplugin-fonts/dist/vite.mjs";
import { defineConfig } from "file:///C:/Merthan/GitHub/wepieces/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "C:\\Merthan\\GitHub\\wepieces\\apps\\client";
var vite_config_default = defineConfig(() => {
  return {
    plugins: [
      react(),
      TanStackRouterVite(),
      Unfonts({
        custom: {
          families: [
            {
              name: "Geist",
              local: "Geist",
              src: "./src/assets/fonts/geist/GeistVF.woff2"
            },
            {
              name: "Geist-Mono",
              local: "Geist-Mono",
              src: "./src/assets/fonts/geist/GeistMonoVF.woff2"
            },
            {
              name: "Geist-Thin",
              local: "Geist-Thin",
              src: "./src/assets/fonts/geist/Geist-Thin.woff2"
            },
            {
              name: "Geist-ExtraLight",
              local: "Geist-ExtraLight",
              src: "./src/assets/fonts/geist/Geist-ExtraLight.woff2"
            },
            {
              name: "Geist-Light",
              local: "Geist-Light",
              src: "./src/assets/fonts/geist/Geist-Light.woff2"
            },
            {
              name: "Geist-Medium",
              local: "Geist-Medium",
              src: "./src/assets/fonts/geist/Geist-Medium.woff2"
            },
            {
              name: "Geist-SemiBold",
              local: "Geist-SemiBold",
              src: "./src/assets/fonts/geist/Geist-SemiBold.woff2"
            },
            {
              name: "Geist-Bold",
              local: "Geist-Bold",
              src: "./src/assets/fonts/geist/Geist-Bold.woff2"
            },
            {
              name: "Geist-ExtraBold",
              local: "Geist-ExtraBold",
              src: "./src/assets/fonts/geist/Geist-ExtraBold.woff2"
            },
            {
              name: "Geist-Black",
              local: "Geist-Black",
              src: "./src/assets/fonts/geist/Geist-Black.woff2"
            }
          ],
          display: "swap",
          preload: true,
          injectTo: "head-prepend",
          prefetch: true
        }
      })
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
          }
        }
      }
    },
    server: {
      strictPort: true,
      port: 4e3,
      proxy: {
        "/api": {
          target: "http://127.0.0.1:5000",
          changeOrigin: true,
          secure: true
        }
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    optimizeDeps: {
      include: []
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxNZXJ0aGFuXFxcXEdpdEh1YlxcXFx3ZXBpZWNlc1xcXFxhcHBzXFxcXGNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcTWVydGhhblxcXFxHaXRIdWJcXFxcd2VwaWVjZXNcXFxcYXBwc1xcXFxjbGllbnRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L01lcnRoYW4vR2l0SHViL3dlcGllY2VzL2FwcHMvY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgVGFuU3RhY2tSb3V0ZXJWaXRlIH0gZnJvbSBcIkB0YW5zdGFjay9yb3V0ZXItcGx1Z2luL3ZpdGVcIjtcclxuaW1wb3J0IHsgZGVmYXVsdCBhcyByZWFjdCB9IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgVW5mb250cyBmcm9tIFwidW5wbHVnaW4tZm9udHMvdml0ZVwiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKCkgPT4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIHJlYWN0KCksXHJcbiAgICAgIFRhblN0YWNrUm91dGVyVml0ZSgpLFxyXG4gICAgICBVbmZvbnRzKHtcclxuICAgICAgICBjdXN0b206IHtcclxuICAgICAgICAgIGZhbWlsaWVzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkdlaXN0XCIsXHJcbiAgICAgICAgICAgICAgbG9jYWw6IFwiR2Vpc3RcIixcclxuICAgICAgICAgICAgICBzcmM6IFwiLi9zcmMvYXNzZXRzL2ZvbnRzL2dlaXN0L0dlaXN0VkYud29mZjJcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwiR2Vpc3QtTW9ub1wiLFxyXG4gICAgICAgICAgICAgIGxvY2FsOiBcIkdlaXN0LU1vbm9cIixcclxuICAgICAgICAgICAgICBzcmM6IFwiLi9zcmMvYXNzZXRzL2ZvbnRzL2dlaXN0L0dlaXN0TW9ub1ZGLndvZmYyXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkdlaXN0LVRoaW5cIixcclxuICAgICAgICAgICAgICBsb2NhbDogXCJHZWlzdC1UaGluXCIsXHJcbiAgICAgICAgICAgICAgc3JjOiBcIi4vc3JjL2Fzc2V0cy9mb250cy9nZWlzdC9HZWlzdC1UaGluLndvZmYyXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkdlaXN0LUV4dHJhTGlnaHRcIixcclxuICAgICAgICAgICAgICBsb2NhbDogXCJHZWlzdC1FeHRyYUxpZ2h0XCIsXHJcbiAgICAgICAgICAgICAgc3JjOiBcIi4vc3JjL2Fzc2V0cy9mb250cy9nZWlzdC9HZWlzdC1FeHRyYUxpZ2h0LndvZmYyXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkdlaXN0LUxpZ2h0XCIsXHJcbiAgICAgICAgICAgICAgbG9jYWw6IFwiR2Vpc3QtTGlnaHRcIixcclxuICAgICAgICAgICAgICBzcmM6IFwiLi9zcmMvYXNzZXRzL2ZvbnRzL2dlaXN0L0dlaXN0LUxpZ2h0LndvZmYyXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkdlaXN0LU1lZGl1bVwiLFxyXG4gICAgICAgICAgICAgIGxvY2FsOiBcIkdlaXN0LU1lZGl1bVwiLFxyXG4gICAgICAgICAgICAgIHNyYzogXCIuL3NyYy9hc3NldHMvZm9udHMvZ2Vpc3QvR2Vpc3QtTWVkaXVtLndvZmYyXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkdlaXN0LVNlbWlCb2xkXCIsXHJcbiAgICAgICAgICAgICAgbG9jYWw6IFwiR2Vpc3QtU2VtaUJvbGRcIixcclxuICAgICAgICAgICAgICBzcmM6IFwiLi9zcmMvYXNzZXRzL2ZvbnRzL2dlaXN0L0dlaXN0LVNlbWlCb2xkLndvZmYyXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkdlaXN0LUJvbGRcIixcclxuICAgICAgICAgICAgICBsb2NhbDogXCJHZWlzdC1Cb2xkXCIsXHJcbiAgICAgICAgICAgICAgc3JjOiBcIi4vc3JjL2Fzc2V0cy9mb250cy9nZWlzdC9HZWlzdC1Cb2xkLndvZmYyXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkdlaXN0LUV4dHJhQm9sZFwiLFxyXG4gICAgICAgICAgICAgIGxvY2FsOiBcIkdlaXN0LUV4dHJhQm9sZFwiLFxyXG4gICAgICAgICAgICAgIHNyYzogXCIuL3NyYy9hc3NldHMvZm9udHMvZ2Vpc3QvR2Vpc3QtRXh0cmFCb2xkLndvZmYyXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiBcIkdlaXN0LUJsYWNrXCIsXHJcbiAgICAgICAgICAgICAgbG9jYWw6IFwiR2Vpc3QtQmxhY2tcIixcclxuICAgICAgICAgICAgICBzcmM6IFwiLi9zcmMvYXNzZXRzL2ZvbnRzL2dlaXN0L0dlaXN0LUJsYWNrLndvZmYyXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgZGlzcGxheTogXCJzd2FwXCIsXHJcbiAgICAgICAgICBwcmVsb2FkOiB0cnVlLFxyXG4gICAgICAgICAgaW5qZWN0VG86IFwiaGVhZC1wcmVwZW5kXCIsXHJcbiAgICAgICAgICBwcmVmZXRjaDogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICB9KSxcclxuICAgIF0sXHJcbiAgICBjbGVhclNjcmVlbjogZmFsc2UsXHJcbiAgICBidWlsZDoge1xyXG4gICAgICBzb3VyY2VtYXA6IGZhbHNlLFxyXG4gICAgICBtaW5pZnk6IHRydWUsXHJcbiAgICAgIGNzc01pbmlmeTogdHJ1ZSxcclxuICAgICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgb253YXJuKHdhcm5pbmcsIGRlZmF1bHRIYW5kbGVyKSB7XHJcbiAgICAgICAgICBpZiAod2FybmluZy5jb2RlID09PSBcIlNPVVJDRU1BUF9FUlJPUlwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBkZWZhdWx0SGFuZGxlcih3YXJuaW5nKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XHJcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcIm5vZGVfbW9kdWxlc1wiKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBcInZlbmRvclwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIHN0cmljdFBvcnQ6IHRydWUsXHJcbiAgICAgIHBvcnQ6IDQwMDAsXHJcbiAgICAgIHByb3h5OiB7XHJcbiAgICAgICAgXCIvYXBpXCI6IHtcclxuICAgICAgICAgIHRhcmdldDogXCJodHRwOi8vMTI3LjAuMC4xOjUwMDBcIixcclxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgIHNlY3VyZTogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBvcHRpbWl6ZURlcHM6IHtcclxuICAgICAgaW5jbHVkZTogW10sXHJcbiAgICB9LFxyXG4gIH07XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdULFNBQVMsMEJBQTBCO0FBQ25WLFNBQVMsV0FBVyxhQUFhO0FBQ2pDLE9BQU8sVUFBVTtBQUNqQixPQUFPLGFBQWE7QUFDcEIsU0FBUyxvQkFBb0I7QUFKN0IsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhLE1BQU07QUFDaEMsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sbUJBQW1CO0FBQUEsTUFDbkIsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFVBQ04sVUFBVTtBQUFBLFlBQ1I7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLE9BQU87QUFBQSxjQUNQLEtBQUs7QUFBQSxZQUNQO0FBQUEsWUFDQTtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sT0FBTztBQUFBLGNBQ1AsS0FBSztBQUFBLFlBQ1A7QUFBQSxZQUNBO0FBQUEsY0FDRSxNQUFNO0FBQUEsY0FDTixPQUFPO0FBQUEsY0FDUCxLQUFLO0FBQUEsWUFDUDtBQUFBLFlBQ0E7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLE9BQU87QUFBQSxjQUNQLEtBQUs7QUFBQSxZQUNQO0FBQUEsWUFDQTtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sT0FBTztBQUFBLGNBQ1AsS0FBSztBQUFBLFlBQ1A7QUFBQSxZQUNBO0FBQUEsY0FDRSxNQUFNO0FBQUEsY0FDTixPQUFPO0FBQUEsY0FDUCxLQUFLO0FBQUEsWUFDUDtBQUFBLFlBQ0E7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLE9BQU87QUFBQSxjQUNQLEtBQUs7QUFBQSxZQUNQO0FBQUEsWUFDQTtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sT0FBTztBQUFBLGNBQ1AsS0FBSztBQUFBLFlBQ1A7QUFBQSxZQUNBO0FBQUEsY0FDRSxNQUFNO0FBQUEsY0FDTixPQUFPO0FBQUEsY0FDUCxLQUFLO0FBQUEsWUFDUDtBQUFBLFlBQ0E7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLE9BQU87QUFBQSxjQUNQLEtBQUs7QUFBQSxZQUNQO0FBQUEsVUFDRjtBQUFBLFVBQ0EsU0FBUztBQUFBLFVBQ1QsU0FBUztBQUFBLFVBQ1QsVUFBVTtBQUFBLFVBQ1YsVUFBVTtBQUFBLFFBQ1o7QUFBQSxNQUNGLENBQUM7QUFBQSxJQUNIO0FBQUEsSUFDQSxhQUFhO0FBQUEsSUFDYixPQUFPO0FBQUEsTUFDTCxXQUFXO0FBQUEsTUFDWCxRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUEsTUFDWCxjQUFjO0FBQUEsTUFDZCxlQUFlO0FBQUEsUUFDYixPQUFPLFNBQVMsZ0JBQWdCO0FBQzlCLGNBQUksUUFBUSxTQUFTLG1CQUFtQjtBQUN0QztBQUFBLFVBQ0Y7QUFFQSx5QkFBZSxPQUFPO0FBQUEsUUFDeEI7QUFBQSxRQUNBLFFBQVE7QUFBQSxVQUNOLGFBQWEsSUFBSTtBQUNmLGdCQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0IscUJBQU87QUFBQSxZQUNUO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sWUFBWTtBQUFBLE1BQ1osTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFVBQ04sUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3RDO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBLE1BQ1osU0FBUyxDQUFDO0FBQUEsSUFDWjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
