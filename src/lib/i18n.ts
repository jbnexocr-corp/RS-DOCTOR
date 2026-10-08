export type Locale = 'es' | 'en';

export const locales: Locale[] = ['es', 'en'];

export function localePath(locale: Locale, path = '') {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return `/${locale}/${clean ? `${clean}/` : ''}`;
}

export function alternateLocale(locale: Locale): Locale {
  return locale === 'es' ? 'en' : 'es';
}
