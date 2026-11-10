import { CatalogClient } from '@/components/catalog-client'
import { parseCatalogOffset, parseCatalogSort, parseCatalogView } from '@/lib/catalog-url'
import { CATALOG_DESKTOP_PAGE_SIZE } from '@/lib/catalog-pagination'
import { fetchCars } from '@/lib/cars'
import { fetchImportPrice } from '@/lib/import-price'

type CatalogPageProps = {
  searchParams: Promise<{ offset?: string; page?: string; country?: string; sort?: string; view?: string }>
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams
  const offset = parseCatalogOffset(params)
  const selectedCountry = params.country?.trim() || 'Все'
  const sortBy = parseCatalogSort(params.sort)
  const catalogView = parseCatalogView(params.view)

  const [{ cars, ok, total, pages, countries }, { data: importPrice, ok: importPriceOk }] =
    await Promise.all([
      fetchCars({
        offset,
        pageSize: CATALOG_DESKTOP_PAGE_SIZE,
        country: selectedCountry === 'Все' ? undefined : selectedCountry,
        sort: sortBy,
      }),
      fetchImportPrice(),
    ])

  return (
    <CatalogClient
      initialCars={cars}
      apiOk={ok}
      total={total}
      offset={offset}
      pages={pages}
      pageSize={CATALOG_DESKTOP_PAGE_SIZE}
      countries={countries}
      selectedCountry={selectedCountry}
      sortBy={sortBy}
      catalogView={catalogView}
      importPrice={importPrice}
      importPriceOk={importPriceOk}
    />
  )
}
