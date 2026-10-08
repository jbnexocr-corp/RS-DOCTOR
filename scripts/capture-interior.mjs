import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
const baseUrl = process.env.CAPTURE_URL ?? 'http://127.0.0.1:4322';
await mkdir('.qa', { recursive: true });

const routes = [
  ['profile', '/es/dr-ronald-salazar/'],
  ['surgery-page', '/es/cirugia-ginecologica/'],
  ['contact-page', '/es/contacto/'],
];

for (const viewport of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]) {
  for (const [name, route] of routes) {
    const page = await browser.newPage({ viewport });
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
    await page.locator('main').screenshot({ path: `.qa/${name}-${viewport.name}.png` });
    await page.close();
  }
}

await browser.close();
