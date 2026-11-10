import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CarCard } from '@/components/car-card'
import { PageBackground } from '@/components/page-background'
import { steps, advantages } from '@/data/home-content'
import { CTA_CONTACT, CTA_CONTACT_SHORT, IMPORT_COUNTRIES, SITE_TAGLINE } from '@/data/site-copy'
import { fetchCars } from '@/lib/cars'
import { MessengerIconButtons } from '@/components/messenger-links'
import { ArrowRight, Shield, Clock, Truck, FileCheck, FileSignature, KeyRound, Search } from 'lucide-react'

export default async function HomePage() {
  const { cars: featuredCars, ok: apiOk } = await fetchCars({
    page: 1,
    pageSize: 4,
    featured: true,
  })
  const stepIcons = [FileCheck, FileSignature, Search, Shield, Truck, KeyRound]

  return (
    <div className="relative flex min-h-full flex-col">
      <PageBackground
        preset="hero"
        priority
        imageSrc="/home-hero.jpg"
        imageAlt="Premium car"
      />

      <div className="relative z-10 flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 md:min-h-screen md:flex md:items-center md:justify-center md:pt-28 md:pb-0">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm md:text-base">
              {SITE_TAGLINE}
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight text-balance">
              Профессиональный импорт автомобилей из{' '}
              <span className="text-gold-gradient">{IMPORT_COUNTRIES}</span>.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed text-pretty">
              Знаем об этих автомобилях всё: от поставки до ремонта. 
              Честные цены, полное сопровождение на всех этапах.
            </p>
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
              <div className="flex w-full items-center gap-3 sm:w-auto sm:gap-3">
                <Link href="/contact" className="min-w-0 flex-1 sm:flex-none">
                  <Button size="lg" className="w-full sm:w-auto">
                    {CTA_CONTACT}
                  </Button>
                </Link>
                <MessengerIconButtons className="shrink-0" />
              </div>
              <Link href="/catalog" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Подобрать авто
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 hidden md:grid grid-cols-4 gap-8">
              {[
                { value: '500+', label: 'Доставленных авто' },
                { value: '5+', label: 'Лет на рынке' },
                { value: '98%', label: 'Довольных клиентов' },
                { value: '30', label: 'Дней доставка' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* How We Work Section */}
      <section className="pt-10 pb-12 md:-mt-16 md:pt-10 md:pb-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-16">
            <p className="text-primary font-medium mb-2 md:mb-3 tracking-wider uppercase text-xs md:text-sm">Процесс</p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
              Как мы работаем
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {steps.map((step, index) => (
              <div key={step.id} className="relative group">
                <div className="glass rounded-lg md:rounded-xl p-4 md:p-8 h-full glass-hover transition-smooth">
                  <div className="flex items-center gap-3 md:flex-col md:items-start">
                    <div className="w-9 h-9 md:w-12 md:h-12 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center md:mb-4">
                      {(() => {
                        const Icon = stepIcons[index] ?? FileCheck
                        return <Icon className="w-4 h-4 md:w-6 md:h-6 text-primary" />
                      })()}
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <span className="text-xl md:text-3xl font-bold text-primary/20">0{step.id}</span>
                      <h3 className="text-base md:text-lg font-semibold text-foreground">{step.title}</h3>
                    </div>
                  </div>
                  <p className="mt-2 md:mt-3 text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {(index + 1) % 3 !== 0 && index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cars Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          {!apiOk && (
            <div className="glass rounded-xl p-6 mb-8 border border-destructive/30 text-center">
              <p className="text-muted-foreground">
                Каталог временно недоступен — проверьте, что API запущен (порт 8000).
              </p>
            </div>
          )}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">Каталог</p>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance max-md:whitespace-nowrap">
                Популярные автомобили
              </h2>
            </div>
            <Link href="/catalog">
              <Button variant="outline">
                Смотреть все
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {apiOk && featuredCars.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-12 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-16">
            <p className="text-primary font-medium mb-2 md:mb-3 tracking-wider uppercase text-xs md:text-sm">
              Почему мы
            </p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
              Преимущества сервиса
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {advantages.map((advantage, index) => {
              const icons = [Shield, FileCheck, Clock, Truck]
              const Icon = icons[index] ?? Shield
              return (
                <div
                  key={advantage.title}
                  className="glass rounded-lg md:rounded-xl p-4 md:p-8 md:text-center glass-hover transition-smooth"
                >
                  <div className="flex items-center gap-3 md:flex-col md:items-center">
                    <div className="w-9 h-9 md:w-14 md:h-14 shrink-0 rounded-lg md:rounded-full bg-primary/10 flex items-center justify-center md:mb-4">
                      <Icon className="w-4 h-4 md:w-7 md:h-7 text-primary" />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-foreground min-w-0">
                      {advantage.title}
                    </h3>
                  </div>
                  <p className="mt-2 md:mt-0 text-xs md:text-sm text-muted-foreground md:mb-0 leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="glass rounded-2xl p-8 md:p-12 lg:p-16 text-center max-w-4xl mx-auto">
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">
              {SITE_TAGLINE}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              Готовы найти автомобиль мечты?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Позвоните или напишите в мессенджер — и мы поможем.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  {CTA_CONTACT_SHORT}
                </Button>
              </Link>
              <Link href="/catalog" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Смотреть каталог
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  )
}
