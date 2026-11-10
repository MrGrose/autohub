'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { CTA_CONTACT_SHORT } from '@/data/site-copy'
import { Menu, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Главная' },
  { href: '/catalog', label: 'Каталог' },
  { href: '/services', label: 'Услуги' },
  { href: '/contact', label: 'Контакты' },
]

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 isolate glass">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center gap-4 h-20 md:h-24">
          <Link href="/" className="relative z-[1] inline-block shrink-0" aria-label="Autohub">
            <Image
              src="/brand-label.png"
              alt="Autohub"
              width={1003}
              height={137}
              priority
              className="h-[1.4rem] w-auto md:h-[1.96rem]"
            />
          </Link>

          <nav className="hidden md:flex flex-1 items-center justify-center gap-8" aria-label="Основное меню">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-smooth hover:text-primary',
                  pathname === link.href ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4 shrink-0">
            <a
              href="tel:+79000000000"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth"
            >
              <Phone className="w-4 h-4" />
              +7 900 000 00 00
            </a>
            <Link href="/contact">
              <Button>{CTA_CONTACT_SHORT}</Button>
            </Link>
          </div>

          <div className="relative z-[2] ml-auto md:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="touch-manipulation text-foreground"
              aria-expanded={open}
              aria-haspopup="dialog"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Открыть меню</span>
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetContent
                side="right"
                className="w-full max-w-xs bg-card border-border px-6 pb-8 pt-12"
              >
                <SheetTitle className="sr-only">Меню</SheetTitle>
                <div className="flex flex-col gap-6">
                <nav className="flex flex-col gap-4" aria-label="Мобильное меню">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'text-lg font-medium transition-smooth hover:text-primary py-2',
                        pathname === link.href ? 'text-primary' : 'text-foreground',
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="space-y-3">
                  <a href="tel:+79000000000" className="flex items-center gap-2 text-foreground">
                    <Phone className="w-5 h-5 text-primary" />
                    +7 900 000 00 00
                  </a>
                  <a href="tel:+79000000001" className="flex items-center gap-2 text-foreground">
                    <Phone className="w-5 h-5 text-primary" />
                    +7 900 000 00 01
                  </a>
                </div>
                <Link href="/contact" onClick={() => setOpen(false)}>
                  <Button className="w-full">{CTA_CONTACT_SHORT}</Button>
                </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
