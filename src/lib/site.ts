const configuredUrl = import.meta.env.PUBLIC_SITE_URL?.replace(/\/$/, '');

export const site = {
  name: 'Dr. Ronald Salazar',
  descriptor: 'Ginecología Integral',
  url: configuredUrl,
  defaultLocale: 'es' as const,
};

export function absoluteUrl(pathname: string) {
  return site.url ? new URL(pathname, `${site.url}/`).toString() : undefined;
}
