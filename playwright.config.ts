import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  webServer: { command: 'npm run dev -- --host 127.0.0.1 --port 4322', url: 'http://127.0.0.1:4322/es/', reuseExistingServer: false, env: { ADMIN_AUTH_DISABLED: 'true' } },
  use: {
    baseURL: 'http://127.0.0.1:4322',
    trace: 'on-first-retry',
    launchOptions: { executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
