"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AdminSidebarContent } from "@/components/admin/AdminSidebar";

export function AdminMobileHeader() {
    const [open, setOpen] = useState(false);

    return (
        <div className="md:hidden h-14 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-30">
            <h1 className="font-bold text-lg text-green-950">שוק בשכונה</h1>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6 text-gray-700" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0 w-80">
                    <AdminSidebarContent onClose={() => setOpen(false)} />
                </SheetContent>
            </Sheet>
        </div>
    );
}
