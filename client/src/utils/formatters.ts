/**
 * Utility functions for formatting and converting data
 */

/**
 * Safely convert a value to a number
 * Handles both string and number inputs from database
 */
export const toNumber = (value: number | string | null | undefined): number | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? undefined : num;
};

/**
 * Format SQM value with proper decimal places
 */
export const formatSQM = (value: number | string | null | undefined): string => {
  const num = toNumber(value);
  return num !== undefined ? num.toFixed(2) : 'N/A';
};

/**
 * Format sky brightness with 1 decimal place
 */
export const formatBrightness = (value: number | string | null | undefined): string => {
  const num = toNumber(value);
  return num !== undefined ? num.toFixed(1) : 'N/A';
};

/**
 * Format latitude/longitude coordinates
 */
export const formatCoordinate = (value: number | string | null | undefined, decimals: number = 4): string => {
  const num = toNumber(value);
  return num !== undefined ? num.toFixed(decimals) : 'N/A';
};

/**
 * Format percentage with specified decimal places
 */
export const formatPercentage = (value: number | string | null | undefined, decimals: number = 1): string => {
  const num = toNumber(value);
  return num !== undefined ? `${num.toFixed(decimals)}%` : 'N/A';
};
