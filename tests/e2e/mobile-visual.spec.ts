import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'compact-phone', width: 320, height: 568 },
  { name: 'small-phone', width: 360, height: 640 },
  { name: 'tall-phone', width: 390, height: 844 },
  { name: 'android-wide', width: 412, height: 915 },
] as const;

for (const viewport of viewports) {
  test(`mobile scroll hero remains responsive on ${viewport.name}`, async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only responsive coverage.');

    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/es/');

    const hero = page.locator('[data-scroll-hero]');
    const stage = hero.locator('.scroll-hero-stage');
    const video = hero.locator('[data-scroll-hero-video]');
    const secondaryCopy = hero.locator('[data-scroll-hero-copy-secondary]');
    const transition = hero.locator('.scroll-hero-transition');

    await expect(hero).toHaveAttribute('data-hero-state', 'ready', { timeout: 15_000 });

    const selectedVideo = await video.evaluate((element: HTMLVideoElement) => ({
      src: element.currentSrc,
      width: element.videoWidth,
      height: element.videoHeight,
    }));
    expect(selectedVideo.src).toContain('dr-ronald-hero-scroll-mobile');
    expect(selectedVideo.width).toBe(720);
    expect(selectedVideo.height).toBe(1280);

    const layout = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      viewportHeight: window.innerHeight,
    }));
    const stageBox = await stage.boundingBox();

    expect(layout.scrollWidth).toBe(layout.clientWidth);
    expect(stageBox).not.toBeNull();
    expect(Math.abs((stageBox?.height ?? 0) - layout.viewportHeight)).toBeLessThanOrEqual(2);

    const initialTime = await video.evaluate((element: HTMLVideoElement) => element.currentTime);
    await hero.evaluate((element: HTMLElement) => {
      const distance = window.innerHeight * 1.1;
      window.scrollTo({ top: element.offsetTop + (distance * 0.68), behavior: 'instant' });
    });

    await expect.poll(async () => secondaryCopy.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity))).toBeGreaterThan(0.75);
    await expect.poll(async () => video.evaluate((element: HTMLVideoElement) => element.currentTime), { timeout: 10_000 }).toBeGreaterThan(initialTime + 0.2);

    await hero.evaluate((element: HTMLElement) => {
      const distance = window.innerHeight * 1.1;
      window.scrollTo({ top: element.offsetTop + (distance * 0.97), behavior: 'instant' });
    });

    await expect.poll(async () => transition.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity))).toBeGreaterThan(0.55);
  });
}

test('mobile narrative starts before the video finishes loading', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile-only loading coverage.');

  await page.route('**/*.mp4', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2_500));
    await route.continue();
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/es/', { waitUntil: 'domcontentloaded' });

  const hero = page.locator('[data-scroll-hero]');
  const secondaryCopy = hero.locator('[data-scroll-hero-copy-secondary]');
  await expect(hero).toHaveAttribute('data-hero-state', 'loading');
  await hero.evaluate((element: HTMLElement) => {
    const distance = window.innerHeight * 1.1;
    window.scrollTo({ top: element.offsetTop + (distance * 0.68), behavior: 'instant' });
  });

  await expect.poll(async () => secondaryCopy.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity))).toBeGreaterThan(0.75);
});

test('data-saver fallback preserves the pinned mobile narrative', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile-only fallback coverage.');

  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true },
    });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/es/');

  const hero = page.locator('[data-scroll-hero]');
  const poster = hero.locator('.scroll-hero-poster');
  const secondaryCopy = hero.locator('[data-scroll-hero-copy-secondary]');

  await expect(hero).toHaveAttribute('data-hero-state', 'fallback');
  await expect(poster).toBeVisible();
  await hero.evaluate((element: HTMLElement) => {
    const distance = window.innerHeight * 1.1;
    window.scrollTo({ top: element.offsetTop + (distance * 0.68), behavior: 'instant' });
  });

  await expect.poll(async () => secondaryCopy.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity))).toBeGreaterThan(0.75);
});

test('mobile hero renders frames when autoplay is unavailable', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile-only media policy coverage.');

  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('Autoplay blocked', 'NotAllowedError'));
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/es/');

  const hero = page.locator('[data-scroll-hero]');
  const canvas = hero.locator('[data-scroll-hero-canvas]');
  const video = hero.locator('[data-scroll-hero-video]');
  await expect(hero).toHaveAttribute('data-hero-state', 'ready', { timeout: 15_000 });

  const sample = () => canvas.evaluate((element: HTMLCanvasElement) => {
    const probe = document.createElement('canvas');
    probe.width = 96;
    probe.height = 54;
    const context = probe.getContext('2d', { willReadFrequently: true });
    context?.drawImage(element, 0, 0, probe.width, probe.height);
    return context ? Array.from(context.getImageData(0, 0, probe.width, probe.height).data) : [];
  });

  const before = await sample();
  await hero.evaluate((element: HTMLElement) => {
    window.scrollTo({ top: element.offsetTop + (window.innerHeight * 0.9), behavior: 'instant' });
  });
  await expect.poll(async () => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(1);
  await expect.poll(async () => {
    const after = await sample();
    return before.reduce((total, channel, index) => total + Math.abs(channel - after[index]), 0) / before.length;
  }, { timeout: 4_000 }).toBeGreaterThan(2);
  await expect.poll(async () => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
});

test('reveal animations leave every block aligned on mobile', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile-only motion coverage.');
  test.setTimeout(90_000);

  for (const path of ['/es/', '/en/', '/es/contacto/', '/es/gineco-obstetricia/', '/es/servicios/histeroscopia/']) {
    await page.goto(path);
    await page.evaluate(async () => {
      // La altura crece mientras se pintan las secciones; se avanza hasta el final real.
      let previous = -1;
      for (let step = 0; step < 120 && previous !== window.scrollY; step += 1) {
        if (Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2) break;
        previous = window.scrollY;
        window.scrollBy({ top: 300, behavior: 'instant' });
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
    });
    await expect.poll(async () => page.evaluate(() => {
      const offsetOf = (element: Element) => {
        const transform = getComputedStyle(element).transform;
        if (transform === 'none') return 0;
        const values = transform.match(/^matrix\(([^)]+)\)$/)?.[1].split(',').map(Number);
        if (!values) return 999;
        const [a, b, c, d, x, y] = values;
        return Math.abs(a - 1) + Math.abs(b) + Math.abs(c) + Math.abs(d - 1) > 0.003 ? 999 : Math.max(Math.abs(x), Math.abs(y));
      };
      const revealed = [...document.querySelectorAll('.motion-reveal')].filter((element) => !element.closest('[data-scroll-hero]'));
      const label = (element: Element) => `${element.tagName.toLowerCase()} «${(element.textContent ?? '').trim().slice(0, 30)}» ${getComputedStyle(element).transform}`;
      return [
        ...[...document.querySelectorAll('.motion-reveal .motion-reveal')].map((element) => `anidado: ${label(element)}`),
        ...revealed.filter((element) => !element.classList.contains('motion-visible') || offsetOf(element) > 0.5).map(label),
      ];
    }), { timeout: 5_000, message: `${path} has misaligned or nested reveal blocks` }).toEqual([]);
  }
});
