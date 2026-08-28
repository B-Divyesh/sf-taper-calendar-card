import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { csvFor, datesFor, validateSchedule, type Schedule } from './schedule';
const schedule: Schedule = { id: 's', medication: 'Example', clinicianText: 'Take exactly as directed.', createdAt: '', acknowledgements: {}, steps: [{id:'a',start:'2026-08-01',end:'2026-08-03',dose:'10 mg',instructions:'with food'}] };
describe('schedule', () => {
  it('creates one day for every inclusive date', () => expect(datesFor(schedule.steps).map(d=>d.date)).toEqual(['2026-08-01','2026-08-02','2026-08-03']));
  it('@claim:csv-export exports one row per scheduled day', () => expect(csvFor(schedule).split('\n')).toHaveLength(4));
  it('requires clinician instructions', () => expect(validateSchedule('Example','',schedule.steps)).toContain('Copy'));
  it('@claim:offline-reload precaches the offline shell', () => {
    const sw = readFileSync('public/sw.js', 'utf8');
    expect(sw).toContain('cache.addAll(SHELL)');
    expect(sw).toContain("caches.match(event.request)");
  });
  it('@claim:private-device only calls the optional licensing endpoint', () => {
    const app = readFileSync('src/main.ts', 'utf8');
    expect([...app.matchAll(/fetch\(/g)]).toHaveLength(1);
    expect(app).toContain('api.sociobot.in/api/v1/products');
  });
});
