import { PageBackground } from '@/components/page-background'
import { Phone, MapPin } from 'lucide-react'
import { MessengerLinksCards } from '@/components/messenger-links'

export default function ContactPage() {
  return (
    <div className="relative flex min-h-full flex-col">
      <PageBackground
        imageSrc="/contact-car-carrier.jpg"
        imageAlt="Автовоз с легковыми автомобилями на платформе"
      />

      <div className="relative z-10 flex flex-col flex-1 pt-24 md:pt-28">
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">Контакты</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              Свяжитесь с нами
            </h1>
            <p className="text-muted-foreground text-lg text-pretty">
              Телефон, мессенджеры — выберите, как удобнее.
            </p>
          </div>
        </div>

        <section className="flex-1 pt-2 md:pt-4 pb-16 md:pb-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto w-full max-w-md space-y-5">
              <div className="glass rounded-2xl p-5 md:p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Быстрая связь</h3>
                <div className="space-y-4">
                  <a
                    href="tel:+79000000000"
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-smooth group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">+7 900 000 00 00</p>
                      <p className="text-sm text-muted-foreground">Звоните с 9:00 до 21:00</p>
                    </div>
                  </a>

                  <a
                    href="tel:+79000000001"
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-smooth group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">+7 900 000 00 01</p>
                      <p className="text-sm text-muted-foreground">Второй номер</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Воронеж</p>
                      <p className="text-sm text-muted-foreground">Подбор и доставка авто</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-5 md:p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Мессенджеры</h3>
                <MessengerLinksCards />
              </div>

              <div className="glass rounded-2xl p-5 md:p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Время работы</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Пн - Пт</span>
                    <span className="text-foreground font-medium">9:00 - 21:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Сб - Вс</span>
                    <span className="text-foreground font-medium">10:00 - 18:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
