import { chromium } from '@playwright/test';

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: false,
  args: ['--start-maximized'],
});

const context = await browser.newContext({ viewport: null });
const page = await context.newPage();
await page.goto('http://127.0.0.1:4321/es/', { waitUntil: 'networkidle' });
console.log('Preview abierto en http://127.0.0.1:4321/es/');

browser.on('disconnected', () => process.exit(0));
await new Promise(() => {});
