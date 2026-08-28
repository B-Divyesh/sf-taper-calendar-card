import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

test('@claim:csv-export demo exports one log row per scheduled day', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Example medication' })).toBeVisible();
  const rows = await page.locator('.day').count();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await downloadPromise;
  const csv = readFileSync((await download.path())!, 'utf8');
  expect(rows).toBe(14);
  expect(download.suggestedFilename()).toBe('stepdown-log.csv');
  expect(csv.split('\n')).toHaveLength(rows + 1);
  expect(csv.startsWith('date,dose,step instructions,acknowledged at')).toBe(true);
});

test('@claim:offline-reload demo reloads offline after its first visit', async ({ context, page }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await page.waitForTimeout(1500);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Example medication' })).toBeVisible();
});

test('@claim:private-device demo uses no third-party requests', async ({ page }) => {
  const thirdParty: string[] = [];
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173')) thirdParty.push(request.url()); });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Check this day' }).first().click();
  await expect(page.getByRole('button', { name: 'Checked' }).first()).toBeVisible();
  expect(thirdParty).toEqual([]);
});
