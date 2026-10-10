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
      const distance = window.innerHeight * 1.45;
      window.scrollTo({ top: element.offsetTop + (distance * 0.68), behavior: 'instant' });
    });

    await expect.poll(async () => secondaryCopy.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity))).toBeGreaterThan(0.75);
    await expect.poll(async () => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(initialTime + 0.2);

    await hero.evaluate((element: HTMLElement) => {
      const distance = window.innerHeight * 1.45;
      window.scrollTo({ top: element.offsetTop + (distance * 0.97), behavior: 'instant' });
    });

    await expect.poll(async () => transition.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity))).toBeGreaterThan(0.75);
  });
}

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
    const distance = window.innerHeight * 1.45;
    window.scrollTo({ top: element.offsetTop + (distance * 0.68), behavior: 'instant' });
  });

  await expect.poll(async () => secondaryCopy.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity))).toBeGreaterThan(0.75);
});
