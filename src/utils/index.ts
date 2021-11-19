/**
 * Convert a number into an amount
 */
export const numberToAmount = (number: number): string => (
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(number)
);

/**
 * Convert a Date to a long date format (dd month YYYY)
 */
export const dateToLong = (date: Date): string => (
  new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
);

/**
 * Convert a number into a percentage
 */
export const rateToPercent = (rate: number): string => (
  new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    // minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rate)
);
