import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

const expectedOrigin = new URL(process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173').origin;

async function createCard(page: Page, options: { start?: string; end?: string; dose?: string } = {}) {
  const start = options.start || '2026-12-31';
  const end = options.end || '2027-01-02';
  await page.goto('/');
  await page.getByLabel('Medication or treatment name').fill('Prednisone');
  await page.getByLabel('Clinician instructions, copied exactly').fill('Take exactly as written by Dr. Rivera.');
  await page.getByLabel('Start').fill(start);
  await page.getByLabel('End').fill(end);
  await page.getByLabel('Exact dose').fill(options.dose || '10 mg once daily');
  await page.getByRole('button', { name: 'Save this card' }).click();
  await expect(page.getByRole('heading', { name: 'Prednisone' })).toBeVisible();
}

async function waitForEncryptedCard(page: Page) {
  await page.waitForFunction(async () => {
    const request = indexedDB.open('stepdown-card', 1);
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return new Promise<boolean>(resolve => {
      const transaction = db.transaction('cards');
      const cards = transaction.objectStore('cards');
      const sealed = cards.get('stepdown:real:sealed');
      const plain = cards.get('stepdown:real:schedule');
      transaction.oncomplete = () => resolve(Boolean(sealed.result) && plain.result === undefined);
    });
  });
}

test('@claim:csv-export exports one log row per scheduled day', async ({ page }) => {
  await page.goto('/demo');
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

test('@claim:offline-reload reloads the demo without a network after its first visit', async ({ context, page }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Prednisone — sample' })).toBeVisible();
});

test('@claim:private-device stores and restores a real card without third-party traffic', async ({ page }) => {
  const thirdParty: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== expectedOrigin) thirdParty.push(request.url());
  });
  await createCard(page);
  await page.getByRole('button', { name: 'Check this day' }).first().click();
  await expect(page.getByRole('button', { name: 'Checked' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Prednisone' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Checked' })).toHaveCount(1);
  expect(thirdParty).toEqual([]);
});

test('@claim:backup-roundtrip exports and restores a complete JSON backup', async ({ page }) => {
  await createCard(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup' }).click();
  const download = await downloadPromise;
  const backup = readFileSync((await download.path())!);
  await page.evaluate(() => indexedDB.deleteDatabase('stepdown-card'));
  await page.reload();
  await page.locator('#import-json').setInputFiles({ name: 'stepdown-backup.json', mimeType: 'application/json', buffer: backup });
  await expect(page.getByRole('heading', { name: 'Prednisone' })).toBeVisible();
});

test('@claim:encrypted-card locks and restores a card with its passphrase', async ({ page }) => {
  await createCard(page);
  await page.getByLabel('New passphrase').fill('correct horse battery');
  await page.getByRole('button', { name: 'Encrypt this card' }).click();
  await expect(page.getByText('This card is encrypted.')).toBeVisible();
  await waitForEncryptedCard(page);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Open your encrypted card' })).toBeVisible();
  await page.getByLabel('Passphrase').fill('wrong passphrase');
  await page.getByRole('button', { name: 'Open this card' }).click();
  await expect(page.getByText('That passphrase did not open this card.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Open your encrypted card' })).toBeVisible();
  await page.getByLabel('Passphrase').fill('correct horse battery');
  await page.getByRole('button', { name: 'Open this card' }).click();
  await expect(page.getByRole('heading', { name: 'Prednisone' })).toBeVisible();
});

test('@claim:no-passphrase-recovery leaves a card locked without the original passphrase', async ({ page }) => {
  await createCard(page);
  await page.getByLabel('New passphrase').fill('only original passphrase');
  await page.getByRole('button', { name: 'Encrypt this card' }).click();
  await expect(page.getByText('This card is encrypted.')).toBeVisible();
  await waitForEncryptedCard(page);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Open your encrypted card' })).toBeVisible();
  await page.getByLabel('Passphrase', { exact: true }).fill('different passphrase');
  await page.getByRole('button', { name: 'Open this card' }).click();
  await expect(page.getByRole('heading', { name: 'Open your encrypted card' })).toBeVisible();
  await expect(page.getByText('A forgotten passphrase cannot be recovered.')).toBeVisible();
  await expect(page.getByRole('button', { name: /reset|recover/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /reset|recover/i })).toHaveCount(0);
  await expect(page.getByLabel('Import a backup')).toBeAttached();
});

test('@claim:demo-unsaved discards demo changes and never writes a demo record', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Check this day' }).first().click();
  const stored = await page.evaluate(async () => {
    const request = indexedDB.open('stepdown-card', 1);
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return new Promise(resolve => {
      const get = db.transaction('cards').objectStore('cards').get('demo:stepdown:schedule');
      get.onsuccess = () => resolve(get.result);
    });
  });
  expect(stored).toBeUndefined();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Checked' })).toHaveCount(0);
});

test('@claim:print-card opens the browser print flow', async ({ page }) => {
  await page.addInitScript(() => { (window as Window & { printed?: boolean }).print = () => { (window as Window & { printed?: boolean }).printed = true; }; });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Print card' }).click();
  expect(await page.evaluate(() => (window as Window & { printed?: boolean }).printed)).toBe(true);
});

test('@claim:free-no-account offers the complete card without checkout or sign-in', async ({ page }) => {
  const thirdParty: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== expectedOrigin) thirdParty.push(request.url());
  });
  await page.goto('/');
  await expect(page.getByText('Free to use. No account or analytics.')).toBeVisible();
  await expect(page.locator('a[href*="checkout"], input[type="email"], input[name="username"]')).toHaveCount(0);
  expect(thirdParty).toEqual([]);
});

test('@claim:transcription-only keeps the entered dose and dates unchanged', async ({ page }) => {
  await createCard(page, { start: '2026-12-31', end: '2027-01-02', dose: '7.5 mg exactly' });
  await expect(page.locator('time')).toHaveCount(3);
  await expect(page.locator('time').first()).toHaveAttribute('datetime', '2026-12-31');
  await expect(page.locator('time').last()).toHaveAttribute('datetime', '2027-01-02');
  await expect(page.getByText('7.5 mg exactly')).toHaveCount(3);
  await expect(page.getByText('Take exactly as written by Dr. Rivera.')).toBeVisible();
});

test('@claim:no-clinical-output offers no dose recommendation or interaction checker', async ({ page }) => {
  const outsideRequests: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== expectedOrigin) outsideRequests.push(request.url());
  });
  await page.goto('/');
  await expect(page.getByText('It does not calculate doses, recommend doses, or check interactions.')).toBeVisible();
  await expect(page.getByRole('button', { name: /calculate|recommend|interaction/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /calculate|recommend|interaction/i })).toHaveCount(0);
  await createCard(page, { start: '2026-08-28', end: '2026-08-28', dose: '7 mg copied exactly' });
  await expect(page.getByText('7 mg copied exactly')).toHaveCount(1);
  await expect(page.getByText(/recommended dose|interaction result/i)).toHaveCount(0);
  expect(outsideRequests).toEqual([]);
});

test('@claim:clear-device-data removes the saved card', async ({ page }) => {
  await createCard(page);
  await page.evaluate(async () => {
    indexedDB.deleteDatabase('stepdown-card');
    await new Promise(resolve => setTimeout(resolve, 50));
  });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Track your taper day by day' })).toBeVisible();
});

test('@claim:check-timestamp records the local check time in the CSV', async ({ page }) => {
  await createCard(page, { start: '2026-08-28', end: '2026-08-28' });
  await page.getByRole('button', { name: 'Check this day' }).click();
  await expect(page.getByRole('button', { name: 'Checked' })).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const csv = readFileSync((await (await downloadPromise).path())!, 'utf8');
  expect(csv.split('\n')[1].split(',')[3]).not.toBe('""');
});

for (const timezoneId of ['Pacific/Auckland', 'Pacific/Kiritimati', 'Etc/GMT+12']) {
  test(`date-only values do not shift in ${timezoneId}`, async ({ browser }) => {
    const context = await browser.newContext({ timezoneId });
    const page = await context.newPage();
    await createCard(page);
    await expect(page.locator('time').first()).toHaveAttribute('datetime', '2026-12-31');
    await expect(page.locator('time').last()).toHaveAttribute('datetime', '2027-01-02');
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export CSV' }).click();
    const csv = readFileSync((await (await downloadPromise).path())!, 'utf8');
    expect(csv).toContain('"2026-12-31"');
    expect(csv).toContain('"2027-01-02"');
    await context.close();
  });
}

test('@claim:backup-validation rejects every named invalid backup and preserves the locked card', async ({ page }) => {
  const errors: Error[] = [];
  page.on('pageerror', error => errors.push(error));
  await createCard(page);
  await page.getByLabel('New passphrase').fill('preserve locked card');
  await page.getByRole('button', { name: 'Encrypt this card' }).click();
  await waitForEncryptedCard(page);
  await page.reload();
  const sealedBefore = await page.evaluate(async () => {
    const request = indexedDB.open('stepdown-card', 1);
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return new Promise<string>((resolve, reject) => {
      const get = db.transaction('cards').objectStore('cards').get('stepdown:real:sealed');
      get.onsuccess = () => resolve(get.result);
      get.onerror = () => reject(get.error);
    });
  });
  const base = {
    id: 'candidate', medication: 'Candidate', clinicianText: 'Directions', createdAt: new Date().toISOString(),
    acknowledgements: {}, steps: [{ id: 'one', start: '2026-01-01', end: '2026-01-02', dose: '5 mg', instructions: '' }]
  };
  const invalidBackups = [
    { name: 'missing-field', value: { ...base, medication: undefined } },
    { name: 'invalid-date', value: { ...base, steps: [{ ...base.steps[0], start: 'not-a-date' }] } },
    { name: 'reversed-range', value: { ...base, steps: [{ ...base.steps[0], start: '2026-01-03', end: '2026-01-01' }] } },
    { name: 'overlap', value: { ...base, steps: [base.steps[0], { ...base.steps[0], id: 'two', start: '2026-01-02', end: '2026-01-03' }] } }
  ];
  for (const backup of invalidBackups) {
    await test.step(backup.name, async () => {
      await page.locator('#import-json').setInputFiles({ name: `${backup.name}.json`, mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup.value)) });
      await expect(page.getByText('Your current card was not changed.')).toBeVisible();
      const storedAfter = await page.evaluate(async () => {
        const request = indexedDB.open('stepdown-card', 1);
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        return new Promise<{ sealed?: string; plain?: string }>((resolve, reject) => {
          const transaction = db.transaction('cards');
          const cards = transaction.objectStore('cards');
          const sealed = cards.get('stepdown:real:sealed');
          const plain = cards.get('stepdown:real:schedule');
          transaction.oncomplete = () => resolve({ sealed: sealed.result, plain: plain.result });
          transaction.onerror = () => reject(transaction.error);
        });
      });
      expect(storedAfter.sealed).toBe(sealedBefore);
      expect(storedAfter.plain).toBeUndefined();
      await page.reload();
      await expect(page.getByRole('heading', { name: 'Open your encrypted card' })).toBeVisible();
    });
  }
  expect(errors).toEqual([]);
});

test('editing a dose preserves checks for dates still on the card', async ({ page }) => {
  await createCard(page, { start: '2026-08-28', end: '2026-08-28' });
  await page.getByRole('button', { name: 'Check this day' }).click();
  await page.getByRole('button', { name: 'Edit card' }).click();
  await page.getByLabel('Exact dose').fill('8 mg once daily');
  await page.getByRole('button', { name: 'Save this card' }).click();
  await expect(page.getByText('1 scheduled days · 1 checked')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Checked' })).toBeVisible();
});

test('invalid ranges and overlap errors preserve every entered field', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Medication or treatment name').fill('Prednisone');
  await page.getByLabel('Clinician instructions, copied exactly').fill('Written instructions stay here.');
  await page.getByLabel('Start').fill('2026-08-30');
  await page.getByLabel('End').fill('2026-08-29');
  await page.getByLabel('Exact dose').fill('10 mg');
  await page.getByRole('button', { name: 'Save this card' }).click();
  await expect(page.getByRole('alert')).toContainText('cannot end before');
  await expect(page.getByLabel('Medication or treatment name')).toHaveValue('Prednisone');
  await expect(page.getByLabel('Clinician instructions, copied exactly')).toHaveValue('Written instructions stay here.');
  await page.getByLabel('Start').fill('2026-08-28');
  await page.getByLabel('End').fill('2026-08-28');
  await page.getByRole('button', { name: 'Add a dose step' }).click();
  await page.getByLabel('Start').nth(1).fill('2026-08-28');
  await page.getByLabel('End').nth(1).fill('2026-08-28');
  await page.getByLabel('Exact dose').nth(1).fill('5 mg');
  await page.getByRole('button', { name: 'Save this card' }).click();
  await expect(page.getByRole('alert')).toContainText('overlap on 2026-08-28');
  await expect(page.getByLabel('Exact dose').nth(1)).toHaveValue('5 mg');
});

test('backup import is available on a fresh device and on the encrypted lock screen', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel('Import a backup')).toBeAttached();
  await createCard(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup' }).click();
  const backup = readFileSync((await (await downloadPromise).path())!);
  await page.getByLabel('New passphrase').fill('locked card passphrase');
  await page.getByRole('button', { name: 'Encrypt this card' }).click();
  await page.reload();
  await expect(page.getByLabel('Import a backup')).toBeAttached();
  await page.locator('#import-json').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: backup });
  await expect(page.getByRole('heading', { name: 'Prednisone' })).toBeVisible();
});

test('client navigation enters demo, restores real data, focuses headings, and updates canonical metadata', async ({ page }) => {
  await createCard(page);
  await page.getByRole('link', { name: 'Demo' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Prednisone — sample' })).toBeFocused();
  await page.getByRole('button', { name: 'Leave demo and write a card' }).click();
  await expect(page.getByLabel('Medication or treatment name')).toHaveValue('Prednisone');
  await expect(page.getByLabel('Medication or treatment name')).toBeFocused();
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await expect(page.getByRole('heading', { name: 'Privacy for StepDown Card' })).toBeFocused();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://taper-calendar-card.sociobot.in/privacy');
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Edit your taper card' })).toBeFocused();
  await expect(page.getByLabel('Medication or treatment name')).toHaveValue('Prednisone');
});

test('the query demo path is isolated, resettable, and returns to real data', async ({ page }) => {
  await createCard(page);
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — StepDown Card');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Prednisone — sample' })).toBeVisible();
  await page.getByRole('button', { name: 'Check this day' }).first().click();
  await expect(page.getByRole('button', { name: 'Checked' })).toHaveCount(1);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('button', { name: 'Checked' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Leave demo and write a card' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByLabel('Medication or treatment name')).toHaveValue('Prednisone');
  await expect(page.getByLabel('Medication or treatment name')).toBeFocused();
});

test('unknown client paths render the designed not-found screen and known legal links work', async ({ page }) => {
  await page.goto('/privacy');
  await page.getByRole('link', { name: 'Card', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto('/missing-page');
  await expect(page.getByRole('heading', { name: 'This page is not on the card' })).toBeVisible();
});

test('every app route has its own title, metadata, one heading, and focus after navigation', async ({ page }) => {
  const routes = [
    ['/', 'StepDown Card — track a taper day by day', 'https://taper-calendar-card.sociobot.in/'],
    ['/demo', 'Demo — StepDown Card', 'https://taper-calendar-card.sociobot.in/demo'],
    ['/privacy', 'Privacy — StepDown Card', 'https://taper-calendar-card.sociobot.in/privacy'],
    ['/terms', 'Terms — StepDown Card', 'https://taper-calendar-card.sociobot.in/terms']
  ];
  for (const [route, title, canonical] of routes) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
  }
});

test('the standalone 404 has complete navigation, metadata, legal links, and a working skip link', async ({ page, request }) => {
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — StepDown Card');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#1f6f5f');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Page not found — StepDown Card');
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', 'Page not found — StepDown Card');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://taper-calendar-card.sociobot.in/404');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Privacy' })).toHaveCount(2);
  await expect(page.getByRole('link', { name: 'Terms' })).toHaveCount(1);
  await expect(page.getByText(/Built by Param Factory · v1\.3\.0/)).toBeVisible();
  const hrefs = await page.locator('a[href]').evaluateAll(links => links.map(link => (link as HTMLAnchorElement).href).filter(href => !href.includes('#main')));
  for (const href of new Set(hrefs)) expect((await request.get(href)).ok(), href).toBe(true);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to the message' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('the app announces an available service-worker update with a reload action', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.dispatchEvent(new MessageEvent('message', { data: { type: 'UPDATE_AVAILABLE' } })));
  await expect(page.getByText('An update is available.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reload now' })).toBeVisible();
});

test('light and dark routes have no axe violations', async ({ browser }) => {
  for (const colorScheme of ['light', 'dark'] as const) {
    const context = await browser.newContext({ colorScheme });
    const page = await context.newPage();
    for (const route of ['/', '/demo', '/privacy', '/terms', '/404.html']) {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    }
    await context.close();
  }
});

test('keyboard users can skip to content, enter the demo, and toggle a day', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to the schedule' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.getByRole('button', { name: 'Try it with sample data' }).focus();
  await page.keyboard.press('Enter');
  const check = page.getByRole('button', { name: 'Check this day' }).first();
  await check.focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('button', { name: 'Checked' })).toHaveCount(1);
});

test('the first screen is complete at 390px and Write my card focuses the editor', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  for (const text of [
    'Track your taper day by day',
    'For people following clinician instructions who need each dose and checked day in one private card.',
    'Try it with sample data',
    'Works after you first open it.',
    'Stores your card on this device.',
    'Free to use. No account or analytics.'
  ]) await expect(page.getByText(text, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Write my card' }).click();
  await expect(page.getByLabel('Medication or treatment name')).toBeFocused();
  await context.close();
});

test('one click shows a realistic date, dose, and check control in the 390px first demo screen', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Prednisone — sample' })).toBeVisible();
  await expect(page.getByText('20 mg once daily').first()).toBeVisible();
  const targets = [page.locator('.day time').first(), page.getByRole('button', { name: 'Check this day' }).first()];
  for (const target of targets) {
    await expect(target).toBeVisible();
    const box = await target.boundingBox();
    expect(box, 'demo target bounding box').not.toBeNull();
    expect(box!.y + box!.height, 'demo target bottom edge').toBeLessThanOrEqual(844);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await context.close();
});

test('the real editor fits 390px and key mobile touch targets are at least 44px', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  for (const selector of ['nav a', '.remove', 'footer a']) {
    const boxes = await page.locator(selector).evaluateAll(elements => elements.map(element => {
      const rect = element.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }));
    for (const box of boxes) {
      expect(box.width, `${selector} width`).toBeGreaterThanOrEqual(44);
      expect(box.height, `${selector} height`).toBeGreaterThanOrEqual(44);
    }
  }
  await page.goto('/demo');
  const demoBoxes = await page.locator('.demo button').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().height));
  demoBoxes.forEach(height => expect(height).toBeGreaterThanOrEqual(44));
  await page.goto('/404.html');
  const footerBoxes = await page.locator('footer a').evaluateAll(elements => elements.map(element => {
    const rect = element.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }));
  footerBoxes.forEach(box => {
    expect(box.width, '404 footer link width').toBeGreaterThanOrEqual(44);
    expect(box.height, '404 footer link height').toBeGreaterThanOrEqual(44);
  });
  await context.close();
});
