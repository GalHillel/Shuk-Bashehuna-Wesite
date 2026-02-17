"use client";

import Link from "next/link";
import { Menu as MenuIcon, User, Store, LogOut, Shield, ShoppingCart, ChevronLeft, Percent, ChevronDown } from "lucide-react";

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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [moreMenuOpen, setMoreMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const moreMenuRef = useRef<HTMLDivElement>(null);

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
            if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
                setMoreMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none h-24">

                {/* 1. Left Action: Cart (Floating Circle) & User */}
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

                    <CartDrawer trigger={
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-12 w-12 rounded-full shadow-sm bg-white/90 backdrop-blur hover:bg-white hover:scale-105 transition-all text-slate-700 border border-white/20"
                        >
                            <div className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                {items.length > 0 && (
                                    <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                                        {items.length}
                                    </span>
                                )}
                            </div>
                        </Button>
                    } />
                </div>

                {/* 2. Right Action: Menu (Floating Circle) */}
                <div className="absolute top-4 right-4 pointer-events-auto z-50">
                    {/* Hamburger Menu Trigger */}
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="h-12 w-12 rounded-full shadow-sm bg-white/90 backdrop-blur hover:bg-white hover:scale-105 transition-all text-slate-700 border border-white/20"
                            >
                                <MenuIcon className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[85vw] sm:w-[320px] p-0 flex flex-col border-l-0 gap-0 [&>button]:top-4 [&>button]:right-4 [&>button]:h-8 [&>button]:w-8 [&>button]:bg-white/90 [&>button]:backdrop-blur [&>button]:text-slate-700 [&>button]:shadow-sm [&>button]:border [&>button]:border-white/20 [&>button]:hover:bg-white [&>button]:hover:scale-105 [&>button]:rounded-full [&>button]:z-[100] [&>button]:p-2 transition-all">
                            {/* Header Area - Soft & Light (Glassmorphism) */}
                            <div className="bg-gradient-to-b from-green-50/50 to-white/50 p-6 pt-12 flex flex-col items-center justify-center relative border-b border-green-50/50">
                                <div className="relative z-10 scale-125 mb-2">
                                    <Logo src={settings.site_logo} className="[&_span]:inline [&_span]:text-2xl [&_span]:text-green-900" />
                                </div>
                                <p className="text-green-800/80 text-sm mt-3 font-bold tracking-wide uppercase">הכי טרי • הכי קרוב • הכי טעים</p>
                            </div>

                            {/* Body Area - White */}
                            <div className="flex-1 bg-white overflow-y-auto">
                                <nav className="flex flex-col p-3 space-y-1 pb-20">
                                    <Link
                                        href="/"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-sm text-slate-700 group-hover:text-[#14532d] transition-colors">דף הבית</span>
                                        </div>
                                        <ChevronLeft className="h-4 w-4 text-slate-300 group-hover:text-green-600 transition-colors" />
                                    </Link>

                                    {hasSaleItems && (
                                        <Link
                                            href="/category/specials"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center justify-between p-3 rounded-xl bg-red-50/50 border border-red-100/50 hover:bg-red-50 transition-all group mt-1 mb-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-8 w-8 items-center justify-center bg-white rounded-lg shadow-sm text-rose-500 text-xs">
                                                    <Percent className="h-3.5 w-3.5" />
                                                </span>
                                                <span className="font-bold text-sm text-rose-600">מבצעים חמים</span>
                                            </div>
                                            <ChevronLeft className="h-4 w-4 text-red-300 group-hover:text-red-600 transition-colors" />
                                        </Link>
                                    )}

                                    <div className="py-2">
                                        <h3 className="px-3 text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                            קטגוריות
                                        </h3>
                                        <div className="space-y-0.5">
                                            {categories.map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    href={`/category/${cat.id}`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={cn(
                                                        "flex items-center justify-between p-2.5 px-3 rounded-lg transition-all group",
                                                        "hover:bg-slate-50 hover:pl-1",
                                                        cat.id === 'specials' && "hidden"
                                                    )}
                                                >
                                                    <span className="font-medium text-sm text-slate-600 group-hover:text-[#14532d] transition-colors">
                                                        {cat.name}
                                                    </span>
                                                    <ChevronLeft className="h-3.5 w-3.5 text-slate-200 group-hover:text-green-600 transition-colors opacity-0 group-hover:opacity-100" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-50 pt-4 mt-2">
                                        <Link
                                            href="/about"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-sm text-slate-700">אודות</span>
                                            </div>
                                            <ChevronLeft className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
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
                <nav className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-auto z-40 hidden md:flex items-center gap-1 bg-white/60 backdrop-blur-xl px-4 py-1.5 rounded-full shadow-lg shadow-green-900/5 border border-white/40">

                    <Link
                        href="/"
                        className="px-3 py-1 text-sm font-bold text-[#052e16] hover:text-[#14532d] hover:bg-green-100/50 rounded-full transition-all"
                    >
                        דף הבית
                    </Link>
                    <div className="w-[1px] h-3 bg-slate-300 mx-1" />

                    {/* Visible Categories */}
                    {categories.slice(0, 6).map((cat) => (
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

                    {/* "More" Dropdown */}
                    {categories.length > 6 && (
                        <div className="relative" ref={moreMenuRef}>
                            <button
                                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                                className={cn(
                                    "flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full transition-all",
                                    moreMenuOpen
                                        ? "bg-green-100 text-[#14532d]"
                                        : "text-[#052e16]/80 hover:text-[#14532d] hover:bg-green-100/50"
                                )}
                            >
                                עוד...
                                <ChevronDown className={cn("h-3 w-3 transition-transform", moreMenuOpen && "rotate-180")} />
                            </button>

                            {moreMenuOpen && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="py-1">
                                        {categories.slice(6).map((cat) => (
                                            <Link
                                                key={cat.id}
                                                href={`/category/${cat.id}`}
                                                onClick={() => setMoreMenuOpen(false)}
                                                className="block px-4 py-2.5 text-sm text-green-950 hover:bg-green-50 hover:text-green-800 transition-colors text-right"
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Sales Tab - Moved to end of categories */}
                    {hasSaleItems && (
                        <>
                            <div className="w-[1px] h-3 bg-slate-300 mx-1" />
                            <Link
                                href={`/category/specials`}
                                className="px-3 py-1 text-sm font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-full transition-all flex items-center gap-1"
                            >
                                <Percent className="w-4 h-4 text-rose-500" />
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
