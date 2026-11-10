import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type LogoVariant = 'horizontal' | 'circle'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: LogoVariant
  linkEnabled?: boolean
}

const horizontalSizeClass = {
  sm: 'h-8 w-auto max-w-[120px]',
  md: 'h-10 w-auto max-w-[150px] md:h-12 md:max-w-[180px]',
  lg: 'h-14 w-auto max-w-[210px]',
  xl: 'h-16 w-auto max-w-[240px] md:h-20 md:max-w-[300px]',
} as const

const circleSizeClass = {
  sm: 'h-12 w-12',
  md: 'h-[4.5rem] w-[4.5rem] md:h-24 md:w-24',
  lg: 'h-28 w-28',
  xl: 'h-36 w-36 md:h-48 md:w-48',
} as const

const logoConfig = {
  horizontal: {
    src: '/brand-label.png',
    width: 1003,
    height: 137,
    sizeClass: horizontalSizeClass,
    imgClass: 'object-contain object-left',
  },
  circle: {
    src: '/logo-circle.png?v=5',
    width: 512,
    height: 512,
    sizeClass: circleSizeClass,
    imgClass: 'object-contain',
  },
} as const

export function Logo({
  className,
  size = 'md',
  variant = 'horizontal',
  linkEnabled = true,
}: LogoProps) {
  const cfg = logoConfig[variant]

  const logo = (
    <Image
      src={cfg.src}
      alt="Autohub"
      width={cfg.width}
      height={cfg.height}
      className={cn('shrink-0', cfg.imgClass, cfg.sizeClass[size], className)}
      priority={variant === 'horizontal'}
    />
  )

  if (linkEnabled) {
    return (
      <Link href="/" className="inline-block shrink-0">
        {logo}
      </Link>
    )
  }

  return logo
}
