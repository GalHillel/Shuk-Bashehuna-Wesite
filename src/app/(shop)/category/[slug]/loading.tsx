import { ProductGridSkeleton } from "@/components/ProductSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50/50">
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex flex-col gap-6">
                    {/* Header Skeleton */}
                    <div className="flex flex-col gap-2 items-center mb-6">
                        <Skeleton className="h-10 w-48 rounded-lg" />
                        <Skeleton className="h-4 w-32 rounded-lg" />
                    </div>

                    <div className="flex flex-col gap-8 relative">
                        {/* Filter Bar Skeleton */}
                        <div className="flex flex-col md:flex-row gap-4 items-center w-full">
                            <div className="flex items-center gap-3 w-full md:w-auto justify-start">
                                <Skeleton className="h-10 w-24 rounded-full" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                        </div>

                        {/* Product Grid Skeleton */}
                        <ProductGridSkeleton count={12} />
                    </div>
                </div>
            </main>
        </div>
    );
}
