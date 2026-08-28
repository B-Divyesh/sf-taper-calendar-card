import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: './e2e', timeout: 30000, use: { baseURL: 'http://127.0.0.1:4173', browserName: 'chromium', headless: true }, webServer: { command: 'npm run build && npm run preview', url: 'http://127.0.0.1:4173', reuseExistingServer: false } });
