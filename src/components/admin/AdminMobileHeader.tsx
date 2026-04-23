"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AdminSidebarContent } from "@/components/admin/AdminSidebar";

export function AdminMobileHeader() {
    const [open, setOpen] = useState(false);

    return (
        <div 
            className="md:hidden h-16 bg-[#AADB56]/95 backdrop-blur-md border-b border-black/5 flex items-center justify-between px-5 sticky top-0 left-0 right-0 z-[100] transition-all duration-300" 
            dir="rtl"
            style={{ 
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1.5px, transparent 1.5px)', 
                backgroundSize: '12px 12px' 
            }}
        >
            <div className="flex items-center gap-3">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white/20 hover:bg-white/30 text-[#112a1e] border border-white/20 shadow-sm">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="p-0 w-80 border-none">
                        <AdminSidebarContent onClose={() => setOpen(false)} />
                    </SheetContent>
                </Sheet>
                <h1 className="font-black text-xl text-[#112a1e] tracking-tighter">שוק בשכונה</h1>
            </div>

            <div className="bg-white/20 px-3 py-1 rounded-full border border-white/20">
                <span className="text-[10px] font-black text-[#112a1e] uppercase tracking-widest leading-none">פאנל ניהול</span>
            </div>
        </div>
    );
}
