import Link from 'next/link'
import { Phone, MapPin } from 'lucide-react'
import { Logo } from '@/components/logo'
import { MessengerLinksFooter } from '@/components/messenger-links'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-transparent">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-4 lg:gap-12 items-start">
          {/* Brand — desktop only */}
          <div className="hidden lg:flex items-start justify-start self-start -translate-y-2 xl:-translate-y-3">
            <Logo variant="circle" size="xl" />
          </div>

          {/* Navigation — desktop only */}
          <div className="hidden lg:block space-y-4">
            <h3 className="text-xs lg:text-sm font-semibold text-foreground uppercase tracking-wider">Навигация</h3>
            <nav className="flex flex-col gap-1.5 lg:gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                Главная
              </Link>
              <Link href="/catalog" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                Каталог
              </Link>
              <Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                Услуги
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                Контакты
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-3 lg:space-y-4">
            <h3 className="text-xs lg:text-sm font-semibold text-foreground uppercase tracking-wider">Контакты</h3>
            <div className="flex flex-col gap-2 lg:gap-3">
              <a
                href="tel:+79000000000"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth"
              >
                <Phone className="w-4 h-4" />
                +7 900 000 00 00
              </a>
              <a
                href="tel:+79000000001"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth"
              >
                <Phone className="w-4 h-4" />
                +7 900 000 00 01
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Воронеж
              </div>
            </div>
          </div>

          {/* Messengers */}
          <div className="space-y-3 lg:space-y-4">
            <h3 className="text-xs lg:text-sm font-semibold text-foreground uppercase tracking-wider">Мессенджеры</h3>
            <MessengerLinksFooter className="gap-2 lg:gap-3" />
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container mx-auto px-4 md:px-6 py-2 md:py-2.5 flex justify-center">
          <p className="text-[11px] leading-tight text-muted-foreground text-center">
            © 2026 Autohub. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}
