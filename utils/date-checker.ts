export function isWeekendDay(date: Date): boolean {
    // Get the difference in days from the reference date (2025-05-17)
    const referenceDate = new Date('2025-05-17');
    const diffTime = Math.abs(date.getTime() - referenceDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Every 4 days cycle starts from the reference date
    // Days 0 and 1 are weekends, Days 2 and 3 are workdays
    const dayInCycle = diffDays % 4;
    return dayInCycle === 0 || dayInCycle === 1;
}
