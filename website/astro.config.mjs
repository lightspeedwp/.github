import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";

export default defineConfig({
  output: "static",
  site: "https://github.lightspeedwp.agency",
  integrations: [svelte()],
});
