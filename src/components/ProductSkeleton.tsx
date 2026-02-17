import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
    return (
        <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm">
            {/* Image Skeleton */}
            <div className="aspect-[4/3] w-full bg-slate-100 relative">
                <Skeleton className="h-full w-full" />
            </div>

            {/* Content Skeleton */}
            <div className="p-3 flex flex-col gap-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="mt-auto flex justify-between items-center pt-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>
        </div>
    )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    )
}
