'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type CarPhotoLightboxProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  photos: string[]
  initialIndex?: number
  title: string
}

export function CarPhotoLightbox({
  open,
  onOpenChange,
  photos,
  initialIndex = 0,
  title,
}: CarPhotoLightboxProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: photos.length > 1,
    startIndex: initialIndex,
  })
  const [index, setIndex] = useState(initialIndex)

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    onSelect()
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  useEffect(() => {
    if (open && emblaApi) {
      emblaApi.scrollTo(initialIndex, true)
      setIndex(initialIndex)
    }
  }, [open, initialIndex, emblaApi])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (photos.length === 0) return null

  const hasMany = photos.length > 1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-w-[min(96vw,1024px)] w-full gap-0 overflow-hidden p-0',
          'border-zinc-800 bg-zinc-950 text-white sm:max-w-[min(96vw,1024px)]',
          '[&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:hover:text-zinc-200',
        )}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>

        <div className="relative pt-2">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {photos.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="min-w-0 shrink-0 grow-0 basis-full"
                >
                  <div className="relative mx-auto h-[min(75vh,680px)] w-full">
                    <Image
                      src={src}
                      alt={i === 0 ? title : `${title} — фото ${i + 1}`}
                      fill
                      className="object-contain"
                      sizes="96vw"
                      priority={i === initialIndex}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {hasMany && (
            <>
              <button
                type="button"
                onClick={scrollPrev}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 p-2 text-white hover:bg-black/80"
                aria-label="Предыдущее фото"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 p-2 text-white hover:bg-black/80"
                aria-label="Следующее фото"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-zinc-800 px-4 py-3">
          <p className="truncate text-sm text-zinc-200">{title}</p>
          {hasMany && (
            <p className="shrink-0 text-sm text-zinc-400">
              {index + 1} / {photos.length}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
