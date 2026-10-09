import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

const previewHosts = process.env.PUBLIC_PREVIEW_HOST
  ?.split(',')
  .map((host) => host.trim())
  .filter(Boolean);

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
    bodySizeLimit: 10 * 1024 * 1024,
  }),
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  security: { checkOrigin: true },
  server: {
    allowedHosts: previewHosts ?? [],
  },
  vite: {
    build: { cssMinify: 'lightningcss' }
  }
});
