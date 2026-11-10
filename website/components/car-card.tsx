'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Car } from '@/data/car'
import { carPriceDisplay } from '@/lib/car-format'
import { cn } from '@/lib/utils'
import { CarPhotoLightbox } from '@/components/car-photo-lightbox'
import { Car as CarIcon, ChevronLeft, ChevronRight } from 'lucide-react'

interface CarCardProps {
  car: Car
}

function buildPhotoList(car: Car): string[] {
  const list = car.images?.length ? [...car.images] : []
  if (car.image && !list.includes(car.image)) list.unshift(car.image)
  return [...new Set(list.filter(Boolean))]
}

export function CarCard({ car }: CarCardProps) {
  const photoList = buildPhotoList(car)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)
  const priceLine = carPriceDisplay(car)
  const title = car.name?.trim() || 'Автомобиль'
  const description = car.description?.trim()
  const descriptionLong =
    !!description &&
    (description.length > 180 || description.split('\n').length > 5)

  const go = useCallback(
    (delta: number) => {
      if (photoList.length < 2) return
      setPhotoIndex((i) => (i + delta + photoList.length) % photoList.length)
    },
    [photoList.length],
  )

  const hasGallery = photoList.length > 1

  useEffect(() => {
    setPhotoIndex(0)
    setDescExpanded(false)
  }, [car.id])

  return (
    <div className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-smooth flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {photoList.length > 0 ? (
          <>
            {photoList.map((src, i) => (
              <div
                key={src}
                className={cn(
                  'absolute inset-0 transition-opacity duration-300',
                  i === photoIndex ? 'opacity-100 z-[1]' : 'opacity-0 z-0 pointer-events-none',
                )}
                aria-hidden={i !== photoIndex}
              >
                <Image
                  src={src}
                  alt={i === 0 ? title : `${title} — фото ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={i === 0}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute inset-0 z-[2] cursor-zoom-in bg-transparent border-0 p-0"
              aria-label="Открыть фото"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <CarIcon className="w-16 h-16 opacity-40" />
          </div>
        )}

        {hasGallery && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                go(-1)
              }}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 p-1.5 rounded-full bg-background/90 shadow-sm border border-border/50 hover:bg-background"
              aria-label="Предыдущее фото"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                go(1)
              }}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 p-1.5 rounded-full bg-background/90 shadow-sm border border-border/50 hover:bg-background"
              aria-label="Следующее фото"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {photoList.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPhotoIndex(i)
                  }}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    i === photoIndex ? 'bg-primary scale-110' : 'bg-background/70 hover:bg-background',
                  )}
                  aria-label={`Фото ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-4 md:p-5 flex flex-col flex-1 min-h-0 gap-2">
        <h3 className="font-semibold text-foreground text-base leading-snug shrink-0">
          {title}
        </h3>

        <div className="flex-1 min-h-0">
          {description ? (
            <div className="space-y-1">
              <p
                className={cn(
                  'text-sm text-muted-foreground leading-relaxed whitespace-pre-line',
                  !descExpanded && descriptionLong && 'line-clamp-6',
                )}
              >
                {description}
              </p>
              {descriptionLong && (
                <button
                  type="button"
                  onClick={() => setDescExpanded((v) => !v)}
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {descExpanded ? 'Свернуть' : 'Подробнее'}
                </button>
              )}
            </div>
          ) : null}
        </div>

        <div className="mt-auto shrink-0 pt-3 border-t border-border space-y-2">
          {priceLine && (
            <p className="text-lg font-bold text-primary">{priceLine}</p>
          )}
          <Link href="/contact" className="block">
            <Button size="sm" className="w-full">
              Заказать
            </Button>
          </Link>
        </div>
      </div>

      <CarPhotoLightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        photos={photoList}
        initialIndex={photoIndex}
        title={title}
      />
    </div>
  )
}
