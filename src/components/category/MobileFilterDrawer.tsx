"use client";

import { useProductFilters } from "@/hooks/useProductFilters";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { FilterSidebar } from "./FilterSidebar";
import { useState } from "react";

interface MobileFilterDrawerProps {
    filters: ReturnType<typeof useProductFilters>['filters'];
    actions: ReturnType<typeof useProductFilters>['actions'];
    bounds: ReturnType<typeof useProductFilters>['bounds'];
    totalCount: number;
    filteredCount: number;
}

export function MobileFilterDrawer(props: MobileFilterDrawerProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full flex items-center justify-between gap-2 border-slate-200 bg-white/80 backdrop-blur text-slate-700 h-12 rounded-xl shadow-sm hover:bg-slate-50"
                >
                    <span className="flex items-center gap-2 font-bold">
                        <SlidersHorizontal className="h-4 w-4" />
                        סינון ומיוון
                    </span>
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">
                        {props.filteredCount} תוצאות
                    </span>
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-[2rem] p-0 flex flex-col">
                <div className="flex items-center justify-center py-4 border-b border-slate-100">
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-6">
                    <FilterSidebar {...props} className="border-none shadow-none bg-transparent p-0" />
                </div>
                <div className="p-4 border-t border-slate-100 bg-white">
                    <Button
                        onClick={() => setOpen(false)}
                        className="w-full bg-[#14532d] hover:bg-[#052e16] text-white h-12 rounded-xl font-bold text-lg shadow-lg shadow-green-900/20"
                    >
                        הצג {props.filteredCount} מוצרים
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
