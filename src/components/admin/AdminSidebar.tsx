"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    FolderTree,
    ShoppingCart,
    FileText,
    Settings,
    LogOut,
    Home,
    Percent,
    User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface AdminSidebarContentProps {
    onClose?: () => void;
}

export function AdminSidebarContent({ onClose }: AdminSidebarContentProps) {
    const pathname = usePathname();
    const { signOut } = useAuth();

    const links = [
        { href: "/admin", label: "לוח בקרה", icon: LayoutDashboard },
        { href: "/admin/products", label: "מוצרים", icon: Package },
        { href: "/admin/categories", label: "קטגוריות", icon: FolderTree },
        { href: "/admin/orders", label: "הזמנות", icon: ShoppingCart },
        { href: "/admin/coupons", label: "קופונים", icon: Percent },
        { href: "/admin/customers", label: "לקוחות", icon: User },
        { href: "/admin/content", label: "דף הבית", icon: LayoutDashboard },
        { href: "/admin/settings", label: "הגדרות", icon: Settings },
    ];

    const handleSignOut = async () => {
        await signOut();
        window.location.href = "/"; // Force full reload to verify auth state changes
    };

    return (
        <div className="flex flex-col h-full bg-white font-sans" dir="rtl">
            <div className="p-8 border-b border-slate-50 flex flex-col gap-4 bg-slate-50/50">
                <div className="flex items-center gap-4">
                    <div className="bg-[#AADB56] p-2.5 rounded-2xl shadow-lg shadow-[#AADB56]/20 border border-white/20">
                        <LayoutDashboard className="h-6 w-6 text-[#112a1e]" />
                    </div>
                    <div>
                        <h1 className="font-black text-xl text-slate-800 tracking-tighter leading-none">שוק בשכונה</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">פאנל ניהול פרימיום</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link 
                            key={link.href} 
                            href={link.href} 
                            onClick={(e) => {
                                // Ensure the sheet closes immediately on mobile
                                onClose?.();
                            }}
                        >
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all cursor-pointer",
                                isActive
                                    ? "bg-[#AADB56]/20 text-[#112a1e] font-extrabold shadow-sm border border-[#AADB56]/30"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}>
                                <Icon className={cn("h-5 w-5", isActive && "text-[#112a1e]")} />
                                <span>{link.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t space-y-2">
                <Link href="/">
                    <Button variant="outline" className="w-full justify-start gap-2 h-11" onClick={() => { onClose?.() }}>
                        <Home className="h-4 w-4" />
                        חזרה לאתר
                    </Button>
                </Link>

                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 h-11"
                    onClick={handleSignOut}
                >
                    <LogOut className="h-4 w-4" />
                    התנתקות
                </Button>
            </div>
        </div>
    );
}

export function AdminSidebar() {
    return (
        <aside className="w-64 bg-white border-l border-slate-100 h-screen flex flex-col fixed right-0 top-0 z-40 hidden md:flex shadow-sm">
            <AdminSidebarContent />
        </aside>
    );
}
