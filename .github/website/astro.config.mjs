import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://github.lightspeedwp.agency',
  output: 'static',
  build: {
    assets: '_assets',
  },
});
