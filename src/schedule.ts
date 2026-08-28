export type Step = { id: string; start: string; end: string; dose: string; instructions: string };
export type Schedule = { id: string; medication: string; clinicianText: string; createdAt: string; steps: Step[]; acknowledgements: Record<string, string> };

export const iso = (date: Date) => date.toISOString().slice(0, 10);
export const addDays = (date: string, days: number) => { const d = new Date(`${date}T12:00:00`); d.setDate(d.getDate() + days); return iso(d); };
export const daysBetween = (start: string, end: string) => Math.round((new Date(`${end}T12:00:00`).getTime() - new Date(`${start}T12:00:00`).getTime()) / 86400000);
export function datesFor(steps: Step[]) {
  return steps.flatMap(step => Array.from({ length: Math.max(0, daysBetween(step.start, step.end) + 1) }, (_, i) => ({ date: addDays(step.start, i), step })));
}
export function validateSchedule(medication: string, clinicianText: string, steps: Step[]) {
  if (!medication.trim()) return 'Name the medication or treatment.';
  if (!clinicianText.trim()) return 'Copy the clinician instructions before saving.';
  if (!steps.length) return 'Add at least one dose step.';
  for (const step of steps) {
    if (!step.start || !step.end || !step.dose.trim()) return 'Each step needs dates and the exact dose.';
    if (daysBetween(step.start, step.end) < 0) return 'A step cannot end before it starts.';
  }
  return '';
}
export const csvFor = (schedule: Schedule) => {
  const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
  return ['date,dose,step instructions,acknowledged at', ...datesFor(schedule.steps).map(({date, step}) => [date, step.dose, step.instructions, schedule.acknowledgements[date] || ''].map(quote).join(','))].join('\n');
};
