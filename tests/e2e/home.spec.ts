import { expect, test } from '@playwright/test';

test('Spanish home has one H1 and working language switcher', async ({ page }) => {
  await page.goto('/es/');
  await expect(page.locator('main h1')).toHaveCount(1);
  await page.getByRole('link', { name: 'View in English' }).click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('home hero scrubs video with scroll instead of autoplay', async ({ page }) => {
  await page.goto('/es/');
  const hero = page.locator('[data-scroll-hero]');
  const video = hero.locator('video');

  await expect(hero).toHaveAttribute('data-hero-state', 'ready', { timeout: 15_000 });
  await expect(video).toHaveAttribute('muted', '');
  await expect(video).toHaveAttribute('playsinline', '');
  await expect(video).toHaveAttribute('preload', 'auto');
  await expect(video).not.toHaveAttribute('controls', /.*/);

  const before = await video.evaluate((element: HTMLVideoElement) => ({
    currentTime: element.currentTime,
    duration: element.duration,
    paused: element.paused,
  }));
  expect(before.duration).toBeGreaterThan(4);
  expect(before.paused).toBe(true);

  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.05, behavior: 'instant' }));
  await page.waitForTimeout(700);
  const after = await video.evaluate((element: HTMLVideoElement) => ({ currentTime: element.currentTime, paused: element.paused }));
  expect(after.currentTime).toBeGreaterThan(before.currentTime + 0.5);
  expect(after.paused).toBe(true);

  await hero.evaluate((element: HTMLElement) => {
    const distance = window.innerHeight * (window.innerWidth < 768 ? 1.45 : 1.9);
    window.scrollTo({ top: element.offsetTop + (distance * 0.68), behavior: 'instant' });
  });
  await expect(hero.locator('[data-scroll-hero-copy-secondary]')).toBeVisible();

  await hero.evaluate((element: HTMLElement) => {
    const distance = window.innerHeight * (window.innerWidth < 768 ? 1.45 : 1.9);
    window.scrollTo({ top: element.offsetTop + (distance * 0.96), behavior: 'instant' });
  });
  await expect.poll(async () => Number(await hero.locator('.scroll-hero-transition').evaluate((element) => getComputedStyle(element).opacity))).toBeGreaterThan(0.65);
});

test('header hides while scrolling down and returns while scrolling up', async ({ page }) => {
  await page.goto('/es/');
  const header = page.locator('[data-site-header]');

  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'instant' }));
  await expect(header).toHaveClass(/site-header-hidden/);

  await page.evaluate(() => window.scrollBy({ top: -260, behavior: 'instant' }));
  await expect(header).not.toHaveClass(/site-header-hidden/);
});

test('home hero uses its static poster when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/es/');
  const hero = page.locator('[data-scroll-hero]');
  await expect(hero).toHaveAttribute('data-hero-state', 'fallback');
  await expect(hero.locator('.scroll-hero-poster')).toBeVisible();
});

test('mobile navigation manages state and Escape', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile-only behavior');
  await page.goto('/es/');
  const menu = page.getByRole('button', { name: /Menú/ });
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('inner drafts are noindex and language links preserve the equivalent page', async ({ page }) => {
  await page.goto('/es/cirugia-ginecologica/');
  await expect(page.locator('main h1')).toHaveText('Cirugía ginecológica mínimamente invasiva');
  await expect(page.locator('.review-status')).toContainText('INICIO PLACEHOLDER');
  await expect(page.locator('.pending-banner')).toContainText('FIN PLACEHOLDER');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await page.getByRole('link', { name: 'View in English' }).click();
  await expect(page).toHaveURL(/\/en\/gynecological-surgery\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('primary interior routes return content without broken navigation', async ({ page }) => {
  for (const path of ['/es/dr-ronald-salazar/', '/es/servicios/', '/es/embarazo/recursos/', '/es/articulos/', '/es/contacto/']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1')).toHaveCount(1);
  }
});

test('contact page prioritizes the confirmed office channels and exposes contact schema', async ({ page }) => {
  await page.goto('/es/contacto/');

  const whatsapp = page.getByRole('link', { name: /Solicitar cita por WhatsApp/ }).first();
  await expect(whatsapp).toHaveAttribute('href', /^https:\/\/wa\.me\/50664297669\?text=/);
  await expect(page.getByRole('link', { name: /Llamar al consultorio/ })).toHaveAttribute('href', 'tel:+50664297669');
  await expect(page.getByRole('link', { name: /TikTok/ }).first()).toHaveAttribute('href', 'https://www.tiktok.com/@dr.ronaldvirtual');
  await expect(page.getByRole('link', { name: /Canal de WhatsApp/ }).first()).toHaveAttribute('href', 'https://whatsapp.com/channel/0029VbCVQ0L35fLzdPzd1o38');
  await expect(page.getByText(/INICIO PLACEHOLDER.*FACEBOOK.*FIN PLACEHOLDER/i).first()).toBeVisible();

  const schema = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(schema).toContain('+50664297669');
  expect(schema).toContain('FAQPage');
  expect(schema).toContain('ContactPage');
});

test('individual service pages expose structured content in both languages', async ({ page }) => {
  await page.goto('/es/servicios/histeroscopia/');
  await expect(page.getByRole('heading', { level: 1, name: 'Histeroscopía' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Solicitar valoración' })).toBeVisible();
  await page.getByRole('link', { name: 'View in English' }).click();
  await expect(page).toHaveURL(/\/en\/services\/hysteroscopy\/$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Hysteroscopy' })).toBeVisible();
});

test('admin supports local CRUD and persists a new record', async ({ page }) => {
  await page.goto('/admin/');
  await expect(page.getByRole('heading', { name: 'Panel de administración' })).toBeVisible();
  await page.getByRole('button', { name: 'Nuevo contenido' }).click();
  await page.getByLabel('Título').fill('Artículo de prueba editorial');
  await page.getByLabel('Slug').fill('articulo-prueba-editorial');
  await page.getByLabel('Resumen').fill('Registro de prueba del flujo CRUD local.');
  await page.getByRole('button', { name: 'Guardar registro' }).click();
  await page.getByRole('button', { name: 'Contenido', exact: true }).click();
  await expect(page.getByRole('cell', { name: /Artículo de prueba editorial/ })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Contenido', exact: true }).click();
  await expect(page.getByRole('cell', { name: /Artículo de prueba editorial/ })).toBeVisible();
});
