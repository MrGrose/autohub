import { CATALOG_DESKTOP_PAGE_SIZE, catalogPageToOffset } from '@/lib/catalog-pagination'

export type CatalogSort = 'price-asc' | 'price-desc'
export type CatalogView = 'offers' | 'price'

export function parseCatalogSort(value?: string): CatalogSort {
  return value === 'price-asc' ? 'price-asc' : 'price-desc'
}

export function parseCatalogView(value?: string): CatalogView {
  return value === 'price' ? 'price' : 'offers'
}

/** Смещение в списке (0-based). Старые ссылки ?page=N трактуются как desktop-страница. */
export function parseCatalogOffset(params: { offset?: string; page?: string }): number {
  const rawOffset = parseInt(params.offset ?? '', 10)
  if (Number.isFinite(rawOffset) && rawOffset >= 0) return rawOffset

  const legacyPage = Math.max(1, parseInt(params.page ?? '1', 10) || 1)
  return catalogPageToOffset(legacyPage, CATALOG_DESKTOP_PAGE_SIZE)
}

export function buildCatalogHref(
  offset: number,
  country: string,
  sort: CatalogSort,
  view: CatalogView = 'offers',
): string {
  const params = new URLSearchParams()
  if (offset > 0) params.set('offset', String(offset))
  if (country && country !== 'Все') params.set('country', country)
  if (sort === 'price-asc') params.set('sort', sort)
  if (view === 'price') params.set('view', 'price')
  const q = params.toString()
  return q ? `/catalog?${q}` : '/catalog'
}
