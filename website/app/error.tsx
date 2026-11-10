'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="glass rounded-xl p-8 md:p-12 max-w-lg text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Что-то пошло не так</h1>
        <p className="text-muted-foreground mb-6">
          Произошла ошибка при загрузке страницы. Попробуйте ещё раз.
        </p>
        <Button onClick={() => reset()}>Повторить</Button>
      </div>
    </div>
  )
}
