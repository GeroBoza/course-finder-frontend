/** Parses a date-only value (YYYY-MM-DD or ISO) without timezone shifts. */
function parseDateParts(
    dateStr: string,
): { year: number; month: number; day: number } | null {
    const datePart = dateStr.split('T')[0];
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);
    if (!match) return null;

    return {
        year: Number(match[1]),
        month: Number(match[2]),
        day: Number(match[3]),
    };
}

function toComparable(year: number, month: number, day: number): number {
    return year * 10000 + month * 100 + day;
}

/** Formats a date as DD/MM/AAAA. */
export function formatDateDDMMYYYY(dateStr: string | null | undefined): string {
    if (!dateStr) return '';

    const parts = parseDateParts(dateStr);
    if (!parts) return '';

    const day = String(parts.day).padStart(2, '0');
    const month = String(parts.month).padStart(2, '0');
    return `${day}/${month}/${parts.year}`;
}

/**
 * True when today is after the course end date.
 * Courses without an end date are treated as still vigente.
 */
export function isCourseNotVigente(endDate: string | null | undefined): boolean {
    if (!endDate) return false;

    const parts = parseDateParts(endDate);
    if (!parts) return false;

    const today = new Date();
    return (
        toComparable(today.getFullYear(), today.getMonth() + 1, today.getDate()) >
        toComparable(parts.year, parts.month, parts.day)
    );
}
