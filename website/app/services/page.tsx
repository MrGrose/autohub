import Link from 'next/link'
import { PageBackground } from '@/components/page-background'
import { PageHero } from '@/components/page-hero'
import { CTA_CONTACT_SHORT } from '@/data/site-copy'
import { Button } from '@/components/ui/button'
import { steps } from '@/data/home-content'
import {
  FileCheck,
  Search,
  Shield,
  Truck,
  FileSignature,
  KeyRound,
  BadgeCheck,
  DollarSign,
  Clock,
  Headphones,
} from 'lucide-react'

const guarantees = [
  {
    icon: BadgeCheck,
    title: 'Юридическая чистота',
    description: 'Полная проверка истории автомобиля, VIN-номера и всех документов перед покупкой.',
  },
  {
    icon: DollarSign,
    title: 'Прозрачное ценообразование',
    description: 'Фиксированная стоимость услуг без скрытых платежей. Вы знаете финальную цену заранее.',
  },
  {
    icon: Clock,
    title: 'Соблюдение сроков',
    description: 'Доставка в оговорённые сроки. Средний срок поставки — 25-35 дней.',
  },
  {
    icon: Headphones,
    title: 'Поддержка 24/7',
    description: 'Персональный менеджер на связи на протяжении всего процесса.',
  },
]

export default function ServicesPage() {
  const stepIcons = [FileCheck, FileSignature, Search, Shield, Truck, KeyRound]

  return (
    <div className="relative flex min-h-full flex-col">
      <PageBackground
        imageSrc="/uslugi.jpg"
        imageAlt="Стоянка автомобилей"
      />

      <div className="relative z-10 flex flex-col">
      <PageHero
        compact
        label="Услуги"
        title="Как мы работаем"
        description="Полный цикл услуг по подбору, проверке и доставке автомобилей из Китая, Кореи, Японии и ОАЭ под ключ."
      />

      <section className="pt-12 pb-12 md:pt-4 md:pb-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {steps.map((step, index) => {
                const Icon = stepIcons[index] ?? FileCheck
                return (
                  <div key={step.id} className="glass rounded-lg p-4 glass-hover transition-smooth">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl font-bold text-primary/20">0{step.id}</span>
                        <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="relative hidden md:block">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-px" />

              {steps.map((step, index) => {
                const Icon = stepIcons[index] ?? FileCheck
                return (
                  <div key={step.id} className="relative mb-12 last:mb-0">
                    <div className="absolute left-1/2 top-0 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary">
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>

                    <div className="glass rounded-xl p-8 pt-10">
                      <div className="mb-3 flex items-center gap-3">
                        <span className="text-4xl font-bold text-primary/20">0{step.id}</span>
                        <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                      </div>
                      <p className="leading-relaxed text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-28 bg-card/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-16">
            <p className="text-primary font-medium mb-2 md:mb-3 tracking-wider uppercase text-xs md:text-sm">
              Гарантии
            </p>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
              Почему нам доверяют
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto">
            {guarantees.map((guarantee) => (
              <div
                key={guarantee.title}
                className="glass rounded-lg md:rounded-xl p-4 md:p-8 glass-hover transition-smooth"
              >
                <div className="flex items-center gap-3 md:items-start md:gap-5">
                  <div className="w-9 h-9 md:w-14 md:h-14 shrink-0 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center">
                    <guarantee.icon className="w-4 h-4 md:w-7 md:h-7 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-foreground md:mb-2">
                      {guarantee.title}
                    </h3>
                    <p className="hidden md:block text-sm text-muted-foreground leading-relaxed">
                      {guarantee.description}
                    </p>
                  </div>
                </div>
                <p className="mt-2 md:hidden text-xs text-muted-foreground leading-relaxed">
                  {guarantee.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="glass rounded-xl md:rounded-2xl p-5 md:p-12 lg:p-16 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
              <div>
                <p className="text-primary font-medium mb-2 md:mb-3 tracking-wider uppercase text-xs md:text-sm">
                  О компании
                </p>
                <h2 className="text-xl md:text-4xl font-bold text-foreground mb-3 md:mb-6 text-balance">
                  5+ лет успешной работы на рынке
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3 md:mb-6">
                  Autohub — это команда профессионалов с многолетним опытом в сфере международной торговли
                  автомобилями. Мы работаем напрямую с проверенными дилерами и площадками в Китае, Корее, Японии и ОАЭ.
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Знаем об этих автомобилях всё: от поставки до ремонта. За годы работы мы выстроили надёжную
                  систему проверки и логистики, которая позволяет нашим клиентам получать автомобили в идеальном состоянии.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-6">
                {[
                  { value: '500+', label: 'Доставленных автомобилей' },
                  { value: '98%', label: 'Довольных клиентов' },
                  { value: '15', label: 'Стран-партнёров' },
                  { value: '24/7', label: 'Поддержка клиентов' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-secondary/50 rounded-lg md:rounded-xl p-4 md:p-6 text-center"
                  >
                    <p className="text-2xl md:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                    <p className="text-[11px] md:text-xs text-muted-foreground leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-28 bg-card/30 pb-12 md:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="glass rounded-xl md:rounded-2xl p-5 md:p-12 lg:p-16 text-center max-w-4xl mx-auto">
            <h2 className="text-xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 md:mb-4 text-balance">
              Готовы начать?
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground mb-5 md:mb-8 max-w-2xl mx-auto text-pretty">
              Позвоните или напишите — бесплатно проконсультируем по подбору автомобиля.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
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
