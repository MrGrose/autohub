import { Skeleton } from '@/components/ui/skeleton'

export default function CatalogLoading() {
  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-16 md:pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-10 w-full max-w-md mb-4" />
        <Skeleton className="h-16 w-full max-w-2xl mb-10" />
        <Skeleton className="h-14 w-full rounded-xl mb-8" />
        <Skeleton className="h-6 w-32 mb-6" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    </div>
  )
}
