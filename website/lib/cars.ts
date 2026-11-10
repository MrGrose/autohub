import type { Car } from '@/data/car'
import { isCompleteCar } from '@/lib/car-format'

export type CarsFetchResult = {
  cars: Car[]
  ok: boolean
  total: number
  page: number
  pageSize: number
  pages: number
  offset: number
  countries: string[]
}

export type FetchCarsOptions = {
  page?: number
  pageSize?: number
  offset?: number
  country?: string
  featured?: boolean
  sort?: 'price-asc' | 'price-desc' | 'newest'
}

function carsApiUrl(): string | null {
  const url = process.env.CARS_API_URL?.trim()
  return url ? url.replace(/\/+$/, '') : null
}

const emptyResult = (): CarsFetchResult => ({
  cars: [],
  ok: false,
  total: 0,
  page: 1,
  pageSize: 12,
  pages: 1,
  offset: 0,
  countries: [],
})

/** Каталог из FastAPI с пагинацией и фильтрами. */
export async function fetchCars(options: FetchCarsOptions = {}): Promise<CarsFetchResult> {
  const base = carsApiUrl()
  if (!base) {
    console.error('[cars] CARS_API_URL не задан (website/.env.local)')
    return emptyResult()
  }

  const page = Math.max(1, options.page ?? 1)
  const pageSize = Math.min(50, Math.max(1, options.pageSize ?? 12))
  const params = new URLSearchParams({
    page_size: String(pageSize),
    sort: options.sort ?? 'price-desc',
  })
  if (options.offset !== undefined) {
    params.set('offset', String(Math.max(0, options.offset)))
  } else {
    params.set('page', String(page))
  }
  if (options.country) params.set('country', options.country)
  if (options.featured === true) params.set('featured', 'true')

  try {
    const res = await fetch(`${base}/api/v1/cars?${params}`, {
      next: { revalidate: 10 },
      signal: AbortSignal.timeout(15_000),
    })
    if (!res.ok) {
      console.error('[cars] API HTTP', res.status, base)
      return emptyResult()
    }
    const data = (await res.json()) as {
      items?: Car[]
      total?: number
      page?: number
      page_size?: number
      pages?: number
      offset?: number
      countries?: string[]
    }
    const cars = Array.isArray(data.items) ? data.items.filter(isCompleteCar) : []
    const resolvedOffset =
      data.offset ?? (options.offset !== undefined ? options.offset : (page - 1) * pageSize)
    return {
      cars,
      ok: true,
      total: data.total ?? cars.length,
      page: data.page ?? page,
      pageSize: data.page_size ?? pageSize,
      pages: data.pages ?? 1,
      offset: resolvedOffset,
      countries: Array.isArray(data.countries) ? data.countries : [],
    }
  } catch (err) {
    console.error('[cars] fetch failed:', err)
    return emptyResult()
  }
}

/** Все активные машины (для совместимости; лимит 50). */
export async function getCars(): Promise<Car[]> {
  const { cars } = await fetchCars({ page: 1, pageSize: 50 })
  return cars
}
