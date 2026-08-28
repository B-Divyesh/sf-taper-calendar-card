export type Step = { id: string; start: string; end: string; dose: string; instructions: string };
export type Schedule = { id: string; medication: string; clinicianText: string; createdAt: string; steps: Step[]; acknowledgements: Record<string, string> };

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

function dateParts(value: string) {
  const match = DATE_ONLY.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const timestamp = Date.UTC(year, month - 1, day);
  const date = new Date(timestamp);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return { timestamp };
}

export const localDate = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const addDays = (value: string, days: number) => {
  const parts = dateParts(value);
  if (!parts) return '';
  const date = new Date(parts.timestamp + days * 86_400_000);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
};

export const daysBetween = (start: string, end: string) => {
  const first = dateParts(start);
  const last = dateParts(end);
  return first && last ? Math.round((last.timestamp - first.timestamp) / 86_400_000) : Number.NaN;
};

export function datesFor(steps: Step[]) {
  return steps.flatMap(step => {
    const span = daysBetween(step.start, step.end);
    return Number.isFinite(span) && span >= 0
      ? Array.from({ length: span + 1 }, (_, index) => ({ date: addDays(step.start, index), step }))
      : [];
  });
}

export function validateSchedule(medication: string, clinicianText: string, steps: Step[]) {
  if (!medication.trim()) return 'Name the medication or treatment.';
  if (!clinicianText.trim()) return 'Copy the clinician instructions before saving.';
  if (!steps.length) return 'Add at least one dose step.';
  const occupied = new Set<string>();
  for (const step of steps) {
    if (!dateParts(step.start) || !dateParts(step.end) || !step.dose.trim()) return 'Each step needs valid dates and the exact dose.';
    if (daysBetween(step.start, step.end) < 0) return 'A step cannot end before it starts.';
    for (const { date } of datesFor([step])) {
      if (occupied.has(date)) return `Dose steps overlap on ${date}. Give each day one dose step.`;
      occupied.add(date);
    }
  }
  return '';
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
    && Object.entries(value as Record<string, unknown>).every(([date, item]) => Boolean(dateParts(date)) && typeof item === 'string');
}

export function parseSchedule(value: unknown): Schedule | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const item = value as Record<string, unknown>;
  if (typeof item.id !== 'string' || typeof item.medication !== 'string' || typeof item.clinicianText !== 'string'
    || typeof item.createdAt !== 'string' || !Array.isArray(item.steps) || !isStringRecord(item.acknowledgements)) return null;
  const steps: Step[] = [];
  for (const candidate of item.steps) {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return null;
    const step = candidate as Record<string, unknown>;
    if (typeof step.id !== 'string' || typeof step.start !== 'string' || typeof step.end !== 'string'
      || typeof step.dose !== 'string' || typeof step.instructions !== 'string') return null;
    steps.push({ id: step.id, start: step.start, end: step.end, dose: step.dose, instructions: step.instructions });
  }
  if (validateSchedule(item.medication, item.clinicianText, steps)) return null;
  return { id: item.id, medication: item.medication, clinicianText: item.clinicianText, createdAt: item.createdAt, steps, acknowledgements: item.acknowledgements };
}

export const csvFor = (schedule: Schedule) => {
  const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
  return ['date,dose,step instructions,acknowledged at', ...datesFor(schedule.steps).map(({ date, step }) =>
    [date, step.dose, step.instructions, schedule.acknowledgements[date] || ''].map(quote).join(','))].join('\n');
};
