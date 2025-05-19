/**
 * Checks if a given date is a weekend day based on a specific 4-day cycle pattern.
 * In this pattern, every 4-day cycle has 2 weekend days followed by 2 working days.
 *
 * The reference date (May 17, 2025) is set as a weekend day (day 0 in the cycle).
 *
 * @param date The date to check
 * @returns true if the date is a weekend day, false otherwise
 */
export function isWeekendDay(date: Date): boolean {
  const referenceDate = new Date("2025-05-17T00:00:00Z");

  const normalizedDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  const diffTime = normalizedDate.getTime() - referenceDate.getTime();
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const diffDays = Math.floor(diffTime / MS_PER_DAY);

  // Apply modulo to handle negative differences correctly
  // We add a large multiple of 4 to ensure the result is positive
  const dayInCycle = ((diffDays % 4) + 4) % 4;

  // Days 0 and 1 in the cycle are weekend days
  return dayInCycle === 0 || dayInCycle === 1;
}
