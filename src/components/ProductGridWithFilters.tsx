"use client";

import { useState, useMemo } from "react";
import { Product, Category } from "@/types/supabase";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";

interface ProductGridWithFiltersProps {
    products: Product[];
    categories: Category[];
    showFilters?: boolean;
}

export function ProductGridWithFilters({ products, categories, showFilters = false }: ProductGridWithFiltersProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // 1. Extract unique category IDs present in the products (optimization)
    const availableCategoryIds = useMemo(() => {
        const ids = new Set(products.map(p => p.category_id));
        return ids;
    }, [products]);

    // 2. Filter available categories to show
    const visibleCategories = useMemo(() => {
        return categories.filter(c => availableCategoryIds.has(c.id));
    }, [categories, availableCategoryIds]);

    // 3. Filter products
    const filteredProducts = useMemo(() => {
        if (selectedCategory === "all") return products;
        return products.filter(p => p.category_id === selectedCategory);
    }, [products, selectedCategory]);

    if (products.length === 0) {
        return (
            <div className="py-12 text-center text-muted-foreground">
                <p className="text-lg">בקרוב יעלו מוצרים לקטגוריה זו...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filter Bar - Only shown if requested and there are categories to filter by */}
            {showFilters && visibleCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-sm font-medium transition-all border",
                            selectedCategory === "all"
                                ? "bg-green-600 text-white border-green-600 shadow-sm"
                                : "bg-white text-slate-600 border-slate-200 hover:border-green-500 hover:text-green-600"
                        )}
                    >
                        הכל
                    </button>
                    {visibleCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-medium transition-all border",
                                selectedCategory === cat.id
                                    ? "bg-green-600 text-white border-green-600 shadow-sm"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-green-500 hover:text-green-600"
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Empty State for Filter */}
            {filteredProducts.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                    <p className="text-lg">לא נמצאו מוצרים בקטגוריה זו.</p>
                </div>
            )}
        </div>
    );
}
