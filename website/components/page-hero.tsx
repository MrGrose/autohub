import Image from 'next/image'
import { cn } from '@/lib/utils'

interface PageHeroProps {
  label: string
  title: string
  description: string
  imageSrc?: string
  imageAlt?: string
  /** Меньше высоты — контент страницы ближе к заголовку (контакты). */
  compact?: boolean
}

/** Верхний блок страницы: опционально фото + градиент, иначе только текст поверх PageBackground. */
export function PageHero({ label, title, description, imageSrc, imageAlt, compact }: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative flex overflow-hidden pt-24 md:pt-28',
        compact
          ? 'min-h-0 items-start pb-0'
          : 'min-h-[42vh] md:min-h-[48vh] items-center justify-center',
      )}
    >
      {imageSrc ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={imageSrc}
            alt={imageAlt ?? ''}
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
      ) : null}

      <div
        className={cn(
          'container mx-auto px-4 md:px-6 relative z-10',
          compact ? 'py-6 md:py-8' : 'py-10 md:py-14',
        )}
      >
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">{label}</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            {title}
          </h1>
          <p className="text-muted-foreground text-lg text-pretty">{description}</p>
        </div>
      </div>
    </section>
  )
}
