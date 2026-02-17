"use client";

import { useProductFilters, SortOption } from "@/hooks/useProductFilters";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface FilterSidebarProps {
    className?: string;
    filters: ReturnType<typeof useProductFilters>['filters'];
    actions: ReturnType<typeof useProductFilters>['actions'];
    bounds: ReturnType<typeof useProductFilters>['bounds'];
    totalCount: number;
    filteredCount: number;
}

export function FilterSidebar({
    className,
    filters,
    actions,
    bounds,
    totalCount,
    filteredCount
}: FilterSidebarProps) {
    return (
        <div className={`space-y-8 p-6 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/40 shadow-sm ${className}`}>

            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-[#052e16]">סינון ומיוון</h3>
                <span className="text-xs text-muted-foreground bg-white/80 px-2 py-1 rounded-full border border-slate-100">
                    {filteredCount} תוצאות
                </span>
            </div>

            {/* 1. Search */}
            <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-700">חיפוש</Label>
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="חפש מוצר..."
                        value={filters.searchQuery}
                        onChange={(e) => actions.setSearchQuery(e.target.value)}
                        className="pr-9 bg-white border-slate-200 focus:border-[#14532d] focus:ring-[#14532d]"
                    />
                </div>
            </div>

            {/* 2. Sort */}
            <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-700">סדר תצוגה</Label>
                <Select
                    value={filters.sort}
                    onValueChange={(val) => actions.setSort(val as SortOption)}
                >
                    <SelectTrigger className="w-full bg-white border-slate-200">
                        <SelectValue placeholder="בחר סדר תצוגה" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">החדשים ביותר</SelectItem>
                        <SelectItem value="price-asc">מחיר: נמוך לגבוה</SelectItem>
                        <SelectItem value="price-desc">מחיר: גבוה לנמוך</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* 3. Price Range */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-bold text-slate-700">טווח מחירים</Label>
                    <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
                        ₪{filters.minPrice} - ₪{filters.maxPrice}
                    </span>
                </div>
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
                    className="py-4"
                />
            </div>

            {/* 4. Availability */}
            <div className="flex items-center gap-3 pt-2">
                <Checkbox
                    id="instock"
                    checked={filters.inStockOnly}
                    onCheckedChange={(checked) => actions.setInStockOnly(checked as boolean)}
                    className="border-slate-300 data-[state=checked]:bg-[#14532d] data-[state=checked]:border-[#14532d]"
                />
                <Label htmlFor="instock" className="text-sm font-medium text-slate-700 cursor-pointer">
                    הצג רק מוצרים במלאי
                </Label>
            </div>

            {/* Reset */}
            <button
                onClick={actions.resetFilters}
                className="w-full py-2 text-sm text-slate-500 hover:text-[#14532d] hover:bg-slate-50 rounded-lg transition-colors"
            >
                נקה סינונים
            </button>
        </div>
    );
}
