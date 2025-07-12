// Define TimeRange type locally since there's no types directory
type TimeRange = '7d' | '30d' | '90d' | 'all';

/**
 * Filters data based on the selected time range
 * @param data Array of data with timestamp property
 * @param timeRange Selected time range
 * @returns Filtered data
 */
export const filterDataByTimeRange = <T extends { timestamp: number }>(
  data: T[],
  timeRange: TimeRange
): T[] => {
  if (timeRange === 'all') return data;
  
  const now = Date.now();
  const timeRangeInDays = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  const cutoffTime = now - timeRangeInDays * 24 * 60 * 60 * 1000;
  
  return data.filter(item => item.timestamp >= cutoffTime);
};

/**
 * Calculates growth percentage compared to previous period
 * @param currentValue Current period value
 * @param previousValue Previous period value
 * @returns Growth percentage
 */
export const calculateGrowth = (currentValue: number, previousValue: number): number => {
  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / previousValue) * 100;
};

/**
 * Formats a number for display
 * @param value Number to format
 * @param decimals Number of decimal places
 * @returns Formatted number string
 */
export const formatNumber = (value: number, decimals = 2): string => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(decimals)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(decimals)}K`;
  }
  return value.toFixed(decimals);
};