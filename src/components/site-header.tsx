"use client";

import Link from "next/link";
import { Menu as MenuIcon, User, Store, LogOut, Shield, ShoppingCart, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/useCart";
import { CartDrawer } from "@/components/CartDrawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState, useRef } from "react";
import { Category } from "@/types/supabase";
import { FloatingSearch } from "@/components/FloatingSearch";
import { LoginDialog } from "@/components/LoginDialog";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/ui/logo";

export function SiteHeader() {
    const { user, isAdmin } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [settings, setSettings] = useState<any>({});
    const [loginOpen, setLoginOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const { items } = useCart(); // Access cart items for length

    const [hasSaleItems, setHasSaleItems] = useState(false);

    useEffect(() => {
        async function fetchData() {
            // Fetch categories
            const { data: cats } = await supabase
                .from("categories")
                .select("*")
                .eq("is_visible", true)
                .order("sort_order", { ascending: true });

            if (cats) setCategories(cats);

            // Fetch settings
            const { data: sets } = await supabase.from("site_settings").select("*");
            if (sets) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const settingsMap = sets.reduce((acc, curr) => {
                    acc[curr.key] = curr.value;
                    return acc;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }, {} as any);
                setSettings(settingsMap);
            }

            // Check for sale items
            const { count } = await supabase
                .from("products")
                .select("id", { count: 'exact', head: true })
                .eq("is_active", true)
                .eq("is_on_sale", true);

            setHasSaleItems(!!count && count > 0);
        }
        fetchData();
    }, []);

    // Close user menu on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none h-24">

                {/* 1. Right Action: Cart (Floating Circle) - RTL: Right is Start */}
                <div className="absolute top-4 right-4 pointer-events-auto z-50">
                    <CartDrawer trigger={
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-12 w-12 rounded-full shadow-sm bg-white/90 backdrop-blur hover:bg-white hover:scale-105 transition-all text-slate-700 border border-white/20"
                        >
                            <div className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                {items.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                                        {items.length}
                                    </span>
                                )}
                            </div>
                        </Button>
                    } />
                </div>

                {/* 2. Left Action: Menu (Floating Circle) - RTL: Left is End */}
                <div className="absolute top-4 left-4 pointer-events-auto z-50 flex gap-2">
                    {/* User Menu Trigger - HIDDEN ON MOBILE */}
                    <div className="relative hidden md:block" ref={menuRef}>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-12 w-12 rounded-full shadow-sm bg-white/90 backdrop-blur hover:bg-white hover:scale-105 transition-all text-slate-700 border border-white/20"
                            onClick={() => user ? setUserMenuOpen(!userMenuOpen) : setLoginOpen(true)}
                        >
                            <User className="h-5 w-5" />
                        </Button>

                        {/* User Dropdown */}
                        {userMenuOpen && user && (
                            <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-secondary overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto">
                                <div className="px-4 py-3 bg-secondary/30 border-b border-secondary">
                                    <p className="text-xs text-muted-foreground font-medium">מחובר</p>
                                    <p className="text-sm font-bold truncate">{user.email}</p>
                                </div>
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-secondary/50 transition-colors font-medium"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <Shield className="h-4 w-4" />
                                        פאנל ניהול
                                    </Link>
                                )}
                                <button
                                    onClick={async () => {
                                        await supabase.auth.signOut();
                                        window.location.reload();
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                                >
                                    <LogOut className="h-4 w-4" />
                                    התנתק
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Hamburger Menu Trigger */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="h-12 w-12 rounded-full shadow-sm bg-white/90 backdrop-blur hover:bg-white hover:scale-105 transition-all text-slate-700 border border-white/20"
                            >
                                <MenuIcon className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[85vw] sm:w-[380px] overflow-y-auto pt-10">
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-center py-6 border-b border-slate-100">
                                    <Logo src={settings.site_logo} />
                                </div>

                                <nav className="flex-1 overflow-y-auto py-6 px-2 space-y-1">
                                    <Link
                                        href="/"
                                        className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl bg-slate-100 p-2 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">🏠</span>
                                            <span className="font-bold text-lg text-slate-800">דף הבית</span>
                                        </div>
                                        <ChevronLeft className="h-5 w-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                                    </Link>

                                    {hasSaleItems && (
                                        <Link
                                            href="/category/specials"
                                            className="flex items-center justify-between p-4 rounded-xl bg-red-50/50 border border-red-100 hover:bg-red-50 transition-colors group mt-2 mb-4"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="relative flex h-10 w-10 items-center justify-center bg-white rounded-lg shadow-sm border border-red-100">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                </span>
                                                <span className="font-bold text-lg text-red-600">מבצעים חמים</span>
                                            </div>
                                            <ChevronLeft className="h-5 w-5 text-red-300 group-hover:text-red-600 transition-colors" />
                                        </Link>
                                    )}

                                    <div className="py-4">
                                        <h3 className="px-4 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">קטגוריות</h3>
                                        <div className="space-y-1">
                                            {categories.map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    href={`/category/${cat.id}`}
                                                    className={cn(
                                                        "flex items-center justify-between p-4 rounded-xl transition-all group",
                                                        "hover:bg-slate-50 hover:shadow-sm border border-transparent hover:border-slate-100",
                                                        cat.id === 'specials' && "hidden" // Hide specials from regular list as it's already shown above
                                                    )}
                                                >
                                                    <span className="font-medium text-lg text-slate-700 group-hover:text-slate-900 group-hover:translate-x-1 transition-all">
                                                        {cat.name}
                                                    </span>
                                                    <ChevronLeft className="h-5 w-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 pt-4 mt-auto">
                                        <Link
                                            href="/about"
                                            className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-2xl bg-slate-100 p-2 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">ℹ️</span>
                                                <span className="font-bold text-lg text-slate-800">אודות</span>
                                            </div>
                                            <ChevronLeft className="h-5 w-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                                        </Link>
                                    </div>
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* 3. CENTER: The "Floating Drop" (Interactive) */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto z-[60]">
                    <FloatingSearch logoSrc={settings.site_logo} />
                </div>

                {/* 4. Desktop Navigation (Centered below search) - Desktop Only */}
                <nav className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-auto z-40 hidden md:flex items-center gap-1 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-white/20">

                    <Link
                        href="/"
                        className="px-3 py-1 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-all"
                    >
                        דף הבית
                    </Link>
                    <div className="w-[1px] h-3 bg-slate-300 mx-1" />
                    {categories.slice(0, 5).map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/category/${cat.id}`}
                            className={cn(
                                "px-3 py-1 text-sm font-medium hover:bg-slate-100 rounded-full transition-all whitespace-nowrap",
                                cat.id === 'specials' ? "text-red-600 hover:bg-red-50 hover:text-red-700" : "text-slate-600 hover:text-green-700 hover:bg-green-50"
                            )}
                        >
                            {cat.name}
                        </Link>
                    ))}
                    {categories.length > 5 && (
                        <Link
                            href="/categories"
                            className="px-3 py-1 text-sm font-medium text-slate-500 hover:text-green-700 hover:bg-green-50 rounded-full transition-all"
                        >
                            עוד...
                        </Link>
                    )}

                    {/* Sales Tab - Moved to end of categories */}
                    {hasSaleItems && (
                        <>
                            <div className="w-[1px] h-3 bg-slate-300 mx-1" />
                            <Link
                                href="/category/specials"
                                className="px-3 py-1 text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full transition-all flex items-center gap-1"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                מבצעים
                            </Link>
                        </>
                    )}

                    <div className="w-[1px] h-3 bg-slate-300 mx-1" />
                    <Link
                        href="/about"
                        className="px-3 py-1 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-all"
                    >
                        אודות
                    </Link>
                </nav>

            </header>

            {/* Login Dialog */}
            <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
        </>
    );
}
