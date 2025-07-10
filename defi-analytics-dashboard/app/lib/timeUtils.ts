import { TimeRange } from '../types';
import { subDays, startOfDay } from 'date-fns';

/**
 * Get the start date based on the selected time range
 */
export function getStartDateFromTimeRange(timeRange: TimeRange): Date {
  const now = new Date();
  
  switch (timeRange) {
    case '7d':
      return subDays(startOfDay(now), 7);
    case '30d':
      return subDays(startOfDay(now), 30);
    case '90d':
      return subDays(startOfDay(now), 90);
    case 'all':
      return subDays(startOfDay(now), 365); // Default to 1 year for "all"
    default:
      return subDays(startOfDay(now), 30); // Default to 30 days
  }
}

/**
 * Format a date range for display
 */
export function formatDateRange(timeRange: TimeRange): string {
  const now = new Date();
  
  switch (timeRange) {
    case '7d':
      return 'Last 7 days';
    case '30d':
      return 'Last 30 days';
    case '90d':
      return 'Last 90 days';
    case 'all':
      return 'All time';
    default:
      return 'Last 30 days';
  }
}