import Image from 'next/image'
import { cn } from '@/lib/utils'

export type PageBackgroundPreset = 'default' | 'hero'

type PageBackgroundProps = {
  imageSrc: string
  imageAlt: string
  /** default — внутренние страницы; hero — главная, чуть светлее */
  preset?: PageBackgroundPreset
  /** fixed — фон на весь экран при скролле */
  fixed?: boolean
  priority?: boolean
  className?: string
  imageClassName?: string
  overlayClassName?: string
}

const PRESETS: Record<
  PageBackgroundPreset,
  { imageClassName: string; overlayClassName: string }
> = {
  default: {
    imageClassName: 'opacity-40',
    overlayClassName: 'from-background/85 via-background/70 via-45% to-background',
  },
  hero: {
    imageClassName: 'opacity-60',
    overlayClassName: 'from-background/65 via-background/45 via-45% to-background',
  },
}

/** Фото + градиент в фон сайта. */
export function PageBackground({
  imageSrc,
  imageAlt,
  preset = 'default',
  fixed = true,
  priority = false,
  className,
  imageClassName,
  overlayClassName,
}: PageBackgroundProps) {
  const presetStyles = PRESETS[preset]

  return (
    <div
      aria-hidden
      className={cn(
        'inset-0 z-0 pointer-events-none',
        fixed ? 'fixed' : 'absolute',
        className,
      )}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority={priority}
        quality={75}
        sizes="100vw"
        className={cn(
          'object-cover object-top',
          presetStyles.imageClassName,
          imageClassName,
        )}
      />
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-b',
          presetStyles.overlayClassName,
          overlayClassName,
        )}
      />
    </div>
  )
}
