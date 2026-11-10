import { HomeFeaturedSkeleton } from '@/components/page-loading-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex flex-col animate-pulse">
      <section className="relative min-h-[70vh] flex items-center justify-center pt-28">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6 max-w-3xl">
          <Skeleton className="h-4 w-48 mx-auto" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-11 w-40" />
            <Skeleton className="h-11 w-36" />
          </div>
        </div>
      </section>
      <section className="py-20 container mx-auto px-4 md:px-6">
        <Skeleton className="h-10 w-64 mb-8" />
        <HomeFeaturedSkeleton />
      </section>
    </div>
  )
}
