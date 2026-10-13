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
  const canvas = hero.locator('[data-scroll-hero-canvas]');

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
  const beforePixels = await canvas.evaluate((element: HTMLCanvasElement) => {
    const probe = document.createElement('canvas');
    probe.width = 96;
    probe.height = 54;
    const context = probe.getContext('2d', { willReadFrequently: true });
    context?.drawImage(element, 0, 0, probe.width, probe.height);
    return context ? Array.from(context.getImageData(0, 0, probe.width, probe.height).data) : [];
  });
  expect(before.duration).toBeGreaterThan(4);
  expect(before.paused).toBe(true);

  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.05, behavior: 'instant' }));
  await expect.poll(
    async () => video.evaluate((element: HTMLVideoElement) => element.currentTime),
    { timeout: 4_000 },
  ).toBeGreaterThan(before.currentTime + 0.5);
  const after = await video.evaluate((element: HTMLVideoElement) => ({
    currentTime: element.currentTime,
    paused: element.paused,
  }));
  expect(after.currentTime).toBeGreaterThan(before.currentTime + 0.5);
  expect(after.paused).toBe(true);
  // currentTime cambia al asignarlo, pero el canvas se redibuja en el evento
  // `seeked`; se espera ese redibujo en lugar de tomar una sola muestra.
  await expect.poll(async () => {
    const afterPixels = await canvas.evaluate((element: HTMLCanvasElement) => {
      const probe = document.createElement('canvas');
      probe.width = 96;
      probe.height = 54;
      const context = probe.getContext('2d', { willReadFrequently: true });
      context?.drawImage(element, 0, 0, probe.width, probe.height);
      return context ? Array.from(context.getImageData(0, 0, probe.width, probe.height).data) : [];
    });
    return beforePixels.reduce((total, channel, index) => total + Math.abs(channel - afterPixels[index]), 0) / beforePixels.length;
  }, { timeout: 4_000 }).toBeGreaterThan(2);

  await hero.evaluate((element: HTMLElement) => {
    const distance = window.innerHeight * (window.innerWidth < 768 ? 1.3 : 1.7);
    window.scrollTo({ top: element.offsetTop + (distance * 0.68), behavior: 'instant' });
  });
  await expect(hero.locator('[data-scroll-hero-copy-secondary]')).toBeVisible();

  await hero.evaluate((element: HTMLElement) => {
    const distance = window.innerHeight * (window.innerWidth < 768 ? 1.3 : 1.7);
    window.scrollTo({ top: element.offsetTop + (distance * 0.96), behavior: 'instant' });
  });
  const transition = hero.locator('.scroll-hero-transition');
  await expect.poll(async () => Number(await transition.evaluate((element) => getComputedStyle(element).opacity))).toBeGreaterThan(0.4);
  await expect(transition).toHaveCSS('background-image', /linear-gradient/);
});

test('public pages use real brand icons and no decorative arrows', async ({ page }) => {
  for (const path of ['/es/', '/es/contacto/', '/es/cirugia-ginecologica/', '/es/servicios/histeroscopia/']) {
    await page.goto(path);
    expect(await page.locator('body').innerText()).not.toMatch(/[→↗←↘]/);
  }
  await page.goto('/es/contacto/');
  for (const network of ['instagram', 'tiktok', 'whatsappChannel', 'facebook']) {
    await expect(page.locator(`.social-links-contact [data-social="${network}"] svg.brand-icon`)).toHaveCount(1);
  }
  await expect(page.locator('.contact-action-primary svg.brand-icon')).toHaveCount(1);
  await expect(page.locator('.social-link-mark').first()).not.toContainText(/[A-Z]{2}/);
});

test('header hides while scrolling down and returns while scrolling up', async ({ page }) => {
  await page.goto('/es/');
  const header = page.locator('[data-site-header]');

  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'instant' }));
  await expect(header).toHaveClass(/site-header-hidden/);

  await page.evaluate(() => window.scrollBy({ top: -260, behavior: 'instant' }));
  await expect(header).not.toHaveClass(/site-header-hidden/);
});

test('content remains visible when IntersectionObserver does not report entries', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      value: class {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() { return []; }
        root = null;
        rootMargin = '0px';
        thresholds = [0];
      },
    });
  });
  await page.goto('/es/');

  await expect(page.locator('main > section.motion-reveal')).toHaveCount(0);
  const servicesTitle = page.locator('#services-title');
  await servicesTitle.scrollIntoViewIfNeeded();
  await expect.poll(async () => servicesTitle.evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
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
  const navigation = page.locator('#primary-navigation');
  await expect(navigation).toBeVisible();
  for (const label of ['Inicio', 'Dr. Ronald', 'Embarazo y recursos', 'Artículos', 'Contacto', 'Solicitar cita']) {
    await expect(navigation.getByText(label, { exact: true })).toBeInViewport();
  }
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
  const dialog = page.locator('#record-dialog');
  const title = dialog.locator('input[name="title"]');
  const slug = dialog.locator('input[name="slug"]');
  const summary = dialog.locator('textarea[name="summary"]');
  await title.fill('Artículo de prueba editorial');
  await slug.fill('articulo-prueba-editorial');
  await summary.fill('Registro de prueba del flujo CRUD local.');
  await expect(title).toHaveValue('Artículo de prueba editorial');
  await expect(slug).toHaveValue('articulo-prueba-editorial');
  await page.getByRole('button', { name: 'Guardar registro' }).click();
  await expect(dialog).not.toHaveAttribute('open', '');
  await page.getByRole('button', { name: 'Contenido', exact: true }).click();
  await expect(page.getByRole('cell', { name: /Artículo de prueba editorial/ })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Contenido', exact: true }).click();
  await expect(page.getByRole('cell', { name: /Artículo de prueba editorial/ })).toBeVisible();
});

test('deployment endpoints expose health, robots and dynamic sitemap', async ({ request }) => {
  const health = await request.get('/api/health/');
  expect(health.status()).toBe(200);
  expect(health.headers()['cache-control']).toBe('no-store');
  expect(await health.json()).toMatchObject({
    ok: true,
    database: 'not-configured',
    objectStorage: 'not-configured',
  });

  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain('Disallow: /admin/');

  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const sitemapXml = await sitemap.text();
  expect(sitemapXml).toContain('/es/');
  expect(sitemapXml).toContain('/es/articulos/');
});

test('HTML is revalidated on every visit so deploys show up without cache-busting links', async ({ request }) => {
  for (const path of ['/es/', '/es/articulos/']) {
    const page = await request.get(path);
    expect(page.headers()['cache-control']).toBe('no-cache');
    const etag = page.headers()['etag'];
    expect(etag).toBeTruthy();
    const again = await request.get(path, { headers: { 'If-None-Match': etag } });
    expect(again.status()).toBe(304);
  }
});

test('an unpublished article slug returns 404', async ({ request }) => {
  const response = await request.get('/es/articulos/articulo-inexistente/');
  expect(response.status()).toBe(404);
});
