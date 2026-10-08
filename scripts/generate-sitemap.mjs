import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative, sep } from 'node:path';

const configuredUrl = process.env.PUBLIC_SITE_URL?.replace(/\/$/, '');
if (!configuredUrl) {
  console.log('[sitemap] PUBLIC_SITE_URL no está configurada; se generará al definir el dominio.');
  process.exit(0);
}

const root = fileURLToPath(new URL('../dist/', import.meta.url));
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]));
  return nested.flat();
}

const files = await walk(root);
const urls = files
  .filter((file) => file.endsWith(`${sep}index.html`))
  .map((file) => relative(root, file).split(sep).join('/').replace(/index\.html$/, ''))
  .filter((pathname) => pathname && !pathname.startsWith('admin/'))
  .map((pathname) => `${configuredUrl}/${pathname}`);

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(join(root, 'sitemap.xml'), xml, 'utf8');
const robotsPath = join(root, 'robots.txt');
const robots = await readFile(robotsPath, 'utf8');
await writeFile(robotsPath, `${robots.replace(/\n?# Sitemap[^\n]*/g, '').trim()}\n\nSitemap: ${configuredUrl}/sitemap.xml\n`, 'utf8');
console.log(`[sitemap] ${urls.length} URLs generadas.`);
