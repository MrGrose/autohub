import type { Car } from '@/data/car'

const COUNTRY_LABELS: Record<string, string> = {
  China: 'Авто из Китая',
  Korea: 'Авто из Кореи',
  Japan: 'Авто из Японии',
  UAE: 'Авто из ОАЭ',
}

/** Как в ТГ: 2.200.000 */
export function formatPriceRub(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/** Достаточно id и хоть какого-то содержимого */
export function isCompleteCar(c: Partial<Car>): c is Car {
  const hasContent =
    !!c.name?.trim() ||
    !!c.description?.trim() ||
    c.priceRub != null
  return !!c.id && hasContent
}

export function carSortPrice(c: Car): number {
  return c.priceRub ?? 0
}

export function carPriceDisplay(car: Car): string {
  if (!car.priceRub) return ''
  return `${formatPriceRub(car.priceRub)} ₽`
}

export function countryLabel(country: string | undefined): string {
  if (!country) return ''
  return COUNTRY_LABELS[country] ?? country
}
