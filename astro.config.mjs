import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import { loadEnv } from 'vite';

const localEnv = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
for (const [key, value] of Object.entries(localEnv)) process.env[key] ||= value;
const splitList = (value) => (value ?? '').split(',').map((item) => item.trim()).filter(Boolean);
const previewHosts = splitList(process.env.PUBLIC_PREVIEW_HOST);

// Railway termina HTTPS en su proxy y reenvía la solicitud por HTTP. Astro solo
// confía en X-Forwarded-Host/Proto para los dominios declarados aquí; sin esta
// lista, la URL interna sería http://localhost y el login fallaría por origen.
const toHostname = (value) => {
  const host = value.replace(/^[a-z]+:\/\//i, '').split('/')[0].split(':')[0].toLowerCase();
  if (!host) return undefined;
  return host.startsWith('.') ? `**${host}` : host;
};
const trustedHosts = new Set([
  '**.up.railway.app',
  ...[
    process.env.PUBLIC_SITE_URL,
    process.env.RAILWAY_PUBLIC_DOMAIN,
    ...splitList(process.env.ALLOWED_HOSTS),
    ...previewHosts,
  ].filter(Boolean).map(toHostname).filter(Boolean),
]);

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
    bodySizeLimit: 10 * 1024 * 1024,
  }),
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  security: {
    checkOrigin: true,
    allowedDomains: [
      { hostname: 'localhost' },
      { hostname: '127.0.0.1' },
      ...[...trustedHosts].map((hostname) => ({ hostname, protocol: 'https' })),
    ],
  },
  server: {
    allowedHosts: previewHosts,
  },
  vite: {
    build: { cssMinify: 'lightningcss' },
  },
});
