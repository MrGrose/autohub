import type { ImportPriceData } from '@/data/import-price'

export type ImportPriceFetchResult = {
  data: ImportPriceData
  ok: boolean
}

const emptyData = (): ImportPriceData => ({
  countries: [],
  segments: [],
  sections: [],
})

function apiUrl(): string | null {
  const url = process.env.CARS_API_URL?.trim()
  return url ? url.replace(/\/+$/, '') : null
}

export async function fetchImportPrice(): Promise<ImportPriceFetchResult> {
  const base = apiUrl()
  if (!base) {
    console.error('[import-price] CARS_API_URL не задан (website/.env.local)')
    return { data: emptyData(), ok: false }
  }

  try {
    const res = await fetch(`${base}/api/v1/import-price`, {
      next: { revalidate: 10 },
      signal: AbortSignal.timeout(15_000),
    })
    if (!res.ok) {
      console.error('[import-price] API HTTP', res.status, base)
      return { data: emptyData(), ok: false }
    }
    const data = (await res.json()) as ImportPriceData
    return {
      data: {
        countries: Array.isArray(data.countries) ? data.countries : [],
        segments: Array.isArray(data.segments) ? data.segments : [],
        sections: Array.isArray(data.sections) ? data.sections : [],
      },
      ok: true,
    }
  } catch (err) {
    console.error('[import-price] fetch failed:', err)
    return { data: emptyData(), ok: false }
  }
}
