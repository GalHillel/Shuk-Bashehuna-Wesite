"use client";

import { useProductFilters, SortOption } from "@/hooks/useProductFilters";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

interface FilterSheetProps {
    filters: ReturnType<typeof useProductFilters>['filters'];
    actions: ReturnType<typeof useProductFilters>['actions'];
    bounds: ReturnType<typeof useProductFilters>['bounds'];
    filteredCount: number;
}

export function FilterSheet({ filters, actions, bounds, filteredCount }: FilterSheetProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className="h-9 rounded-full px-4 gap-2 border-green-200 text-green-800 bg-white hover:bg-green-50 hover:border-green-300 transition-all shadow-sm"
                >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span className="text-sm font-medium">סינון</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[90vw] sm:w-[400px] flex flex-col p-6 rounded-l-3xl border-l border-green-100">
                <SheetHeader className="mb-6 flex flex-row items-center justify-between space-y-0">
                    <div>
                        <SheetTitle className="text-2xl font-bold text-green-900">סינון ומיוון</SheetTitle>
                        <SheetDescription>התאם את המוצרים לצרכים שלך</SheetDescription>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto space-y-8 pr-1">
                    {/* Sort */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-lg text-slate-800">סדר תצוגה</h4>
                        <RadioGroup
                            value={filters.sort}
                            onValueChange={(val) => actions.setSort(val as SortOption)}
                            className="space-y-3"
                        >
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <RadioGroupItem value="newest" id="newest" className="border-green-600 text-green-600" />
                                <Label htmlFor="newest" className="cursor-pointer">החדשים ביותר</Label>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <RadioGroupItem value="price-asc" id="price-asc" className="border-green-600 text-green-600" />
                                <Label htmlFor="price-asc" className="cursor-pointer">מחיר: נמוך לגבוה</Label>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <RadioGroupItem value="price-desc" id="price-desc" className="border-green-600 text-green-600" />
                                <Label htmlFor="price-desc" className="cursor-pointer">מחיר: גבוה לנמוך</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold text-lg text-slate-800">טווח מחירים</h4>
                            <span className="text-sm font-mono bg-green-50 text-green-800 px-2 py-1 rounded">
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

                    {/* Availability */}
                    <div className="flex items-center justify-between pt-2">
                        <Label htmlFor="instock" className="font-bold text-lg text-slate-800 cursor-pointer">
                            הצג רק מוצרים במלאי
                        </Label>
                        <Switch
                            id="instock"
                            checked={filters.inStockOnly}
                            onCheckedChange={actions.setInStockOnly}
                            className="data-[state=checked]:bg-green-600"
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-6 mt-auto border-t border-slate-100 flex gap-3">
                    <Button
                        variant="outline"
                        onClick={actions.resetFilters}
                        className="flex-1 h-12 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-red-500"
                    >
                        נקה הכל
                    </Button>
                    <Button
                        onClick={() => setOpen(false)}
                        className="flex-[2] h-12 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold shadow-lg shadow-green-900/20"
                    >
                        הצג {filteredCount} תוצאות
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
