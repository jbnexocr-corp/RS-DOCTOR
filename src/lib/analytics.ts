export type AnalyticsEvent =
  | 'click_whatsapp'
  | 'click_phone'
  | 'form_submit_success'
  | 'click_book_amazon'
  | 'click_prenatal_course';

export function trackEvent(
  name: AnalyticsEvent,
  parameters: { placement?: string; component?: string; destination?: string } = {},
) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('site:analytics', { detail: { name, parameters } }));
}
