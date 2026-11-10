import { NextResponse } from 'next/server'
import { fetchCars } from '@/lib/cars'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') ?? '1', 10) || 1
  const pageSize = parseInt(searchParams.get('page_size') ?? '12', 10) || 12
  const offsetParam = searchParams.get('offset')
  const offset = offsetParam !== null ? parseInt(offsetParam, 10) : undefined
  const country = searchParams.get('country') ?? undefined
  const sort = searchParams.get('sort') === 'price-asc' ? 'price-asc' : 'price-desc'

  const result = await fetchCars({
    ...(offset !== undefined && Number.isFinite(offset) ? { offset } : { page }),
    pageSize,
    country: country || undefined,
    sort,
  })
  return NextResponse.json({
    cars: result.cars,
    ok: result.ok,
    total: result.total,
    page: result.page,
    pages: result.pages,
    page_size: result.pageSize,
    offset: result.offset,
    countries: result.countries,
  })
}

