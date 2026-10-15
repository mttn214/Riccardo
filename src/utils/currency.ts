export type Currency = 'EUR';

export function formatPrice(priceEUR: number, _currency?: string): string {
  return `${priceEUR.toLocaleString()} €`;
}
