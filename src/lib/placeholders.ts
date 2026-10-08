import type { Locale } from '@/lib/i18n';

export function formatPlaceholder(text: string, locale: Locale) {
  return `PLACEHOLDER — ${text.toLocaleUpperCase(locale)} — FIN PLACEHOLDER`;
}

export function placeholderStart(text: string, locale: Locale) {
  return `INICIO PLACEHOLDER — ${text.toLocaleUpperCase(locale)}`;
}

export function placeholderEnd(text: string, locale: Locale) {
  return `FIN PLACEHOLDER — ${text.toLocaleUpperCase(locale)}`;
}
