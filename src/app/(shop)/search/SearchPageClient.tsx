"use client";

import { useProductFilters, SortOption } from "@/hooks/useProductFilters";
import { Product, Category } from "@/types/supabase";
import { FilterSheet } from "@/components/category/FilterSheet";
import { ProductCard } from "@/components/ProductCard";
import { PackageOpen } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface SearchPageClientProps {
    initialProducts: Product[];
    categories: Category[];
    query: string;
}

export function SearchPageClient({ initialProducts, categories, query }: SearchPageClientProps) {
    const { products, filteredCount, filters, actions, bounds } = useProductFilters(initialProducts);

    // Filter categories to only those that have products in the current search results
    const relevantCategories = categories.filter(cat => {
        const hasDirectProduct = initialProducts.some(p => p.category_id === cat.id || p.subcategory_id === cat.id);
        if (hasDirectProduct) return true;
        
        // Also check if any subcategory of this category has products in the results
        const isParentOfRelevantSub = categories.some(sub => 
            sub.parent_id === cat.id && 
            initialProducts.some(p => p.category_id === sub.id || p.subcategory_id === sub.id)
        );
        return isParentOfRelevantSub;
    });

    // Root categories for the sidebar (only those relevant to current search)
    const rootCategories = relevantCategories.filter(c => !c.parent_id);

    return (
        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 relative items-start w-full" dir="rtl">

            {/* Desktop Right Sidebar */}
            <aside className="hidden md:flex flex-col w-[240px] xl:w-[280px] shrink-0 sticky top-36 h-[calc(100vh-9rem)] overflow-y-auto pl-4 pb-10 scrollbar-hide border-l border-slate-100/60 z-10">
                
                {/* 1. Category Filter */}
                <div className="mb-8">
                    <h2 className="text-[20px] font-black text-[#113123] mb-3 pb-2 border-b border-slate-100">
                        סינון לפי קטגוריה
                    </h2>
                    <ul className="flex flex-col gap-1.5 pr-1">
                        <li>
                            <button
                                onClick={() => actions.setSelectedCategory("all")}
                                className={cn(
                                    "block px-3 py-2.5 rounded-xl text-[15px] font-bold transition-all w-full text-right",
                                    filters.selectedCategory === "all"
                                        ? "bg-[#d7f59d] text-[#113123]"
                                        : "text-slate-600 hover:bg-[#f6fbe8] hover:text-[#113123]"
                                )}
                            >
                                כל הקטגוריות
                            </button>
                        </li>
                        {rootCategories.map(cat => (
                            <li key={cat.id}>
                                <button
                                    onClick={() => actions.setSelectedCategory(cat.id)}
                                    className={cn(
                                        "block px-3 py-2.5 rounded-xl text-[15px] font-bold transition-all w-full text-right",
                                        filters.selectedCategory === cat.id
                                            ? "bg-[#d7f59d] text-[#113123]"
                                            : "text-slate-600 hover:bg-[#f6fbe8] hover:text-[#113123]"
                                    )}
                                >
                                    {cat.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 2. Sort Options */}
                <div className="mb-8">
                    <h3 className="text-[18px] font-black text-[#113123] mb-4">מיון לפי</h3>
                    <RadioGroup
                        value={filters.sort}
                        onValueChange={(val) => actions.setSort(val as SortOption)}
                        className="space-y-4 pr-1"
                        dir="rtl"
                    >
                        <div className="flex items-center space-x-3 space-x-reverse">
                            <RadioGroupItem value="newest" id="newest-side" className="border-slate-300 text-[#1b3626]" />
                            <Label htmlFor="newest-side" className="cursor-pointer font-bold text-slate-700 text-[14px]">החדשים ביותר</Label>
                        </div>
                        <div className="flex items-center space-x-3 space-x-reverse">
                            <RadioGroupItem value="price-asc" id="price-asc-side" className="border-slate-300 text-[#1b3626]" />
                            <Label htmlFor="price-asc-side" className="cursor-pointer font-bold text-slate-700 text-[14px]">מחיר: נמוך לגבוה</Label>
                        </div>
                        <div className="flex items-center space-x-3 space-x-reverse">
                            <RadioGroupItem value="price-desc" id="price-desc-side" className="border-slate-300 text-[#1b3626]" />
                            <Label htmlFor="price-desc-side" className="cursor-pointer font-bold text-slate-700 text-[14px]">מחיר: גבוה לנמוך</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* 3. Price Filter (Dual handle) */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[18px] font-black text-[#113123]">טווח מחירים</h3>
                    </div>
                    <div className="px-2">
                        <Slider
                            defaultValue={[bounds.min, bounds.max]}
                            value={[filters.minPrice, filters.maxPrice]}
                            max={bounds.max}
                            min={bounds.min}
                            step={1}
                            onValueChange={(val) => {
                                actions.setMinPrice(val[0]);
                                actions.setMaxPrice(val[1]);
                            }}
                            className="py-4 cursor-grab active:cursor-grabbing"
                        />
                    </div>
                    <div className="flex items-center justify-between mt-2 px-1">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-slate-400 font-bold mb-1">מינימום</span>
                            <span className="text-[13px] font-extrabold text-slate-500 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">₪{filters.minPrice}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-slate-400 font-bold mb-1">מקסימום</span>
                            <span className="text-[13px] font-extrabold text-slate-500 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">₪{filters.maxPrice}</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Horizontal Category Scroller */}
            <div className="md:hidden w-full overflow-x-auto scrollbar-hide pb-2 -mt-4 mb-2">
                <div className="flex items-center gap-2 min-w-max justify-start px-2">
                    <button
                        onClick={() => actions.setSelectedCategory("all")}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-bold border transition-colors shadow-sm",
                            filters.selectedCategory === "all" 
                                ? "bg-[#6c9b29] text-white border-[#6c9b29]"
                                : "bg-white text-slate-700 border-slate-200"
                        )}
                    >
                        הכל
                    </button>
                    {rootCategories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => actions.setSelectedCategory(cat.id)}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-bold border transition-colors shadow-sm",
                                filters.selectedCategory === cat.id 
                                    ? "bg-[#6c9b29] text-white border-[#6c9b29]"
                                    : "bg-white text-slate-700 border-slate-200"
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 w-full flex flex-col min-w-0">
                
                {/* Mobile Filter Trigger */}
                <div className="flex md:hidden gap-4 items-center w-full mb-4 relative z-30 px-2">
                    <div className="flex items-center gap-3 w-full justify-start">
                        <FilterSheet
                            filters={filters}
                            actions={actions}
                            bounds={bounds}
                            filteredCount={filteredCount}
                        />
                        {filteredCount < initialProducts.length && (
                            <span className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm animate-in fade-in">
                                {filteredCount} תוצאות נמצאו
                            </span>
                        )}
                    </div>
                </div>

                {/* Desktop Results Count Header */}
                <div className="hidden md:flex justify-end items-center mb-4 pb-2 border-b border-slate-100 pt-0">
                    <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg tracking-widest border border-slate-100">
                         {filteredCount} תוצאות לחיפוש &quot;{query}&quot;
                    </span>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-1">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    // Empty State
                    <div className="py-12 w-full">
                        <EmptyState
                            icon={PackageOpen}
                            title="לא נמצאו תוצאות"
                            description="נסה לשנות את הפילטרים או לבצע חיפוש אחר."
                            action={{
                                label: "נקה הכל",
                                onClick: actions.resetFilters
                            }}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}
