import './style.css';
import { addDays, csvFor, datesFor, localDate, parseSchedule, validateSchedule, type Schedule, type Step } from './schedule';

const REAL_KEY = 'stepdown:real:schedule';
const DEMO_KEY = 'demo:stepdown:schedule';
const SEALED_KEY = 'stepdown:real:sealed';
const KNOWN_ROUTES = new Set(['/', '/demo', '/privacy', '/terms']);

let demo = location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
let schedule: Schedule | null = null;
let locked = false;
let editing = false;
let encryptionPassphrase: string | null = null;
let notice = '';
let updateReady = false;

function sample(): Schedule {
  const today = localDate();
  return {
    id: crypto.randomUUID(), medication: 'Prednisone — sample',
    clinicianText: 'Sample only. Follow your clinician’s written directions. Take the listed dose with breakfast.',
    createdAt: new Date().toISOString(), acknowledgements: {}, steps: [
      { id: crypto.randomUUID(), start: today, end: addDays(today, 4), dose: '20 mg once daily', instructions: 'Take with breakfast.' },
      { id: crypto.randomUUID(), start: addDays(today, 5), end: addDays(today, 9), dose: '10 mg once daily', instructions: 'Take with breakfast.' },
      { id: crypto.randomUUID(), start: addDays(today, 10), end: addDays(today, 13), dose: '5 mg once daily', instructions: 'Take with breakfast.' }
    ]
  };
}

function store() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('stepdown-card', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('cards');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readStored(key: string) {
  const db = await store();
  return new Promise<string | undefined>((resolve, reject) => {
    const request = db.transaction('cards').objectStore('cards').get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function writeStored(key: string, value: string) {
  const db = await store();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('cards', 'readwrite');
    const cards = transaction.objectStore('cards');
    if (key === REAL_KEY) {
      const sealed = cards.get(SEALED_KEY);
      sealed.onsuccess = () => {
        if (sealed.result === undefined) cards.put(value, key);
      };
    } else cards.put(value, key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function removeStored(key: string) {
  const db = await store();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('cards', 'readwrite');
    transaction.objectStore('cards').delete(key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// A sealed record is the authority while a card is locked.  Keep this cleanup
// in one committed transaction so a rejected import cannot expose a stale
// plaintext record, even briefly.
async function keepEncryptedCardLocked() {
  const db = await store();
  return new Promise<boolean>((resolve, reject) => {
    const transaction = db.transaction('cards', 'readwrite');
    const cards = transaction.objectStore('cards');
    const sealed = cards.get(SEALED_KEY);
    let hasSealedRecord = false;
    sealed.onsuccess = () => {
      hasSealedRecord = sealed.result !== undefined;
      if (hasSealedRecord) cards.delete(REAL_KEY);
    };
    sealed.onerror = () => reject(sealed.error);
    transaction.oncomplete = () => resolve(hasSealedRecord);
    transaction.onerror = () => reject(transaction.error);
  });
}

async function replaceReal(next: Schedule) {
  const db = await store();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('cards', 'readwrite');
    const cards = transaction.objectStore('cards');
    cards.put(JSON.stringify(next), REAL_KEY);
    cards.delete(SEALED_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function save() {
  if (!schedule || demo) return;
  if (encryptionPassphrase) await seal(schedule, encryptionPassphrase);
  else await writeStored(REAL_KEY, JSON.stringify(schedule));
}

function b64(bytes: Uint8Array) { return btoa(String.fromCharCode(...bytes)); }
function unb64(text: string) { return Uint8Array.from(atob(text), character => character.charCodeAt(0)); }
async function cryptKey(passphrase: string, salt: Uint8Array) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt.buffer as ArrayBuffer, iterations: 150000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
async function seal(value: Schedule, passphrase: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await cryptKey(passphrase, salt);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv.buffer as ArrayBuffer }, key, new TextEncoder().encode(JSON.stringify(value)));
  const db = await store();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('cards', 'readwrite');
    const cards = transaction.objectStore('cards');
    cards.put(JSON.stringify({ salt: b64(salt), iv: b64(iv), data: b64(new Uint8Array(encrypted)) }), SEALED_KEY);
    cards.delete(REAL_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}
async function unseal(passphrase: string) {
  const item = await readStored(SEALED_KEY);
  if (!item) throw Error('Missing encrypted card');
  const payload = JSON.parse(item) as { salt: string; iv: string; data: string };
  const key = await cryptKey(passphrase, unb64(payload.salt));
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(payload.iv).buffer as ArrayBuffer }, key, unb64(payload.data).buffer as ArrayBuffer);
  const parsed = parseSchedule(JSON.parse(new TextDecoder().decode(decrypted)));
  if (!parsed) throw Error('Invalid encrypted card');
  return parsed;
}

function esc(value: string) {
  return value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]!);
}

function setMetadata() {
  const route = location.pathname;
  const titles: Record<string, string> = {
    '/': 'StepDown Card — track a taper day by day',
    '/demo': 'Demo — StepDown Card',
    '/privacy': 'Privacy — StepDown Card',
    '/terms': 'Terms — StepDown Card'
  };
  const descriptions: Record<string, string> = {
    '/': 'Write down a clinician-provided taper and check each day privately.',
    '/demo': 'Try a private taper card with isolated sample data that is never saved.',
    '/privacy': 'Learn what StepDown Card stores on this device and how to remove it.',
    '/terms': 'Read the terms and clinical limits for using StepDown Card.'
  };
  document.title = demo && route === '/' ? titles['/demo'] : titles[route] || 'Page not found — StepDown Card';
  const canonicalRoute = demo && route === '/' ? '/demo' : KNOWN_ROUTES.has(route) ? route : '/404';
  const metadataRoute = demo && route === '/' ? '/demo' : route;
  const description = descriptions[metadataRoute] || 'Return to StepDown Card to write down a clinician-provided taper.';
  const canonical = `https://taper-calendar-card.sociobot.in${canonicalRoute}`;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = canonical;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = description;
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')!.content = document.title;
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')!.content = description;
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')!.content = canonical;
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')!.content = document.title;
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')!.content = description;
}

function app() {
  setMetadata();
  const route = location.pathname;
  const content = route === '/privacy' ? privacy() : route === '/terms' ? terms() : KNOWN_ROUTES.has(route) ? appScreen() : notFound();
  document.querySelector('#app')!.innerHTML = `${header()}<main id="main" tabindex="-1">${content}</main>${footer()}<div id="route-status" class="sr-only" aria-live="polite"></div><div class="toast" aria-live="polite">${esc(notice)}${updateReady ? '<button id="reload-update">Reload now</button>' : ''}</div>`;
  bind();
}

function header() {
  return `<header><a class="wordmark" href="/" data-route>Step<span>Down</span> Card</a><nav aria-label="Primary"><a href="/demo" data-route>Demo</a><a href="/" data-route>Card</a><a href="/privacy" data-route>Privacy</a></nav></header>`;
}

function footer() {
  return `<footer><p>A private card for a clinician-provided taper.</p><p><a href="/privacy" data-route>Privacy</a> · <a href="/terms" data-route>Terms</a> · Built by Param Factory · v1.3.0<br><small>Original generated collage; provenance is in the design notes.</small></p></footer>`;
}

function landing() {
  return `<section class="landing" aria-labelledby="page-title"><div class="hero-copy"><p class="eyebrow">COPY YOUR CLINICIAN’S TAPER</p><h1 id="page-title" tabindex="-1">Track your taper day by day</h1><p class="lede">For people following clinician instructions who need each dose and checked day in one private card.</p><div class="actions"><button class="primary" id="try-demo">Try it with sample data</button><span>Loads an example card. Nothing is saved.</span><button class="quiet" id="start-real">Write my card</button></div><ul class="facts"><li>Works after you first open it.</li><li>Stores your card on this device.</li><li>Free to use. No account or analytics.</li></ul></div><figure class="hero-art"><img src="/hero.webp" width="768" height="512" alt="An opened cassette case with blank cards and a small calendar, representing a finite written schedule." fetchpriority="high"><figcaption>Keep the written plan visible.</figcaption></figure></section>
  <section class="how" aria-labelledby="how-title"><h2 id="how-title">Make a card in three steps</h2><ol><li><b>Copy</b> the clinician’s instructions exactly.</li><li><b>Mark</b> each dose step and date.</li><li><b>Check</b> each day, then print or export.</li></ol></section>
  <section class="limits" aria-labelledby="limits-title"><h2 id="limits-title">What this card does not do</h2><p>It records clinician instructions. It does not calculate doses, recommend doses, or check interactions.</p><p>If instructions are unclear, contact your clinician or pharmacist.</p></section>`;
}

function importControl() {
  return `<label class="import">Import a backup<input id="import-json" type="file" accept="application/json"></label>`;
}

function editor(currentSchedule: Schedule | null, standalone = false) {
  const today = localDate();
  const current = currentSchedule || { medication: '', clinicianText: '', steps: [{ id: crypto.randomUUID(), start: today, end: today, dose: '', instructions: '' }] };
  const title = standalone ? '<h1 id="page-title" tabindex="-1">Edit your taper card</h1>' : '<h2 id="write-title">Write your clinician’s taper</h2>';
  return `<section class="editor" id="schedule" aria-labelledby="${standalone ? 'page-title' : 'write-title'}"><p class="eyebrow">YOUR WRITTEN CARD</p>${title}<p class="safety">Copy instructions exactly. StepDown Card cannot tell you what dose to take.</p><form id="schedule-form" novalidate><label>Medication or treatment name<input required name="medication" value="${esc(current.medication)}" autocomplete="off"></label><label>Clinician instructions, copied exactly<textarea required name="clinicianText" rows="4">${esc(current.clinicianText)}</textarea></label><fieldset><legend>Dose steps</legend><div id="step-list">${current.steps.map(stepRow).join('')}</div><button class="quiet" type="button" id="add-step">Add a dose step</button></fieldset><p id="form-error" class="form-error" role="alert" tabindex="-1"></p><div class="actions"><button class="primary" type="submit">Save this card</button><span>Your card stays on this device.</span>${standalone ? '<button class="quiet" type="button" id="cancel-edit">Cancel editing</button>' : ''}</div></form>${!standalone ? `<section class="recovery"><h2>Restore an existing card</h2><p>Choose a StepDown Card JSON backup from this or another device.</p>${importControl()}</section>` : ''}</section>`;
}

function stepRow(step: Step) {
  return `<div class="step-row" data-id="${step.id}"><label>Start<input required type="date" name="start" value="${step.start}"></label><label>End<input required type="date" name="end" value="${step.end}"></label><label>Exact dose<input required name="dose" value="${esc(step.dose)}" placeholder="For example: 10 mg once daily"></label><label>Step note<input name="instructions" value="${esc(step.instructions)}" placeholder="For example: take with food"></label><button class="remove" type="button" aria-label="Remove this dose step">×</button></div>`;
}

function card(current: Schedule) {
  const all = datesFor(current.steps);
  const completed = all.filter(({ date }) => current.acknowledgements[date]).length;
  const heading = `<div><p class="eyebrow">${demo ? 'DEMO CARD' : 'SCHEDULE CARD'}</p><h1 id="page-title" tabindex="-1">${esc(current.medication)}</h1><p>${all.length} scheduled days · ${completed} checked</p></div>`;
  const toolbar = `<div class="toolbar"><button class="quiet" id="edit">Edit card</button><button class="quiet" id="export-csv">Export CSV</button><button class="quiet" id="export-json">Export backup</button><button class="primary" id="print">Print card</button></div>`;
  const safety = `<div class="safety"><strong>Follow the clinician’s directions.</strong> ${demo ? 'This sample' : 'This card'} records them. It does not change them.</div>`;
  const instructions = `<article class="instructions"><h2>Clinician instructions</h2><p>${esc(current.clinicianText).replaceAll('\n', '<br>')}</p></article>`;
  const tracks = `<section class="tracks" aria-labelledby="days-title"><h2 id="days-title">Daily checks</h2>${all.map(({ date, step }, index) => dayRow(date, step, index)).join('')}</section>`;
  const ownership = `<section class="ownership"><h2>Keep a copy you control</h2><p>Export a backup before changing devices. Checks include the local time you marked each day.</p>${importControl()}${!demo ? `<div class="encrypt"><h3>Encrypt this card on this device</h3><p>Set a passphrase to lock this card. Keep an exported backup.</p><p>A forgotten passphrase cannot be recovered.</p><label>New passphrase<input id="encrypt-pass" type="password" autocomplete="new-password"></label><button class="quiet" id="encrypt">Encrypt this card</button></div>` : ''}</section>`;
  if (demo) return `<section class="card demo-card" id="schedule" aria-labelledby="page-title"><div class="card-head">${heading}</div>${safety}${tracks}<section class="demo-tools"><h2>Sample card tools</h2>${toolbar}</section>${instructions}${ownership}</section>`;
  return `<section class="card" id="schedule" aria-labelledby="page-title"><div class="card-head">${heading}${toolbar}</div>${safety}${instructions}${tracks}${ownership}</section>`;
}

function dayRow(date: string, step: Step, index: number) {
  const done = schedule!.acknowledgements[date];
  const shownDate = new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  return `<div class="day ${done ? 'done' : ''} ${date === localDate() ? 'today' : ''}"><span class="track">${String(index + 1).padStart(2, '0')}</span><time datetime="${date}">${shownDate}</time><div><b>${esc(step.dose)}</b>${step.instructions ? `<small>${esc(step.instructions)}</small>` : ''}</div><button class="check" data-date="${date}" aria-pressed="${Boolean(done)}">${done ? 'Checked' : 'Check this day'}</button></div>`;
}

function lockedScreen() {
  return `<section class="editor"><p class="eyebrow">ENCRYPTED CARD</p><h1 id="page-title" tabindex="-1">Open your encrypted card</h1><p>Your schedule is encrypted in this browser. Enter the passphrase you set on this device.</p><label>Passphrase<input id="unlock-pass" type="password" autocomplete="current-password"></label><div class="actions"><button class="primary" id="unlock">Open this card</button></div><p class="safety">A forgotten passphrase cannot be recovered. Restore an exported backup instead.</p><section class="recovery"><h2>Restore a backup</h2><p>A backup replaces this locked card only when required fields and dates are valid and dose steps do not overlap.</p>${importControl()}</section></section>`;
}

function appScreen() {
  if (locked) return lockedScreen();
  const banner = demo ? '<div class="demo"><b>Demo — sample data, nothing is saved</b><button id="reset-demo">Reset demo</button><button id="leave-demo">Leave demo and write a card</button></div>' : '';
  if (schedule) return `${banner}${editing ? editor(schedule, true) : card(schedule)}`;
  return `${banner}${landing()}${!demo ? editor(null) : ''}`;
}

function privacy() {
  return `<article class="legal"><h1 tabindex="-1">Privacy for StepDown Card</h1><p>Schedule data stays in this browser unless you export it. The app has no account and no analytics.</p><h2>Data on this device</h2><p>Your card, dose steps, and checks stay in this browser.</p><p>Clear this site’s data to remove a saved card.</p><h2>Demo data</h2><p>The demo stays in memory and is discarded when you leave or reload it.</p></article>`;
}

function terms() {
  return `<article class="legal"><h1 tabindex="-1">Terms for StepDown Card</h1><p>StepDown Card keeps the dates, dose wording, and clinician instructions you enter.</p><h2>Use the clinician’s directions</h2><p>It does not calculate doses, recommend doses, or check interactions.</p><p>Ask your clinician or pharmacist when directions are unclear.</p><h2>Cost</h2><p>StepDown Card is free to use.</p></article>`;
}

function notFound() {
  return `<article class="legal not-found"><p class="eyebrow">TRACK 404</p><h1 tabindex="-1">This page is not on the card</h1><p><a href="/" data-route>Return to StepDown Card</a></p></article>`;
}

function download(name: string, type: string, body: string) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([body], { type }));
  link.download = name;
  link.click();
  URL.revokeObjectURL(link.href);
}

function formSteps() {
  return [...document.querySelectorAll<HTMLElement>('.step-row')].map(row => ({
    id: row.dataset.id!,
    start: row.querySelector<HTMLInputElement>('[name=start]')!.value,
    end: row.querySelector<HTMLInputElement>('[name=end]')!.value,
    dose: row.querySelector<HTMLInputElement>('[name=dose]')!.value,
    instructions: row.querySelector<HTMLInputElement>('[name=instructions]')!.value
  }));
}

async function importBackup(file: File) {
  try {
    const next = parseSchedule(JSON.parse(await file.text()));
    if (!next) throw Error('Invalid backup');
    if (demo) schedule = next;
    else {
      await replaceReal(next);
      schedule = next;
      locked = false;
      encryptionPassphrase = null;
    }
    editing = false;
    notice = 'Backup imported.';
    app();
  } catch {
    if (await keepEncryptedCardLocked()) {
      locked = true;
      schedule = null;
      encryptionPassphrase = null;
    }
    notice = 'That backup is incomplete or unsafe. Your current card was not changed.';
    app();
  }
}

async function loadReal() {
  const sealed = await readStored(SEALED_KEY);
  locked = Boolean(sealed);
  encryptionPassphrase = null;
  if (locked) { schedule = null; return; }
  const saved = await readStored(REAL_KEY);
  if (!saved) { schedule = null; return; }
  const parsed = parseSchedule(JSON.parse(saved));
  if (!parsed) throw Error('Stored card is invalid');
  schedule = parsed;
}

async function navigate(url: string, replace = false) {
  if (replace) history.replaceState({}, '', url);
  else history.pushState({}, '', url);
  const nextDemo = location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
  if (nextDemo !== demo) {
    demo = nextDemo;
    editing = false;
    if (demo) {
      schedule = sample();
      locked = false;
    } else await loadReal();
  }
  app();
  requestAnimationFrame(() => {
    document.querySelector<HTMLElement>('h1')?.focus();
    const status = document.querySelector('#route-status');
    if (status) status.textContent = document.title;
  });
}

function bind() {
  const skip = document.querySelector<HTMLAnchorElement>('.skip');
  if (skip) skip.onclick = event => {
    event.preventDefault();
    document.querySelector<HTMLElement>('#main')?.focus();
  };
  document.querySelectorAll<HTMLAnchorElement>('[data-route]').forEach(link => link.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    void navigate(link.pathname + link.search);
  }));
  document.querySelector('#try-demo')?.addEventListener('click', () => void navigate('/demo'));
  document.querySelector('#start-real')?.addEventListener('click', () => {
    document.querySelector('#schedule-form')?.scrollIntoView({ behavior: 'smooth' });
    document.querySelector<HTMLInputElement>('[name="medication"]')?.focus({ preventScroll: true });
  });
  document.querySelector('#reset-demo')?.addEventListener('click', () => { schedule = sample(); notice = 'The example card was reset.'; app(); });
  document.querySelector('#leave-demo')?.addEventListener('click', async () => {
    await removeStored(DEMO_KEY);
    await navigate('/');
    if (schedule) {
      editing = true;
      app();
    }
    requestAnimationFrame(() => {
      document.querySelector('#schedule-form')?.scrollIntoView({ behavior: 'smooth' });
      document.querySelector<HTMLInputElement>('[name="medication"]')?.focus({ preventScroll: true });
    });
  });
  document.querySelector('#unlock')?.addEventListener('click', async () => {
    const passphrase = document.querySelector<HTMLInputElement>('#unlock-pass')!.value;
    try {
      schedule = await unseal(passphrase);
      encryptionPassphrase = passphrase;
      locked = false;
      notice = 'Your encrypted card is open for this session.';
      app();
    } catch {
      notice = 'That passphrase did not open this card. Try again or restore a backup.';
      app();
    }
  });
  document.querySelector('#add-step')?.addEventListener('click', () => {
    const today = localDate();
    document.querySelector('#step-list')?.insertAdjacentHTML('beforeend', stepRow({ id: crypto.randomUUID(), start: today, end: today, dose: '', instructions: '' }));
  });
  document.querySelector('#step-list')?.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('remove')) target.closest('.step-row')?.remove();
  });
  document.querySelector<HTMLFormElement>('#schedule-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const steps = formSteps();
    const medication = String(data.get('medication') || '');
    const clinicianText = String(data.get('clinicianText') || '');
    const error = validateSchedule(medication, clinicianText, steps);
    if (error) {
      const output = document.querySelector<HTMLElement>('#form-error')!;
      output.textContent = error;
      output.focus();
      return;
    }
    const validDates = new Set(datesFor(steps).map(({ date }) => date));
    const acknowledgements = Object.fromEntries(Object.entries(schedule?.acknowledgements || {}).filter(([date]) => validDates.has(date)));
    schedule = {
      id: schedule?.id || crypto.randomUUID(), medication, clinicianText, steps,
      createdAt: schedule?.createdAt || new Date().toISOString(), acknowledgements
    };
    await save();
    editing = false;
    notice = 'Your card is saved on this device.';
    app();
  });
  document.querySelector('#edit')?.addEventListener('click', () => { editing = true; app(); document.querySelector<HTMLElement>('h1')?.focus(); });
  document.querySelector('#cancel-edit')?.addEventListener('click', () => { editing = false; app(); });
  document.querySelectorAll<HTMLButtonElement>('.check').forEach(button => button.addEventListener('click', async () => {
    const date = button.dataset.date!;
    if (schedule!.acknowledgements[date]) delete schedule!.acknowledgements[date];
    else schedule!.acknowledgements[date] = new Date().toLocaleString();
    await save();
    app();
  }));
  document.querySelector('#export-csv')?.addEventListener('click', () => download('stepdown-log.csv', 'text/csv', csvFor(schedule!)));
  document.querySelector('#export-json')?.addEventListener('click', () => download('stepdown-backup.json', 'application/json', JSON.stringify(schedule, null, 2)));
  document.querySelector('#print')?.addEventListener('click', () => window.print());
  document.querySelector('#encrypt')?.addEventListener('click', async () => {
    const passphrase = document.querySelector<HTMLInputElement>('#encrypt-pass')!.value;
    if (passphrase.length < 8) { notice = 'Use at least 8 characters for the passphrase.'; app(); return; }
    encryptionPassphrase = passphrase;
    await seal(schedule!, passphrase);
    notice = 'This card is encrypted. Keep your exported backup and passphrase safe.';
    app();
  });
  document.querySelector<HTMLInputElement>('#import-json')?.addEventListener('change', event => {
    const file = (event.currentTarget as HTMLInputElement).files?.[0];
    if (file) void importBackup(file);
  });
  document.querySelector('#reload-update')?.addEventListener('click', () => location.reload());
}

window.addEventListener('popstate', () => void navigate(location.pathname + location.search, true));

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data?.type === 'UPDATE_AVAILABLE') {
      updateReady = true;
      notice = 'An update is available.';
      app();
    }
  });
  void navigator.serviceWorker.register('/sw.js').then(registration => {
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          updateReady = true;
          notice = 'An update is available.';
          app();
        }
      });
    });
  }).catch(() => undefined);
}

async function hydrate() {
  try {
    if (demo) {
      await removeStored(DEMO_KEY);
      schedule = sample();
      locked = false;
    } else await loadReal();
  } catch {
    schedule = null;
    locked = false;
    notice = 'This browser could not open the saved card. Import a valid backup or clear this site’s data.';
  }
  app();
}

void hydrate();
