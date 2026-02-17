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
    Percent
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
        { href: "/admin/promotions", label: "מבצעים", icon: Percent }, // Added Promotions link
        { href: "/admin/content", label: "ניהול תוכן", icon: FileText },
        { href: "/admin/settings", label: "הגדרות", icon: Settings },
    ];

    const handleSignOut = async () => {
        await signOut();
        window.location.href = "/"; // Force full reload to verify auth state changes
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-6 border-b flex items-center gap-3">
                <div className="bg-green-600 p-2 rounded-lg">
                    <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="font-bold text-lg">שוק בשכונה</h1>
                    <p className="text-xs text-muted-foreground">פאנל ניהול</p>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link key={link.href} href={link.href} onClick={onClose}>
                            <div className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                isActive
                                    ? "bg-green-50 text-green-700 font-medium shadow-sm border border-green-100"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}>
                                <Icon className={cn("h-5 w-5", isActive && "text-green-600")} />
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
        <aside className="w-64 bg-white border-l h-screen flex flex-col fixed right-0 top-0 z-40 hidden md:flex shadow-sm">
            <AdminSidebarContent />
        </aside>
    );
}
