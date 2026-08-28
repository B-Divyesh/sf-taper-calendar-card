import { defineConfig } from '@playwright/test';
const liveBaseURL = process.env.PLAYWRIGHT_BASE_URL;
export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: { baseURL: liveBaseURL || 'http://127.0.0.1:4173', browserName: 'chromium', headless: true },
  webServer: liveBaseURL ? undefined : { command: 'npm run build && npm run preview', url: 'http://127.0.0.1:4173', reuseExistingServer: false }
});
