"use client";

import Link from "next/link";
import { Menu, User, Store, LogOut, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState, useRef } from "react";
import { Category } from "@/types/supabase";
import { GlobalSearch } from "@/components/GlobalSearch";
import { LoginDialog } from "@/components/LoginDialog";
import { useAuth } from "@/hooks/useAuth";

export function SiteHeader() {
    const { user, isAdmin } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loginOpen, setLoginOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchCategories() {
            const { data } = await supabase
                .from("categories")
                .select("*")
                .eq("is_visible", true)
                .order("sort_order", { ascending: true });

            if (data) setCategories(data);
        }
        fetchCategories();
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
            <header className="sticky top-0 z-50 w-full">
                {/* 1. Top Announcement Bar */}
                <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white text-center py-2.5 text-sm font-medium tracking-wide shadow-sm">
                    <div className="container flex items-center justify-center gap-2">
                        <span className="animate-bounce inline-block">🚚</span>
                        <span>משלוח חינם בקנייה מעל 300 ₪</span>
                        <span className="mx-2 text-green-300">|</span>
                        <span>הזמינו היום — קבלו מחר!</span>
                        <span className="animate-pulse inline-block">✨</span>
                    </div>
                </div>

                {/* 2. Main Header */}
                <div className="bg-gradient-to-b from-green-900 via-green-800 to-green-900 border-b border-green-700/50 shadow-lg">
                    <div className="container flex h-20 items-center justify-between gap-6">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
                            <div className="relative">
                                <div className="bg-gradient-to-br from-yellow-400 via-yellow-300 to-amber-400 p-2.5 rounded-xl shadow-lg group-hover:shadow-yellow-400/30 transition-shadow duration-300">
                                    <Store className="h-7 w-7 text-green-900" />
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-green-900 animate-pulse" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-xl leading-none text-white tracking-tight">
                                    שוק בשכונה
                                </span>
                                <span className="text-[11px] text-green-300/80 font-medium mt-0.5">
                                    הכי טרי • הכי קרוב • הכי טעים
                                </span>
                            </div>
                        </Link>

                        {/* Search */}
                        <div className="hidden md:block flex-1 max-w-xl mx-auto">
                            <GlobalSearch />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            {/* Profile / Login */}
                            <div className="relative" ref={menuRef}>
                                {user ? (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                                            className="text-green-100 hover:text-white hover:bg-green-700/50 relative"
                                        >
                                            <User className="h-5 w-5" />
                                            {isAdmin && (
                                                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-yellow-400 rounded-full border-2 border-green-900" />
                                            )}
                                        </Button>

                                        {/* User Dropdown */}
                                        {userMenuOpen && (
                                            <div className="absolute left-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-green-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="px-4 py-3 bg-green-50 border-b border-green-100">
                                                    <p className="text-xs text-green-600 font-medium">מחובר</p>
                                                    <p className="text-sm text-green-900 font-bold truncate">{user.email}</p>
                                                </div>
                                                {isAdmin && (
                                                    <Link
                                                        href="/admin"
                                                        className="flex items-center gap-2 px-4 py-3 text-sm text-green-700 hover:bg-green-50 transition-colors font-medium"
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        <Shield className="h-4 w-4" />
                                                        פאנל ניהול
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={async () => {
                                                        await supabase.auth.signOut();
                                                        window.location.href = '/'; // Force hard reload to clear memory
                                                    }}
                                                    className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    התנתק
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-green-100 hover:text-white hover:bg-green-700/50"
                                        onClick={() => setLoginOpen(true)}
                                    >
                                        <User className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>

                            <CartDrawer />

                            {/* Mobile Menu */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="lg:hidden text-green-100 hover:text-white hover:bg-green-700/50">
                                        <Menu className="h-6 w-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[300px] bg-green-900 border-green-800">
                                    <nav className="flex flex-col gap-1 mt-8">
                                        <Link href="/" className="font-bold text-lg text-white px-4 py-3 rounded-lg hover:bg-green-800 transition-colors">
                                            דף הבית
                                        </Link>
                                        {categories.map(cat => (
                                            <Link
                                                key={cat.id}
                                                href={`/category/${cat.slug}`}
                                                className="text-lg text-green-100 px-4 py-3 rounded-lg hover:bg-green-800 hover:text-white transition-colors"
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                        <Link href="/about" className="text-lg text-green-100 px-4 py-3 rounded-lg hover:bg-green-800 hover:text-white transition-colors">
                                            אודות
                                        </Link>
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>

                {/* 3. Category Navigation Bar */}
                <div className="hidden lg:block bg-gradient-to-b from-green-800/95 to-green-900/90 backdrop-blur-md border-b border-green-700/30">
                    <div className="container">
                        <nav className="flex items-center justify-center gap-0.5">
                            <Link
                                href="/"
                                className="px-5 py-3.5 text-sm font-medium text-green-100 hover:text-white transition-all border-b-2 border-transparent hover:border-yellow-400 hover:bg-green-700/30 rounded-t-lg"
                            >
                                🏠 דף הבית
                            </Link>
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/category/${cat.slug}`}
                                    className={`
                                        px-5 py-3.5 text-sm font-medium transition-all border-b-2 border-transparent hover:border-yellow-400 hover:bg-green-700/30 rounded-t-lg
                                        ${cat.slug === 'specials'
                                            ? 'text-yellow-300 hover:text-yellow-200 font-bold'
                                            : 'text-green-100 hover:text-white'
                                        }
                                    `}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                            <Link
                                href="/about"
                                className="px-5 py-3.5 text-sm font-medium text-green-100 hover:text-white transition-all border-b-2 border-transparent hover:border-yellow-400 hover:bg-green-700/30 rounded-t-lg"
                            >
                                אודות
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Login Dialog */}
            <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
        </>
    );
}
