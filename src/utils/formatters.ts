const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const HOURLY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatUsd(amount: number): string {
  return USD_FORMATTER.format(Number.isFinite(amount) ? amount : 0);
}

export function formatHourly(amount: number): string {
  return HOURLY_FORMATTER.format(Number.isFinite(amount) ? amount : 0);
}
