import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { addDays, csvFor, datesFor, parseSchedule, validateSchedule, type Schedule } from './schedule';

const schedule: Schedule = {
  id: 's', medication: 'Example', clinicianText: 'Take exactly as directed.', createdAt: '2026-08-01T00:00:00.000Z', acknowledgements: {},
  steps: [{ id: 'a', start: '2026-08-01', end: '2026-08-03', dose: '10 mg', instructions: 'with food' }]
};

describe('date-only schedule arithmetic', () => {
  it('keeps dates stable across year boundaries without local-to-UTC conversion', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2027-01-01', 1)).toBe('2027-01-02');
    expect(datesFor([{ ...schedule.steps[0], start: '2026-12-31', end: '2027-01-02' }]).map(item => item.date))
      .toEqual(['2026-12-31', '2027-01-01', '2027-01-02']);
  });

  it('exports one CSV row per scheduled date', () => expect(csvFor(schedule).split('\n')).toHaveLength(4));
});

describe('schedule validation', () => {
  it('requires clinician instructions', () => expect(validateSchedule('Example', '', schedule.steps)).toContain('Copy'));

  it('rejects a reversed date range', () => {
    const steps = [{ ...schedule.steps[0], start: '2026-08-03', end: '2026-08-02' }];
    expect(validateSchedule('Example', 'Directions', steps)).toContain('cannot end before');
  });

  it('rejects overlapping dose steps', () => {
    const steps = [schedule.steps[0], { ...schedule.steps[0], id: 'b', start: '2026-08-03', end: '2026-08-04' }];
    expect(validateSchedule('Example', 'Directions', steps)).toBe('Dose steps overlap on 2026-08-03. Give each day one dose step.');
  });

  it('rejects impossible calendar dates', () => {
    const steps = [{ ...schedule.steps[0], start: '2026-02-30', end: '2026-03-01' }];
    expect(validateSchedule('Example', 'Directions', steps)).toContain('valid dates');
  });
});

describe('backup schema', () => {
  it('accepts a complete schedule', () => expect(parseSchedule(schedule)).toEqual(schedule));

  it('rejects a schedule with no acknowledgement record', () => {
    const incomplete = { id: schedule.id, medication: schedule.medication, clinicianText: schedule.clinicianText, createdAt: schedule.createdAt, steps: schedule.steps };
    expect(parseSchedule(incomplete)).toBeNull();
  });

  it('rejects nested values with the wrong types', () => {
    expect(parseSchedule({ ...schedule, steps: [{ ...schedule.steps[0], dose: 10 }] })).toBeNull();
    expect(parseSchedule({ ...schedule, acknowledgements: { '2026-08-01': false } })).toBeNull();
  });
});

describe('release configuration', () => {
  it('gives every declared claim exactly one tagged browser test', () => {
    const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Array<{ id: string; test: string }>;
    const browserTests = readFileSync('e2e/app.spec.ts', 'utf8');
    expect(new Set(claims.map(claim => claim.id)).size).toBe(claims.length);
    for (const claim of claims) {
      expect(claim.test).toBe(`npm test -- --grep @claim:${claim.id}`);
      expect(browserTests.match(new RegExp(`@claim:${claim.id}(?![a-z0-9-])`, 'g'))).toHaveLength(1);
    }
    expect(browserTests.match(/@claim:[a-z0-9-]+/g)).toHaveLength(claims.length);
  });

  it('does not intercept or cache cross-origin service-worker requests and removes old caches', () => {
    const worker = readFileSync('public/sw.js', 'utf8');
    expect(worker).toContain("url.origin !== self.location.origin");
    expect(worker).toContain('caches.delete(name)');
    expect(worker).not.toContain('api.sociobot.in');
    expect(worker).toContain("caches.match(url.pathname");
  });

  it('sets immutable cache headers for hashed production assets and serves real 404 responses', () => {
    const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8'));
    expect(config.routes.find((route: { route: string }) => route.route === '/assets/*').headers['Cache-Control']).toContain('immutable');
    expect(config.navigationFallback).toBeUndefined();
    expect(config.responseOverrides['404'].statusCode).toBe(404);
  });
});
