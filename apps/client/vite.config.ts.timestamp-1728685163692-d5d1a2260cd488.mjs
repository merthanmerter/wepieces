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
              src: "./src/assets/fonts/geist/GeistVF.woff2"
            },
            {
              name: "Geist-Mono",
              src: "./src/assets/fonts/geist/GeistMonoVF.woff2"
            },
            {
              name: "Geist-Thin",
              src: "./src/assets/fonts/geist/Geist-Thin.woff2"
            },
            {
              name: "Geist-ExtraLight",
              src: "./src/assets/fonts/geist/Geist-ExtraLight.woff2"
            },
            {
              name: "Geist-Light",
              src: "./src/assets/fonts/geist/Geist-Light.woff2"
            },
            {
              name: "Geist-Medium",
              src: "./src/assets/fonts/geist/Geist-Medium.woff2"
            },
            {
              name: "Geist-SemiBold",
              src: "./src/assets/fonts/geist/Geist-SemiBold.woff2"
            },
            {
              name: "Geist-Bold",
              src: "./src/assets/fonts/geist/Geist-Bold.woff2"
            },
            {
              name: "Geist-ExtraBold",
              src: "./src/assets/fonts/geist/Geist-ExtraBold.woff2"
            },
            {
              name: "Geist-Black",
              src: "./src/assets/fonts/geist/Geist-Black.woff2"
            }
          ]
        }
      })
    ],
    clearScreen: false,
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxNZXJ0aGFuXFxcXEdpdEh1YlxcXFx3ZXBpZWNlc1xcXFxhcHBzXFxcXGNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcTWVydGhhblxcXFxHaXRIdWJcXFxcd2VwaWVjZXNcXFxcYXBwc1xcXFxjbGllbnRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L01lcnRoYW4vR2l0SHViL3dlcGllY2VzL2FwcHMvY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgVGFuU3RhY2tSb3V0ZXJWaXRlIH0gZnJvbSBcIkB0YW5zdGFjay9yb3V0ZXItcGx1Z2luL3ZpdGVcIjtcbmltcG9ydCB7IGRlZmF1bHQgYXMgcmVhY3QgfSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgVW5mb250cyBmcm9tIFwidW5wbHVnaW4tZm9udHMvdml0ZVwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgcmVhY3QoKSxcbiAgICAgIFRhblN0YWNrUm91dGVyVml0ZSgpLFxuICAgICAgVW5mb250cyh7XG4gICAgICAgIGN1c3RvbToge1xuICAgICAgICAgIGZhbWlsaWVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiR2Vpc3RcIixcbiAgICAgICAgICAgICAgc3JjOiBcIi4vc3JjL2Fzc2V0cy9mb250cy9nZWlzdC9HZWlzdFZGLndvZmYyXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkdlaXN0LU1vbm9cIixcbiAgICAgICAgICAgICAgc3JjOiBcIi4vc3JjL2Fzc2V0cy9mb250cy9nZWlzdC9HZWlzdE1vbm9WRi53b2ZmMlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJHZWlzdC1UaGluXCIsXG4gICAgICAgICAgICAgIHNyYzogXCIuL3NyYy9hc3NldHMvZm9udHMvZ2Vpc3QvR2Vpc3QtVGhpbi53b2ZmMlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJHZWlzdC1FeHRyYUxpZ2h0XCIsXG4gICAgICAgICAgICAgIHNyYzogXCIuL3NyYy9hc3NldHMvZm9udHMvZ2Vpc3QvR2Vpc3QtRXh0cmFMaWdodC53b2ZmMlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJHZWlzdC1MaWdodFwiLFxuICAgICAgICAgICAgICBzcmM6IFwiLi9zcmMvYXNzZXRzL2ZvbnRzL2dlaXN0L0dlaXN0LUxpZ2h0LndvZmYyXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkdlaXN0LU1lZGl1bVwiLFxuICAgICAgICAgICAgICBzcmM6IFwiLi9zcmMvYXNzZXRzL2ZvbnRzL2dlaXN0L0dlaXN0LU1lZGl1bS53b2ZmMlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJHZWlzdC1TZW1pQm9sZFwiLFxuICAgICAgICAgICAgICBzcmM6IFwiLi9zcmMvYXNzZXRzL2ZvbnRzL2dlaXN0L0dlaXN0LVNlbWlCb2xkLndvZmYyXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkdlaXN0LUJvbGRcIixcbiAgICAgICAgICAgICAgc3JjOiBcIi4vc3JjL2Fzc2V0cy9mb250cy9nZWlzdC9HZWlzdC1Cb2xkLndvZmYyXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcIkdlaXN0LUV4dHJhQm9sZFwiLFxuICAgICAgICAgICAgICBzcmM6IFwiLi9zcmMvYXNzZXRzL2ZvbnRzL2dlaXN0L0dlaXN0LUV4dHJhQm9sZC53b2ZmMlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJHZWlzdC1CbGFja1wiLFxuICAgICAgICAgICAgICBzcmM6IFwiLi9zcmMvYXNzZXRzL2ZvbnRzL2dlaXN0L0dlaXN0LUJsYWNrLndvZmYyXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICBdLFxuICAgIGNsZWFyU2NyZWVuOiBmYWxzZSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgICBwb3J0OiA0MDAwLFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgXCIvYXBpXCI6IHtcbiAgICAgICAgICB0YXJnZXQ6IFwiaHR0cDovLzEyNy4wLjAuMTo1MDAwXCIsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHNlY3VyZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFtdLFxuICAgIH0sXG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ1QsU0FBUywwQkFBMEI7QUFDblYsU0FBUyxXQUFXLGFBQWE7QUFDakMsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sYUFBYTtBQUNwQixTQUFTLG9CQUFvQjtBQUo3QixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWEsTUFBTTtBQUNoQyxTQUFPO0FBQUEsSUFDTCxTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixtQkFBbUI7QUFBQSxNQUNuQixRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsVUFDTixVQUFVO0FBQUEsWUFDUjtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sS0FBSztBQUFBLFlBQ1A7QUFBQSxZQUNBO0FBQUEsY0FDRSxNQUFNO0FBQUEsY0FDTixLQUFLO0FBQUEsWUFDUDtBQUFBLFlBQ0E7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLEtBQUs7QUFBQSxZQUNQO0FBQUEsWUFDQTtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sS0FBSztBQUFBLFlBQ1A7QUFBQSxZQUNBO0FBQUEsY0FDRSxNQUFNO0FBQUEsY0FDTixLQUFLO0FBQUEsWUFDUDtBQUFBLFlBQ0E7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLEtBQUs7QUFBQSxZQUNQO0FBQUEsWUFDQTtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sS0FBSztBQUFBLFlBQ1A7QUFBQSxZQUNBO0FBQUEsY0FDRSxNQUFNO0FBQUEsY0FDTixLQUFLO0FBQUEsWUFDUDtBQUFBLFlBQ0E7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLEtBQUs7QUFBQSxZQUNQO0FBQUEsWUFDQTtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sS0FBSztBQUFBLFlBQ1A7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLGFBQWE7QUFBQSxJQUNiLFFBQVE7QUFBQSxNQUNOLFlBQVk7QUFBQSxNQUNaLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxVQUNOLFFBQVE7QUFBQSxVQUNSLGNBQWM7QUFBQSxVQUNkLFFBQVE7QUFBQSxRQUNWO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUN0QztBQUFBLElBQ0Y7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLFNBQVMsQ0FBQztBQUFBLElBQ1o7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
