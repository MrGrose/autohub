'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

export type GlassRadioOption = {
  value: string
  label: ReactNode
}

export type GlassRadioLinkOption = GlassRadioOption & {
  href: string
}

type ActiveVariant = 'neutral' | 'primary'

type GlassRadioGroupBaseProps = {
  value: string
  options: GlassRadioOption[]
  'aria-label'?: string
  className?: string
  activeVariant?: ActiveVariant
  segmentClassName?: string
  mobileOverflow?: boolean
}

type GlassRadioGroupProps = GlassRadioGroupBaseProps & {
  onValueChange: (value: string) => void
}

type GlassRadioLinkGroupProps = GlassRadioGroupBaseProps & {
  options: GlassRadioLinkOption[]
}

const MOBILE_SEGMENT_MIN = 52
const OVERFLOW_TOGGLE_WIDTH = 36

const trackClass =
  'glass-solid relative inline-flex w-fit max-w-full overflow-hidden rounded-md border border-border/60 p-0.5'

const gliderMotion =
  'pointer-events-none absolute inset-y-0.5 left-0 rounded-[calc(var(--radius)-2px)] transition-transform duration-300 ease-out'

const segmentBase =
  'relative z-10 inline-flex h-9 min-w-[4.5rem] md:min-w-20 flex-1 cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-[calc(var(--radius)-2px)] px-3 md:px-4 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]'

function gliderClass(variant: ActiveVariant) {
  return cn(
    gliderMotion,
    variant === 'primary'
      ? 'bg-primary shadow-sm'
      : 'bg-secondary shadow-sm border border-border/50',
  )
}

function segmentClass(isActive: boolean, variant: ActiveVariant, extra?: string) {
  return cn(
    segmentBase,
    extra,
    isActive
      ? cn(
          'font-semibold',
          variant === 'primary'
            ? 'text-primary-foreground'
            : 'text-foreground',
        )
      : 'bg-transparent text-muted-foreground hover:bg-primary hover:text-primary-foreground',
  )
}

function overflowPillClass(isActive: boolean, variant: ActiveVariant) {
  return cn(
    'inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-all outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] no-underline',
    isActive
      ? variant === 'primary'
        ? 'border border-primary bg-primary font-semibold text-primary-foreground'
        : 'border border-border bg-secondary font-semibold text-foreground'
      : 'border border-border bg-transparent text-muted-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground',
  )
}

function useActiveIndex(value: string, options: GlassRadioOption[]) {
  return Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )
}

function calcVisibleCount(containerWidth: number, totalOptions: number): number {
  if (totalOptions <= 1) return totalOptions

  for (let count = totalOptions; count >= 1; count--) {
    const needsToggle = count < totalOptions
    const requiredWidth = count * MOBILE_SEGMENT_MIN + (needsToggle ? OVERFLOW_TOGGLE_WIDTH : 0)
    if (requiredWidth <= containerWidth) return count
  }

  return 1
}

function splitVisibleOptions(
  options: GlassRadioOption[],
  value: string,
  visibleCount: number,
): { visible: GlassRadioOption[]; overflow: GlassRadioOption[] } {
  if (options.length <= visibleCount) {
    return { visible: options, overflow: [] }
  }

  const selectedIndex = options.findIndex((option) => option.value === value)
  if (selectedIndex === -1 || selectedIndex < visibleCount) {
    return {
      visible: options.slice(0, visibleCount),
      overflow: options.slice(visibleCount),
    }
  }

  const selected = options[selectedIndex]
  const visible = [...options.slice(0, visibleCount - 1), selected]
  const visibleValues = new Set(visible.map((option) => option.value))
  const overflow = options.filter((option) => !visibleValues.has(option.value))
  return { visible, overflow }
}

const navButtonClass =
  'glass-solid inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-all outline-none hover:bg-primary hover:text-primary-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-30 disabled:pointer-events-none'

function OverflowToggle({
  expanded,
  onClick,
}: {
  expanded: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-label={expanded ? 'Скрыть остальные страны' : 'Показать остальные страны'}
      onClick={onClick}
      className={navButtonClass}
    >
      <ChevronRight className={cn('h-4 w-4 transition-transform duration-200', expanded && 'rotate-90')} />
    </button>
  )
}

function GlassRadioTrack({
  value,
  options,
  'aria-label': ariaLabel,
  className,
  activeVariant = 'neutral',
  segmentClassName,
  renderSegment,
}: GlassRadioGroupBaseProps & {
  renderSegment: (option: GlassRadioOption, isActive: boolean) => ReactNode
}) {
  const activeIndex = useActiveIndex(value, options)
  const hasActiveInView = options.some((option) => option.value === value)
  const segmentWidth = `${100 / options.length}%`

  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cn(trackClass, className)}>
      {hasActiveInView && (
        <div
          aria-hidden
          className={gliderClass(activeVariant)}
          style={{
            width: segmentWidth,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      )}
      {options.map((option) => {
        const isActive = value === option.value
        return renderSegment(option, isActive)
      })}
    </div>
  )
}

function GlassRadioMobileOverflow({
  value,
  options,
  'aria-label': ariaLabel,
  className,
  activeVariant = 'neutral',
  segmentClassName,
  renderSegment,
  renderOverflowSegment,
}: GlassRadioGroupBaseProps & {
  renderSegment: (option: GlassRadioOption, isActive: boolean) => ReactNode
  renderOverflowSegment: (
    option: GlassRadioOption,
    isActive: boolean,
    collapse: () => void,
  ) => ReactNode
}) {
  const isMobile = useIsMobile()
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(options.length)
  const [expanded, setExpanded] = useState(false)

  useLayoutEffect(() => {
    if (!isMobile) return

    const measure = () => {
      const width = containerRef.current?.clientWidth ?? 0
      if (width <= 0) return
      setVisibleCount(calcVisibleCount(width, options.length))
    }

    measure()
    const observer = new ResizeObserver(measure)
    const node = containerRef.current
    if (node) observer.observe(node)
    return () => observer.disconnect()
  }, [isMobile, options.length])

  const collapse = () => setExpanded(false)

  if (!isMobile) {
    return (
      <GlassRadioTrack
        value={value}
        options={options}
        aria-label={ariaLabel}
        className={className}
        activeVariant={activeVariant}
        segmentClassName={segmentClassName}
        renderSegment={renderSegment}
      />
    )
  }

  const { visible, overflow } = splitVisibleOptions(options, value, visibleCount)
  const hasOverflow = overflow.length > 0

  return (
    <div ref={containerRef} className="w-full min-w-0 lg:w-auto">
      <div className="flex items-center gap-1">
        <GlassRadioTrack
          value={value}
          options={visible}
          aria-label={ariaLabel}
          className={cn('min-w-0 flex-1', className)}
          activeVariant={activeVariant}
          segmentClassName={cn(segmentClassName, 'flex-1 min-w-[3.25rem]')}
          renderSegment={renderSegment}
        />
        {hasOverflow && (
          <OverflowToggle expanded={expanded} onClick={() => setExpanded((open) => !open)} />
        )}
      </div>

      {hasOverflow && expanded && (
        <div
          role="group"
          aria-label={`${ariaLabel ?? 'Фильтр'} — остальные`}
          className="mt-1.5 flex flex-wrap gap-1.5"
        >
          {overflow.map((option) => {
            const isActive = value === option.value
            return (
              <div key={option.value}>{renderOverflowSegment(option, isActive, collapse)}</div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function GlassRadioGroup({
  value,
  onValueChange,
  options,
  'aria-label': ariaLabel,
  className,
  activeVariant = 'neutral',
  segmentClassName,
  mobileOverflow = false,
}: GlassRadioGroupProps) {
  const track = (
    <GlassRadioTrack
      value={value}
      options={options}
      aria-label={ariaLabel}
      className={className}
      activeVariant={activeVariant}
      segmentClassName={segmentClassName}
      renderSegment={(option, isActive) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={isActive}
          onClick={() => onValueChange(option.value)}
          className={segmentClass(isActive, activeVariant, segmentClassName)}
        >
          {option.label}
        </button>
      )}
    />
  )

  if (!mobileOverflow) return track

  return (
    <GlassRadioMobileOverflow
      value={value}
      options={options}
      aria-label={ariaLabel}
      className={className}
      activeVariant={activeVariant}
      segmentClassName={segmentClassName}
      renderSegment={(option, isActive) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={isActive}
          onClick={() => onValueChange(option.value)}
          className={segmentClass(isActive, activeVariant, cn(segmentClassName, 'flex-1 min-w-[3.25rem]'))}
        >
          {option.label}
        </button>
      )}
      renderOverflowSegment={(option, isActive, collapse) => (
        <button
          type="button"
          role="radio"
          aria-checked={isActive}
          onClick={() => {
            onValueChange(option.value)
            collapse()
          }}
          className={overflowPillClass(isActive, activeVariant)}
        >
          {option.label}
        </button>
      )}
    />
  )
}

export function GlassRadioLinkGroup({
  value,
  options,
  'aria-label': ariaLabel,
  className,
  activeVariant = 'neutral',
  segmentClassName,
  mobileOverflow = false,
}: GlassRadioLinkGroupProps) {
  const track = (
    <GlassRadioTrack
      value={value}
      options={options}
      aria-label={ariaLabel}
      className={className}
      activeVariant={activeVariant}
      segmentClassName={segmentClassName}
      renderSegment={(option, isActive) => {
        const linkOption = option as GlassRadioLinkOption
        return (
          <Link
            key={option.value}
            href={linkOption.href}
            role="radio"
            aria-checked={isActive}
            className={cn(segmentClass(isActive, activeVariant, segmentClassName), 'no-underline hover:no-underline')}
          >
            {option.label}
          </Link>
        )
      }}
    />
  )

  if (!mobileOverflow) return track

  return (
    <GlassRadioMobileOverflow
      value={value}
      options={options}
      aria-label={ariaLabel}
      className={className}
      activeVariant={activeVariant}
      segmentClassName={segmentClassName}
      renderSegment={(option, isActive) => {
        const linkOption = option as GlassRadioLinkOption
        return (
          <Link
            key={option.value}
            href={linkOption.href}
            role="radio"
            aria-checked={isActive}
            className={cn(
              segmentClass(isActive, activeVariant, cn(segmentClassName, 'flex-1 min-w-[3.25rem]')),
              'no-underline hover:no-underline',
            )}
          >
            {option.label}
          </Link>
        )
      }}
      renderOverflowSegment={(option, isActive, collapse) => {
        const linkOption = option as GlassRadioLinkOption
        return (
          <Link
            href={linkOption.href}
            role="radio"
            aria-checked={isActive}
            onClick={collapse}
            className={overflowPillClass(isActive, activeVariant)}
          >
            {option.label}
          </Link>
        )
      }}
    />
  )
}
