"use client";

import { useProductFilters, SortOption } from "@/hooks/useProductFilters";
import { Product } from "@/types/supabase";
import { FilterSheet } from "@/components/category/FilterSheet";
import { ProductCard } from "@/components/ProductCard";
import { PackageOpen } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Category } from "@/types/supabase";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryPageClientProps {
    initialProducts: Product[];
    subCategories?: Category[];
    currentSlug?: string;
    parentCategorySlug?: string;
    parentCategoryName?: string;
}

export function CategoryPageClient({ initialProducts, subCategories = [], currentSlug, parentCategorySlug, parentCategoryName }: CategoryPageClientProps) {
    const { products, filteredCount, filters, actions, bounds } = useProductFilters(initialProducts);

    const currentCategoryName = subCategories.find(s => s.id === currentSlug)?.name || "כל המוצרים";

    return (
        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 relative items-start w-full" dir="rtl">

            {/* Desktop Right Sidebar */}
            <aside className="hidden md:flex flex-col w-[240px] xl:w-[280px] shrink-0 sticky top-36 h-[calc(100vh-9rem)] overflow-y-auto pl-4 pb-10 scrollbar-hide border-l border-slate-100/60 z-10">
                
                {/* 1. Subcategories Menu */}
                {subCategories.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-[20px] font-black text-[#113123] mb-3 pb-2 border-b border-slate-100">
                            {parentCategoryName || "קטגוריות"}
                        </h2>
                        <ul className="flex flex-col gap-1.5 pr-1">
                            <li>
                                <Link
                                    href={`/category/${parentCategorySlug}`}
                                    className={cn(
                                        "block px-3 py-2.5 rounded-xl text-[15px] font-bold transition-colors w-full text-right",
                                        currentSlug === parentCategorySlug
                                            ? "bg-[#d7f59d] text-[#113123]"
                                            : "text-slate-600 hover:bg-[#f6fbe8] hover:text-[#113123]"
                                    )}
                                >
                                    הכל
                                </Link>
                            </li>
                            {subCategories.map(sub => (
                                <li key={sub.id}>
                                    <Link
                                        href={`/category/${sub.id}`}
                                        className={cn(
                                            "block px-3 py-2.5 rounded-xl text-[15px] font-bold transition-colors w-full text-right",
                                            currentSlug === sub.id
                                                ? "bg-[#d7f59d] text-[#113123]"
                                                : "text-slate-600 hover:bg-[#f6fbe8] hover:text-[#113123]"
                                        )}
                                    >
                                        {sub.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

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

                {/* 3. Price Filter */}
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
                        <span className="text-[13px] font-extrabold text-slate-500 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">₪{filters.minPrice}</span>
                        <span className="text-[13px] font-extrabold text-slate-500 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">₪{filters.maxPrice}</span>
                    </div>
                </div>
            </aside>

            {/* Mobile Horizontal Subcategories */}
            {subCategories.length > 0 && (
                <div className="md:hidden w-full overflow-x-auto scrollbar-hide pb-2 -mt-4 mb-2">
                    <div className="flex items-center gap-2 min-w-max justify-start px-2">
                        <Link
                            href={`/category/${parentCategorySlug}`}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-bold border transition-colors shadow-sm",
                                currentSlug === parentCategorySlug 
                                    ? "bg-[#6c9b29] text-white border-[#6c9b29]"
                                    : "bg-white text-slate-700 border-slate-200"
                            )}
                        >
                            הכל
                        </Link>
                        {subCategories.map(sub => (
                            <Link
                                key={sub.id}
                                href={`/category/${sub.id}`}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-bold border transition-colors shadow-sm",
                                    currentSlug === sub.id 
                                        ? "bg-[#6c9b29] text-white border-[#6c9b29]"
                                        : "bg-white text-slate-700 border-slate-200"
                                )}
                            >
                                {sub.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

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
                        {filteredCount < products.length && (
                            <span className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm animate-in fade-in">
                                נמצאו {filteredCount} תוצאות
                            </span>
                        )}
                    </div>
                </div>

                {/* Desktop Results Count Header */}
                <div className="hidden md:flex justify-between items-end mb-4 pb-2 border-b border-slate-100 pt-0">
                    <h1 className="text-2xl font-black text-[#113123] tracking-tight leading-none">{currentCategoryName}</h1>
                    <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                         {filteredCount} מוצרים
                    </span>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-1">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    // Empty State
                    <div className="py-12 w-full">
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
            </main>
        </div>
    );
}
