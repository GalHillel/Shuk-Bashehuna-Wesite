"use client";

import { useProductFilters } from "@/hooks/useProductFilters";
import { Product } from "@/types/supabase";
import { FilterSheet } from "@/components/category/FilterSheet";
import { ProductCard } from "@/components/ProductCard";
import { PackageOpen } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

interface CategoryPageClientProps {
    initialProducts: Product[];
}

export function CategoryPageClient({ initialProducts }: CategoryPageClientProps) {
    const { products, filteredCount, filters, actions, bounds } = useProductFilters(initialProducts);

    return (
        <div className="flex flex-col gap-8 relative">

            {/* Filter Bar - Minimalist */}
            <div className="flex flex-col md:flex-row gap-4 items-center w-full">
                {/* Filter Trigger & Sort Info */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-start">
                    <FilterSheet
                        filters={filters}
                        actions={actions}
                        bounds={bounds}
                        filteredCount={filteredCount}
                    />
                    {filteredCount < products.length && (
                        <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded-full border border-slate-100 shadow-sm animate-in fade-in">
                            נמצאו {filteredCount} תוצאות
                        </span>
                    )}
                </div>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                // Empty State
                <div className="py-12">
                    <EmptyState
                        icon={PackageOpen}
                        title="לא נמצאו מוצרים"
                        description="נסה לשנות את הפילטרים או לבדוק קטגוריה אחרת."
                        action={{
                            label: "נקה סינונים",
                            onClick: actions.resetFilters
                        }}
                    />
                </div>
            )}
        </div>
    );
}
