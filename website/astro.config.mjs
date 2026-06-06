import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://github.lightspeedwp.agency',
  base: '/awesome-github',
  output: 'static',
  integrations: [sitemap()],
  build: {
    assets: '_assets',
  },
});
