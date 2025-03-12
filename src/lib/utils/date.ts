import { format, parseISO } from 'date-fns';
import { fi } from 'date-fns/locale';

/**
 * Format a date to a readable string
 * @param date Date to format
 * @param includeTime Whether to include time
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, includeTime = true): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (includeTime) {
        return format(dateObj, 'PPP HH:mm', { locale: fi });
    }

    return format(dateObj, 'PPP', { locale: fi });
}

/**
 * Format a time from a date
 * @param date Date to extract time from
 * @returns Formatted time string
 */
export function formatTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'HH:mm', { locale: fi });
}

/**
 * Format a date for chart labels
 * @param date Date to format
 * @param timeWindow Time window to determine format (day, week, month, year)
 * @returns Formatted date string for chart labels
 */
export function formatChartDate(date: Date | string, timeWindow: string): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    switch (timeWindow) {
        case 'day':
            return format(dateObj, 'HH:mm', { locale: fi });
        case 'week':
            return format(dateObj, 'EEE d.M.', { locale: fi });
        case 'month':
            return format(dateObj, 'd.M.', { locale: fi });
        case 'year':
            return format(dateObj, 'MMM yyyy', { locale: fi });
        default:
            return format(dateObj, 'PPP', { locale: fi });
    }
}

/**
 * Get the time range in human-readable format
 * @param startTime Start time
 * @param endTime End time
 * @returns Formatted time range string
 */
export function getTimeRangeText(startTime: string, endTime: string): string {
    const start = parseISO(startTime);
    const end = parseISO(endTime);

    return `${formatDate(start, false)} - ${formatDate(end, false)}`;
}