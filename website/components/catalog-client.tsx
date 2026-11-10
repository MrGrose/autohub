'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CarCard } from '@/components/car-card'
import { ImportPriceList } from '@/components/import-price-list'
import { PageBackground } from '@/components/page-background'
import {
  GlassRadioGroup,
  GlassRadioLinkGroup,
  type GlassRadioLinkOption,
  type GlassRadioOption,
} from '@/components/ui/glass-radio-group'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'
import type { Car } from '@/data/car'
import type { ImportPriceData } from '@/data/import-price'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  buildCatalogHref,
  type CatalogSort,
  type CatalogView,
} from '@/lib/catalog-url'
import { catalogPageSize } from '@/lib/catalog-pagination'
import { cn } from '@/lib/utils'

const PREFERRED_COUNTRIES = ['China', 'Korea', 'Japan', 'UAE'] as const
const countryLabels: Record<string, string> = {
  Все: 'Все страны',
  China: 'Китай',
  Korea: 'Корея',
  Japan: 'Япония',
  UAE: 'ОАЭ',
}

function filterCountryLabel(code: string): string {
  if (code === 'Все') return countryLabels.Все
  return countryLabels[code] ?? code
}

type CatalogClientProps = {
  initialCars: Car[]
  apiOk: boolean
  total: number
  offset: number
  pages: number
  pageSize: number
  countries: string[]
  selectedCountry: string
  sortBy: CatalogSort
  catalogView: CatalogView
  importPrice: ImportPriceData
  importPriceOk: boolean
}

function pageRange(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const start = Math.max(1, current - 2)
  const end = Math.min(total, start + 4)
  const adjustedStart = Math.max(1, end - 4)
  return Array.from({ length: end - adjustedStart + 1 }, (_, i) => adjustedStart + i)
}

export function CatalogClient({
  initialCars,
  apiOk,
  total,
  offset,
  pages,
  pageSize: ssrPageSize,
  countries: apiCountries,
  selectedCountry,
  sortBy,
  catalogView,
  importPrice,
  importPriceOk,
}: CatalogClientProps) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const desiredPageSize = catalogPageSize(isMobile)

  const [cars, setCars] = useState(initialCars)
  const [listTotal, setListTotal] = useState(total)
  const [listPages, setListPages] = useState(pages)
  const [listPageSize, setListPageSize] = useState(ssrPageSize)
  const [listLoading, setListLoading] = useState(false)
  const [priceQuery, setPriceQuery] = useState('')
  const [priceCountry, setPriceCountry] = useState('all')

  const currentPage = Math.floor(offset / listPageSize) + 1

  useEffect(() => {
    if (desiredPageSize === ssrPageSize) {
      setCars(initialCars)
      setListTotal(total)
      setListPages(pages)
      setListPageSize(ssrPageSize)
      return
    }

    let cancelled = false
    setListLoading(true)
    setCars([])

    const params = new URLSearchParams({
      offset: String(offset),
      page_size: String(desiredPageSize),
      sort: sortBy,
    })
    if (selectedCountry !== 'Все') params.set('country', selectedCountry)

    fetch(`/api/cars?${params}`)
      .then((res) => res.json())
      .then((data: {
        cars?: Car[]
        total?: number
        pages?: number
        page_size?: number
      }) => {
        if (cancelled) return
        setCars(Array.isArray(data.cars) ? data.cars : [])
        setListTotal(data.total ?? 0)
        setListPages(data.pages ?? 1)
        setListPageSize(data.page_size ?? desiredPageSize)
      })
      .catch(() => {
        if (!cancelled) setCars([])
      })
      .finally(() => {
        if (!cancelled) setListLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [
    desiredPageSize,
    ssrPageSize,
    initialCars,
    total,
    pages,
    offset,
    selectedCountry,
    sortBy,
  ])

  const countryOptions = (() => {
    const set = new Set(apiCountries)
    const ordered = PREFERRED_COUNTRIES.filter((c) => set.has(c))
    const rest = [...set]
      .filter((c) => !PREFERRED_COUNTRIES.includes(c as (typeof PREFERRED_COUNTRIES)[number]))
      .sort((a, b) => filterCountryLabel(a).localeCompare(filterCountryLabel(b), 'ru'))
    return ['Все', ...ordered, ...rest]
  })()

  const from = listTotal === 0 ? 0 : offset + 1
  const to = Math.min(offset + listPageSize, listTotal)
  const hasPrev = offset > 0
  const hasNext = offset + listPageSize < listTotal

  const viewOptions: GlassRadioLinkOption[] = [
    {
      value: 'offers',
      href: buildCatalogHref(0, selectedCountry, sortBy, 'offers'),
      label: 'Предложения',
    },
    {
      value: 'price',
      href: buildCatalogHref(0, selectedCountry, sortBy, 'price'),
      label: 'Под заказ',
    },
  ]

  const offerCountryOptions: GlassRadioLinkOption[] = countryOptions.map((country) => ({
    value: country,
    href: buildCatalogHref(0, country, sortBy, 'offers'),
    label: country === 'Все' ? 'Все' : filterCountryLabel(country),
  }))

  const priceCountryOptions: GlassRadioOption[] = [
    { value: 'all', label: 'Все' },
    ...importPrice.countries.map((country) => ({
      value: country.code,
      label: country.label,
    })),
  ]

  return (
    <div className="relative flex min-h-full flex-col">
      <PageBackground
        imageSrc="/fon2.jpg"
        imageAlt=""
      />
      <div className="relative z-10 pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 md:mb-12">
          <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">Каталог</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            {catalogView === 'price' ? 'Каталог автомобилей для импорта' : 'Актуальные предложения'}
          </h1>
          {catalogView === 'price' && (
            <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed max-w-3xl">
              Ориентировочный перечень автомобилей, доступных для заказа из-за рубежа. Итоговая
              стоимость зависит от комплектации, состояния, года выпуска, страны поставки и текущего
              курса валют.
            </p>
          )}
        </div>

        <div className="mb-6 md:mb-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-3">
            <GlassRadioLinkGroup
              aria-label="Раздел каталога"
              value={catalogView}
              options={viewOptions}
              activeVariant="primary"
              className="w-full sm:w-auto shrink-0"
              segmentClassName="min-w-[5.5rem] sm:min-w-[4.5rem] md:min-w-20"
            />

            {catalogView === 'offers' && (
              <>
                <div className="hidden lg:block h-6 w-px bg-border/60 shrink-0" aria-hidden />

                <GlassRadioLinkGroup
                  aria-label="Страна"
                  value={selectedCountry}
                  options={offerCountryOptions}
                  activeVariant="primary"
                  mobileOverflow
                  className="min-w-0 w-full lg:w-auto"
                  segmentClassName="px-2.5 md:min-w-16 md:px-3 font-medium"
                />
              </>
            )}

            {catalogView === 'price' && importPriceOk && (
              <>
                <div className="hidden lg:block h-6 w-px bg-border/60 shrink-0" aria-hidden />

                <GlassRadioGroup
                  aria-label="Страна"
                  value={priceCountry}
                  onValueChange={setPriceCountry}
                  options={priceCountryOptions}
                  activeVariant="primary"
                  mobileOverflow
                  className="min-w-0 w-full lg:w-auto"
                  segmentClassName="px-2.5 md:min-w-16 md:px-3 font-medium"
                />
              </>
            )}
          </div>
        </div>

        {catalogView === 'offers' && (
          <>
            {!apiOk && (
              <div className="glass rounded-xl p-6 mb-8 border border-destructive/30 text-center">
                <p className="text-muted-foreground mb-3">
                  Каталог временно недоступен. Проверьте, что API запущен, или обновите страницу позже.
                </p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Обновить
                </Button>
              </div>
            )}

            {apiOk && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap sm:gap-4">
                <p className="text-sm text-muted-foreground shrink-0">
                  {listTotal === 0 ? (
                    <>
                      <span className="sm:hidden tabular-nums">0 авто</span>
                      <span className="hidden sm:inline">Найдено: 0 автомобилей</span>
                    </>
                  ) : (
                    <>
                      <span className="sm:hidden tabular-nums">
                        {from === to ? from : `${from}–${to}`}
                        <span className="text-muted-foreground/70"> / </span>
                        <span className="text-foreground font-medium">{listTotal}</span>
                      </span>
                      <span className="hidden sm:inline">
                        Показано {from === to ? from : `${from}–${to}`} из{' '}
                        <span className="text-foreground font-medium">{listTotal}</span> автомобилей
                      </span>
                    </>
                  )}
                </p>
                <GlassRadioGroup
                  aria-label="Сортировка"
                  value={sortBy}
                  onValueChange={(next) => {
                    router.push(
                      buildCatalogHref(0, selectedCountry, next as CatalogSort, 'offers'),
                    )
                  }}
                  options={[
                    { value: 'price-asc', label: 'Дешевле' },
                    { value: 'price-desc', label: 'Дороже' },
                  ]}
                  activeVariant="primary"
                  className="shrink-0 ml-auto sm:ml-0"
                  segmentClassName="min-w-[3.25rem] px-2 sm:min-w-[4.5rem] sm:px-3 md:min-w-20 md:px-4"
                />
              </div>
            )}

            {apiOk && listLoading && cars.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Загрузка каталога…</p>
            ) : apiOk && cars.length > 0 ? (
              <>
                <div
                  className={cn(
                    'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
                    listLoading && 'opacity-50 pointer-events-none',
                  )}
                >
                  {cars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>

                {listPages > 1 && (
                  <Pagination className="mt-10">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationLink
                          href={
                            hasPrev
                              ? buildCatalogHref(
                                  Math.max(0, offset - listPageSize),
                                  selectedCountry,
                                  sortBy,
                                  'offers',
                                )
                              : '#'
                          }
                          size="default"
                          aria-label="Предыдущая страница"
                          className={cn(
                            'gap-1 px-2.5',
                            !hasPrev && 'pointer-events-none opacity-50',
                          )}
                        >
                          Назад
                        </PaginationLink>
                      </PaginationItem>
                      {pageRange(currentPage, listPages).map((p) => (
                        <PaginationItem key={p}>
                          <PaginationLink
                            href={buildCatalogHref(
                              (p - 1) * listPageSize,
                              selectedCountry,
                              sortBy,
                              'offers',
                            )}
                            isActive={p === currentPage}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationLink
                          href={
                            hasNext
                              ? buildCatalogHref(
                                  offset + listPageSize,
                                  selectedCountry,
                                  sortBy,
                                  'offers',
                                )
                              : '#'
                          }
                          size="default"
                          aria-label="Следующая страница"
                          className={cn(
                            'gap-1 px-2.5',
                            !hasNext && 'pointer-events-none opacity-50',
                          )}
                        >
                          Вперёд
                        </PaginationLink>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : apiOk ? (
              <div className="glass rounded-xl p-12 text-center">
                <p className="text-muted-foreground text-lg mb-4">
                  Автомобилей по выбранным фильтрам не найдено.
                </p>
                <Button variant="outline" asChild>
                  <Link href={buildCatalogHref(0, 'Все', sortBy, 'offers')}>Сбросить фильтры</Link>
                </Button>
              </div>
            ) : null}
          </>
        )}

        {catalogView === 'price' && (
          <ImportPriceList
            data={importPrice}
            apiOk={importPriceOk}
            query={priceQuery}
            onQueryChange={setPriceQuery}
            countryCode={priceCountry}
            onResetFilters={() => {
              setPriceQuery('')
              setPriceCountry('all')
            }}
          />
        )}

        <div className="mt-10 md:mt-20 glass rounded-lg md:rounded-xl p-5 md:p-12 text-center">
          <h2 className="text-lg md:text-3xl font-bold text-foreground mb-2 md:mb-4 text-balance">
            Не нашли нужный автомобиль?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 max-w-xl mx-auto">
            Мы подберём автомобиль по вашим требованиям у проверенных дилеров Китая, Кореи, Японии и
            ОАЭ.
          </p>
          <Link href="/contact">
            <Button size="lg">Заказать подбор</Button>
          </Link>
        </div>
      </div>
      </div>
    </div>
  )
}
