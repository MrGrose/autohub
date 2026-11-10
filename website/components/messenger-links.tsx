import Image from 'next/image'
import { socialLinks } from '@/lib/social-links'
import { cn } from '@/lib/utils'

const footerIcon = 32
const cardIcon = 40
const heroIcon = 36

export function MessengerIconButtons({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {socialLinks.map(({ href, label, iconSrc }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Написать в ${label}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/60 hover:bg-secondary transition-smooth"
        >
          <Image
            src={iconSrc}
            alt=""
            width={heroIcon}
            height={heroIcon}
            className="h-9 w-9 shrink-0 object-contain"
            aria-hidden
          />
        </a>
      ))}
    </div>
  )
}

export function MessengerLinksFooter({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {socialLinks.map(({ href, label, iconSrc }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-smooth"
        >
          <Image
            src={iconSrc}
            alt=""
            width={footerIcon}
            height={footerIcon}
            className="h-8 w-8 shrink-0 object-contain"
            aria-hidden
          />
          <span>{label}</span>
        </a>
      ))}
    </div>
  )
}

export function MessengerLinksCards({ className }: { className?: string }) {
  return (
    <div className={cn('grid grid-cols-3 gap-3', className)}>
      {socialLinks.map(({ href, label, iconSrc }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 flex-col items-center gap-2 rounded-xl bg-secondary/50 p-3 text-center hover:bg-secondary transition-smooth"
        >
          <Image
            src={iconSrc}
            alt=""
            width={cardIcon}
            height={cardIcon}
            className="h-10 w-10 shrink-0 object-contain"
            aria-hidden
          />
          <span className="w-full text-xs font-medium leading-tight text-foreground">
            {label}
          </span>
        </a>
      ))}
    </div>
  )
}
