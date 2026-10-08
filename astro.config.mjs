import { defineConfig } from 'astro/config';

const previewHosts = process.env.PUBLIC_PREVIEW_HOST
  ?.split(',')
  .map((host) => host.trim())
  .filter(Boolean);

export default defineConfig({
  output: 'static',
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
