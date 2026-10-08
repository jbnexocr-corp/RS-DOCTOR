import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
});
const baseUrl = process.env.CAPTURE_URL ?? 'http://127.0.0.1:4321';

await mkdir('.qa', { recursive: true });

for (const viewport of [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport });
  await page.goto(`${baseUrl}/es/`, { waitUntil: 'networkidle' });
  for (const section of ['#doctor', '#cirugia']) {
    await page.locator(section).scrollIntoViewIfNeeded();
    await page.waitForFunction((selector) => Array.from(document.querySelectorAll(`${selector} img`)).every((image) => image.complete && image.naturalWidth > 0), section);
    await page.locator(section).screenshot({ path: `.qa/${section.slice(1)}-${viewport.name}.png` });
  }
  const imageState = await page.locator('img').evaluateAll((images) => images.map((image) => ({ alt: image.alt, complete: image.complete, width: image.naturalWidth })));
  if (imageState.some((image) => !image.complete || image.width === 0)) throw new Error(`Images not ready: ${JSON.stringify(imageState)}`);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `.qa/home-${viewport.name}.png`, fullPage: true });
  await page.close();
}

await browser.close();
