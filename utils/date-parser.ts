export function parseDate(dateStr: string): Date | null {
    const currentYear = new Date().getFullYear();
    const match = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.?(\d{2,4})?$/);
    
    if (!match) return null;
    
    const [_, day, month, yearStr] = match;
    const year = yearStr ? 
        (yearStr.length === 2 ? 2000 + parseInt(yearStr) : parseInt(yearStr)) 
        : currentYear;
    
    const date = new Date(year, parseInt(month) - 1, parseInt(day));
    return isValidDate(date) ? date : null;
}

function isValidDate(date: Date): boolean {
    return !isNaN(date.getTime());
}

export function formatDate(date: Date): string {
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
}
