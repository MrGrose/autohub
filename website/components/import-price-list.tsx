'use client'

import Link from 'next/link'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  type ImportPriceData,
  type ImportPriceSection,
  type ParsedEngineOption,
  parseEngineOptions,
  sectionTitle,
} from '@/data/import-price'
import { pluralModels } from '@/lib/plural-ru'
import { cn } from '@/lib/utils'

type ImportPriceListProps = {
  data: ImportPriceData
  apiOk: boolean
  query: string
  onQueryChange: (query: string) => void
  countryCode: string
  onResetFilters: () => void
}

function matchesQuery(name: string, specs: string, horsepower: string | null | undefined, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  if (name.toLowerCase().includes(q) || specs.toLowerCase().includes(q)) return true
  if (horsepower?.toLowerCase().includes(q)) return true
  return parseEngineOptions(specs, horsepower).some(
    (opt) =>
      opt.engine.toLowerCase().includes(q) ||
      (opt.hp?.toLowerCase().includes(q) ?? false),
  )
}

function filterSections(sections: ImportPriceSection[], countryCode: string, query: string) {
  return sections
    .filter((section) => countryCode === 'all' || section.country.code === countryCode)
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        matchesQuery(item.name, item.specs, item.horsepower, query),
      ),
    }))
    .filter((section) => section.items.length > 0)
}

function OptionBadges({
  options,
  field,
  className,
}: {
  options: ParsedEngineOption[]
  field: 'engine' | 'hp'
  className?: string
}) {
  const values = options
    .map((opt) => (field === 'engine' ? opt.engine : opt.hp))
    .filter((value): value is string => Boolean(value?.trim()))

  if (values.length === 0) {
    return <span className="text-sm md:text-base text-muted-foreground">—</span>
  }

  return (
    <div className={cn('flex flex-wrap gap-x-2 gap-y-1', className)}>
      {values.map((value, index) => (
        <span
          key={`${field}-${value}-${index}`}
          className="text-sm md:text-base font-medium text-foreground"
        >
          {value}
        </span>
      ))}
    </div>
  )
}

function formatInlineField(options: ParsedEngineOption[], field: 'engine' | 'hp'): string {
  const values = options
    .map((opt) => (field === 'engine' ? opt.engine : opt.hp))
    .filter((value): value is string => Boolean(value?.trim()))
  return values.length > 0 ? values.join(' · ') : '—'
}

const SECTION_SCROLL_CLASS =
  'max-h-[min(70vh,720px)] overflow-y-auto overscroll-contain border-t border-border/60 px-4 md:px-6'

const MOBILE_ROW_GRID =
  'grid grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_2.25rem_auto] gap-x-1.5 gap-y-1 py-3 pl-4 pr-3 text-xs'

function MobileContactLink({ compact = false }: { compact?: boolean }) {
  return (
    <Button
      variant="ghostPrimary"
      size="sm"
      asChild
      className={cn(
        'h-auto min-h-8 font-medium whitespace-nowrap',
        compact ? 'px-1 text-xs' : 'px-3 text-sm md:text-base',
      )}
    >
      <Link href="/contact">Уточнить</Link>
    </Button>
  )
}

function MobilePriceRow({
  name,
  engineLine,
  hpLine,
}: {
  name: string
  engineLine: string
  hpLine: string
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const nameColRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLSpanElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const [wraps, setWraps] = useState(false)

  useLayoutEffect(() => {
    const col = nameColRef.current
    const measure = measureRef.current
    if (!col || !measure) return

    const check = () => {
      const colWidth = col.clientWidth
      if (colWidth <= 0) return

      const nameEl = nameRef.current
      const naturalWidth = measure.offsetWidth
      const truncated =
        Boolean(nameEl && nameEl.scrollWidth > nameEl.clientWidth + 1)

      setWraps((prev) => {
        const next = naturalWidth >= colWidth || truncated
        return prev === next ? prev : next
      })
    }

    check()
    const observer = new ResizeObserver(check)
    observer.observe(col)
    if (rowRef.current) observer.observe(rowRef.current)
    return () => observer.disconnect()
  }, [name])

  return (
    <div ref={rowRef} className={cn(MOBILE_ROW_GRID, 'items-center')}>
      <div ref={nameColRef} className="relative col-start-1 min-w-0 self-center">
        <span
          ref={measureRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 whitespace-nowrap text-xs opacity-0 font-medium"
        >
          {name}
        </span>
        <span
          ref={nameRef}
          className={cn(
            'text-xs font-medium text-foreground',
            wraps ? 'break-words' : 'block truncate',
          )}
        >
          {name}
        </span>
      </div>
      <span className="col-start-2 min-w-0 self-center truncate text-left text-muted-foreground">
        {engineLine}
      </span>
      <span className="col-start-3 self-center text-center tabular-nums text-muted-foreground">
        {hpLine}
      </span>
      <div className="col-start-4 shrink-0 self-center flex justify-end">
        <MobileContactLink compact />
      </div>
    </div>
  )
}

function PriceTable({ section }: { section: ImportPriceSection }) {
  return (
    <>
      <div className="sm:hidden -mx-4 divide-y divide-border/40">
        {section.items.map((item) => {
          const options = parseEngineOptions(item.specs, item.horsepower)
          const engineLine = formatInlineField(options, 'engine')
          const hpLine = formatInlineField(options, 'hp')

          return (
            <MobilePriceRow
              key={item.id}
              name={item.name}
              engineLine={engineLine}
              hpLine={hpLine}
            />
          )
        })}
      </div>

      <div className="hidden sm:block overflow-hidden -mx-4 md:-mx-6">
        <Table className="table-fixed">
          <TableHeader className="table-header-group">
            <TableRow className="sticky top-0 z-10 bg-[rgba(22,22,30,0.95)] hover:bg-[rgba(22,22,30,0.95)] border-border/60">
              <TableHead className="pl-4 md:pl-6 text-sm md:text-base">Модель</TableHead>
              <TableHead className="text-center text-sm md:text-base">Двигатель</TableHead>
              <TableHead className="text-center text-sm md:text-base uppercase">Л.с.</TableHead>
              <TableHead className="text-center text-sm md:text-base" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {section.items.map((item) => {
              const options = parseEngineOptions(item.specs, item.horsepower)
              return (
                <TableRow key={item.id} className="border-border/40 hover:bg-transparent">
                  <TableCell className="min-w-0 pl-4 md:pl-6 text-sm md:text-base font-medium text-foreground align-top py-3 md:py-4">
                    {item.name}
                  </TableCell>
                  <TableCell className="min-w-0 whitespace-normal text-center align-middle py-3 md:py-4">
                    <OptionBadges options={options} field="engine" className="justify-center" />
                  </TableCell>
                  <TableCell className="min-w-0 whitespace-normal text-center align-middle py-3 md:py-4">
                    <OptionBadges options={options} field="hp" className="justify-center" />
                  </TableCell>
                  <TableCell className="whitespace-normal text-center align-middle py-3 md:py-4">
                    <Button
                      variant="ghostPrimary"
                      asChild
                      className="h-auto min-h-8 px-3 text-sm md:text-base font-medium"
                    >
                      <Link href="/contact">Уточнить</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export function ImportPriceList({
  data,
  apiOk,
  query,
  onQueryChange,
  countryCode,
  onResetFilters,
}: ImportPriceListProps) {
  const filtered = useMemo(
    () => filterSections(data.sections, countryCode, query),
    [data.sections, countryCode, query],
  )
  const totalShown = useMemo(
    () => filtered.reduce((sum, section) => sum + section.items.length, 0),
    [filtered],
  )

  const listKey = `${countryCode}-${query.trim()}`
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    setOpenIds(new Set())
  }, [listKey])

  const toggleSection = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (!apiOk) {
    return (
      <div className="glass rounded-xl p-6 border border-destructive/30 text-center">
        <p className="text-muted-foreground">
          Прайс-лист временно недоступен. Проверьте, что API запущен, или обновите страницу позже.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground shrink-0">
          {totalShown === 0 ? (
            'Ничего не найдено'
          ) : (
            <>
              Показано{' '}
              <span className="text-foreground font-medium">{totalShown}</span>{' '}
              {pluralModels(totalShown)}
            </>
          )}
        </p>
        <div className="flex w-full sm:w-auto sm:min-w-[280px] lg:min-w-[320px] items-center gap-2 shrink-0">
          <label htmlFor="price-search" className="shrink-0 text-xs md:text-sm font-medium text-foreground">
            Поиск
          </label>
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary pointer-events-none" />
            <Input
              id="price-search"
              type="search"
              placeholder="Модель, двигатель, л.с."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              aria-label="Поиск по модели, двигателю или л.с."
              className="search-clear-white h-8 md:h-9 w-full rounded-md border border-white/10 bg-transparent dark:bg-transparent pl-9 pr-3 text-xs text-white/90 shadow-none transition-all duration-200 placeholder:text-white/50 hover:bg-[rgba(30,30,40,0.55)] focus-visible:border-primary/40 focus-visible:bg-[rgba(30,30,40,0.55)] focus-visible:ring-primary/20 md:text-sm"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-muted-foreground text-lg mb-4">
            {query.trim()
              ? `По запросу «${query.trim()}» моделей не найдено.`
              : 'Нет позиций.'}
          </p>
          {(query.trim() || countryCode !== 'all') && (
            <Button variant="outline" onClick={onResetFilters}>
              Сбросить фильтры
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4 md:space-y-5">
          {filtered.map((section) => {
            const isOpen = openIds.has(section.id)
            return (
              <div
                key={section.id}
                className="glass-solid rounded-lg md:rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center justify-between gap-3 px-4 md:px-6 py-4 md:py-5 text-left focus-visible:outline-none focus-visible:ring-0"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pr-2 min-w-0">
                    <span className="text-lg md:text-xl font-semibold text-foreground">
                      {sectionTitle(section)}
                    </span>
                    <span className="text-sm text-muted-foreground font-normal">
                      {section.items.length} {pluralModels(section.items.length)}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                      isOpen && 'rotate-180',
                    )}
                    aria-hidden
                  />
                </button>
                {isOpen ? (
                  <div className={SECTION_SCROLL_CLASS}>
                    <PriceTable section={section} />
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
