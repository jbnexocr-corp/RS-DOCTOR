import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
const baseUrl = process.env.CAPTURE_URL ?? 'http://127.0.0.1:4321';
await mkdir('.qa', { recursive: true });

const captures = [
  { path: '/admin/', file: 'admin-full.png', viewport: { width: 1440, height: 1000 } },
  { path: '/es/', file: 'home-animated.png', viewport: { width: 1440, height: 1000 } },
  { path: '/es/servicios/histeroscopia/', file: 'service-mobile.png', viewport: { width: 390, height: 844 } },
];

for (const capture of captures) {
  const page = await browser.newPage({ viewport: capture.viewport, reducedMotion: 'no-preference' });
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${baseUrl}${capture.path}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(250);
  await page.screenshot({ path: `.qa/${capture.file}`, fullPage: true });
  if (errors.length) throw new Error(`${capture.path}: ${errors.join(' | ')}`);
  await page.close();
}

await browser.close();
