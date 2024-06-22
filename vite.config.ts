import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { installGlobals } from "@remix-run/node";
import { flatRoutes } from "remix-flat-routes";

installGlobals();

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/*"],
      serverModuleFormat: "esm",
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes, {
          ignoredRouteFiles: [
            ".*",
            "**/*.css",
            "**/*.test.{js,jsx,ts,tsx}",
            "**/__*.*",
          ],
        });
      },
    }),
    tsconfigPaths(),
  ],
});
