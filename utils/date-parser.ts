/**
 * Parses a date string in formats:
 * - DD.MM.YYYY (returns the exact date)
 * - DD.MM (returns the date with current year)
 * - DD (returns the date with current month and year)
 *
 * @param dateStr The date string to parse
 * @returns A Date object or null if invalid
 */
export function parseDate(dateStr: string): Date | null {
  // Match both "DD.MM.YYYY", "DD.MM" and "DD" patterns
  const fullMatch = dateStr.trim().match(/^(\d{1,2})\.(\d{1,2})\.?(\d{2,4})?$/);
  const dayOnlyMatch = dateStr.trim().match(/^(\d{1,2})$/);

  if (!fullMatch && !dayOnlyMatch) return null;

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  let day, month, year;

  if (fullMatch) {
    // Case: "DD.MM" or "DD.MM.YYYY"
    const [_, dayStr, monthStr, yearStr] = fullMatch;
    day = parseInt(dayStr);
    month = parseInt(monthStr);
    year = yearStr
      ? yearStr.length === 2
        ? 2000 + parseInt(yearStr)
        : parseInt(yearStr)
      : currentYear;
  } else {
    // Case: "DD"
    const [_, dayStr] = dayOnlyMatch!;
    day = parseInt(dayStr);
    month = currentMonth;
    year = currentYear;
  }

  // Validate basic ranges
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  const date = new Date(year, month - 1, day);

  // Check for valid date (catches Feb 31, etc.)
  if (
    !isValidDate(date) ||
    date.getDate() !== day ||
    date.getMonth() !== month - 1
  ) {
    return null;
  }

  return date;
}

function isValidDate(date: Date): boolean {
  return !isNaN(date.getTime());
}

export function formatDate(date: Date): string {
  return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${date.getFullYear()}`;
}
