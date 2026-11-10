import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 pt-28">
      <div className="glass rounded-xl p-8 md:p-12 max-w-lg text-center">
        <p className="text-primary font-medium mb-2 tracking-wider uppercase text-sm">404</p>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Страница не найдена</h1>
        <p className="text-muted-foreground mb-8">
          Возможно, ссылка устарела. Перейдите на главную или в каталог автомобилей.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto">На главную</Button>
          </Link>
          <Link href="/catalog">
            <Button variant="outline" className="w-full sm:w-auto">
              Каталог
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
