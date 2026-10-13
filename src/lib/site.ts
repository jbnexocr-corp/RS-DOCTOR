const railwayUrl = process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : '';
// process.env se lee al iniciar el servidor (y al compilar las páginas
// prerenderizadas); import.meta.env queda como respaldo para valores del build.
const configuredUrl = (process.env.PUBLIC_SITE_URL || import.meta.env.PUBLIC_SITE_URL || railwayUrl).trim().replace(/\/$/, '') || undefined;

export const site = {
  name: 'Dr. Ronald Salazar',
  descriptor: 'Ginecología Integral',
  url: configuredUrl,
  defaultLocale: 'es' as const,
};

/**
 * Las páginas interiores y de servicio siguen en borrador hasta recibir
 * aprobación médica y legal. Al cambiar este valor se vuelven indexables y
 * entran automáticamente al sitemap.
 */
export const draftPagesNoindex = true;

export function absoluteUrl(pathname: string) {
  return site.url ? new URL(pathname, `${site.url}/`).toString() : undefined;
}

export function siteOrigin(requestUrl: URL) {
  return site.url ?? requestUrl.origin;
}
