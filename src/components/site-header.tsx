"use client";

import Link from "next/link";
import { Menu as MenuIcon, User, Store, LogOut, Shield, ShoppingCart, ChevronLeft, Percent, ChevronDown, RefreshCw, ShoppingBasket, Search, Facebook, Instagram, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/useCart";
import { CartDrawer } from "@/components/CartDrawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState, useRef } from "react";
import { Category } from "@/types/supabase";
import { GlobalSearch } from "@/components/GlobalSearch";
import { LoginDialog } from "@/components/LoginDialog";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/ui/logo";
import { usePathname } from "next/navigation";



export function SiteHeader() {
    const { user, isAdmin } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [settings, setSettings] = useState<any>({});
    const [loginOpen, setLoginOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const { items, totalPriceEstimated } = useCart();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [hasSaleItems, setHasSaleItems] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const { data: cats } = await supabase
                .from("categories")
                .select("*")
                .eq("is_visible", true)
                .order("sort_order", { ascending: true });

            if (cats) setCategories(cats);

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

            const { count } = await supabase
                .from("products")
                .select("id", { count: 'exact', head: true })
                .eq("is_active", true)
                .eq("is_on_sale", true);

            setHasSaleItems(!!count && count > 0);
        }
        fetchData();
    }, []);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const parentCategories = categories.filter(c => !c.parent_id);
    const getSubCategories = (parentId: string) => categories.filter(c => c.parent_id === parentId);

    // Combine all navigation links to cleanly split them exactly by their total weight
    const allNavItems = [
        { isStatic: true, id: "home", name: "דף הבית", href: "/", colorClass: "text-[#2c3e1c]" },
        ...parentCategories.map(cat => ({ isStatic: false, ...cat }))
    ];

    // Split items perfectly in half to accommodate the center logo
    const halfLen = Math.ceil(allNavItems.length / 2);
    const rightSideItems = allNavItems.slice(0, halfLen);
    const leftSideItems = allNavItems.slice(halfLen);

    return (
        <>
            <header className="sticky top-0 left-0 right-0 z-50 w-full flex flex-col pointer-events-auto">
                {/* 1. Top Bar */}
                <div className="bg-[#CFE1A7] text-slate-800 text-[12px] font-extrabold h-[34px] px-4 md:px-6 hidden md:flex items-center justify-between tracking-wide" dir="rtl">
                    <div className="flex items-center gap-3">
                        <Link href="/about" className="hover:text-primary transition">אודות</Link>
                        <span className="text-slate-400 font-light opacity-50">|</span>
                        <Link href="/kosher" className="hover:text-primary transition">כשרות</Link>
                        <span className="text-slate-400 font-light opacity-50">|</span>
                        <Link href="/faq" className="hover:text-primary transition">שאלות נפוצות</Link>
                    </div>
                </div>

                {/* 2. Main Header (Green Background with dots) */}
                <div 
                    className="bg-[#AADB56] px-4 md:px-6 h-[86px] flex items-center justify-between relative" 
                    dir="rtl"
                    style={{ 
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.25) 2px, transparent 2.5px)', 
                        backgroundSize: '16px 16px' 
                    }}
                >
                    {/* Desktop Right: Accounts and Search */}
                    <div className="hidden md:flex flex-1 justify-start items-center gap-3 lg:gap-4">
                        <div className="w-[200px] lg:w-[320px] xl:w-[420px] ml-1">
                            <GlobalSearch />
                        </div>

                        {hasSaleItems && (
                            <Link href="/category/specials" className="bg-[#ff3b3b] hover:bg-[#e62e2e] text-white px-5 py-2 rounded-full shadow-[0_4px_14px_rgba(255,59,59,0.25)] flex items-center gap-1.5 transition-transform hover:scale-[1.03] active:scale-[0.98] text-[14px] font-extrabold">
                                <Percent className="w-[16px] h-[16px]" strokeWidth={3} />
                                <span className="tracking-tight">מבצעים</span>
                            </Link>
                        )}

                        <div className="relative" ref={menuRef}>
                            <button
                                className="bg-white rounded-full p-2.5 flex items-center justify-center shadow-sm border border-white hover:border-slate-200 transition group hover:bg-[#f6fbe8]"
                                onClick={() => user ? setUserMenuOpen(!userMenuOpen) : setLoginOpen(true)}
                                title={user ? "אזור אישי" : "התחברות"}
                            >
                                <User className="h-6 w-6 text-[#3a5223] group-hover:scale-110 transition-transform" strokeWidth={2} />
                            </button>

                            {userMenuOpen && user && (
                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[70] animate-in fade-in slide-in-from-top-2">
                                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                                    <p className="text-xs text-muted-foreground font-medium">שלום,</p>
                                    <p className="text-sm font-bold truncate text-slate-800">{user.email}</p>
                                </div>
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-slate-50 transition-colors font-medium text-slate-700"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <Shield className="h-4 w-4 text-slate-400" />
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
                    </div>

                    {/* Mobile Top: Actions + Logo + Hamburger */}
                    <div className="flex justify-between items-center w-full md:hidden h-full px-2" dir="rtl">
                        
                        {/* Right: Hamburger + Search */}
                        <div className="flex items-center gap-1 relative z-50">
                            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <button className="text-[#112a1e] p-2 hover:bg-black/5 rounded-full transition relative">
                                        <MenuIcon className="h-7 w-7" strokeWidth={2.5} />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[85vw] sm:w-[320px] p-0 flex flex-col bg-[#fcfbe8] gap-0 border-l-0 overflow-hidden" dir="rtl">
                                    {/* Mobile Menu Content - Top Section */}
                                    <div className="pt-10 px-5 pb-5">
                                        
                                        {/* User Login Section */}
                                        <button 
                                            className="w-full bg-white rounded-xl p-3 flex justify-between items-center shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors mb-4"
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                if(!user) setLoginOpen(true);
                                            }}
                                        >
                                            <span className="font-extrabold text-[#2c3e1c] text-[17px] tracking-tight">{user ? "אזור אישי" : "כניסה לחשבון"}</span>
                                            <div className="bg-[#ebf3db] p-1.5 rounded-full border border-[#c4eab3]">
                                                <User className="h-7 w-7 text-[#6c9b29]" strokeWidth={2}/>
                                            </div>
                                        </button>

                                        {/* Social Links bar (Mobile) */}
                                        <div className="flex items-center justify-between bg-[#96D142] p-2 rounded-xl shadow-sm border border-[#a3e635]">
                                            <a href={process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "#"} target="_blank" rel="noreferrer" className="bg-[#fcfbe8] hover:bg-white text-[#2c3e1c] h-10 w-10 rounded-xl flex items-center justify-center transition-colors shadow-sm">
                                                <Instagram className="h-[20px] w-[20px]" />
                                            </a>
                                            <a href={process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "#"} target="_blank" rel="noreferrer" className="bg-[#fcfbe8] hover:bg-white text-[#2c3e1c] h-10 w-10 rounded-xl flex items-center justify-center transition-colors shadow-sm">
                                                <Facebook className="h-[20px] w-[20px]" />
                                            </a>
                                            <a href={process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP || "#"} target="_blank" rel="noreferrer" className="bg-[#fcfbe8] hover:bg-white text-[#2c3e1c] h-10 w-10 rounded-xl flex items-center justify-center transition-colors shadow-sm">
                                                <MessageCircle className="h-[20px] w-[20px]" />
                                            </a>
                                            {settings.contact_phone && (
                                                <a href={`tel:${settings.contact_phone}`} className="bg-[#fcfbe8] hover:bg-white text-[#2c3e1c] h-10 px-4 rounded-xl flex items-center gap-2 transition-colors shadow-sm">
                                                    <Phone className="h-[16px] w-[16px]" />
                                                    <span className="text-[14px] font-black">{settings.contact_phone}</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Categories List */}
                                    <div className="flex-1 overflow-y-auto w-full pb-10">
                                        <nav className="flex flex-col w-full">
                                            {/* Static Home / Specials */}
                                            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-5 py-4 border-b border-[#e9ebd3]/60 hover:bg-black/5 transition-colors">
                                                <span className="font-extrabold text-[#112a1e] text-[18px] tracking-tight">דף הבית</span>
                                                <ChevronLeft className="h-5 w-5 text-[#2c3e1c]" strokeWidth={2.5} />
                                            </Link>
                                            
                                            {hasSaleItems && (
                                                <Link href="/category/specials" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-5 py-4 border-b border-[#e9ebd3]/60 hover:bg-black/5 transition-colors">
                                                    <div className="flex items-center gap-2"><Percent className="h-5 w-5 text-red-600" /> <span className="font-extrabold text-red-600 text-[18px] tracking-tight">מבצעים</span></div>
                                                    <ChevronLeft className="h-5 w-5 text-[#2c3e1c]" strokeWidth={2.5} />
                                                </Link>
                                            )}

                                            {/* DB Categories */}
                                            {parentCategories.map((cat) => {
                                                const subCats = getSubCategories(cat.id);
                                                const hasSubs = subCats.length > 0;
                                                const isExpanded = expandedCategory === cat.id;

                                                return (
                                                    <div key={cat.id} className="flex flex-col border-b border-[#e9ebd3]/60">
                                                        <div className="flex items-center w-full hover:bg-black/5 transition-colors">
                                                            <Link 
                                                                href={`/category/${cat.id}`} 
                                                                onClick={() => setMobileMenuOpen(false)} 
                                                                className={cn("flex-1 px-5 py-4", cat.id === 'specials' && 'hidden')}
                                                            >
                                                                <span className="font-extrabold text-[#112a1e] text-[18px] tracking-tight">{cat.name}</span>
                                                            </Link>
                                                            {hasSubs && (
                                                                <button 
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setExpandedCategory(isExpanded ? null : cat.id);
                                                                    }}
                                                                    className="px-5 py-4 border-r border-[#e9ebd3]/30"
                                                                >
                                                                    <ChevronLeft className={cn("h-5 w-5 text-[#2c3e1c] transition-transform duration-300", isExpanded ? "-rotate-90" : "rotate-0")} strokeWidth={2.5} />
                                                                </button>
                                                            )}
                                                            {!hasSubs && (
                                                                <div className="px-5 py-4 pointer-events-none opacity-20">
                                                                     <ChevronLeft className="h-5 w-5 text-[#2c3e1c]" strokeWidth={2.5} />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Expanded Sub-categories */}
                                                        {hasSubs && isExpanded && (
                                                            <div className="bg-[#fdfdf3] animate-in slide-in-from-top-2 duration-300 overflow-hidden">
                                                                {subCats.map(sub => (
                                                                    <Link key={sub.id} href={`/category/${sub.id}`} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between px-5 py-3 border-b border-[#e9ebd3]/30 hover:bg-black/5 pl-8 transition-colors">
                                                                        <span className="font-bold text-[#3a5223] text-[16px] tracking-tight pr-4 flex items-center gap-2">
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#AADB56] opacity-70"></span>
                                                                            {sub.name}
                                                                        </span>
                                                                        <ChevronLeft className="h-4 w-4 text-[#2c3e1c]/50" />
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            
                                            {/* Auth (Log out) */}
                                            {user && (
                                                <button onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }} className="flex items-center justify-between px-5 py-4 border-b border-[#e9ebd3]/60 hover:bg-black/5 transition-colors w-full">
                                                    <div className="flex items-center gap-2">
                                                        <LogOut className="h-5 w-5 text-red-600" /> 
                                                        <span className="font-extrabold text-red-600 text-[18px] tracking-tight">התנתקות</span>
                                                    </div>
                                                </button>
                                            )}
                                        </nav>
                                    </div>
                                </SheetContent>
                            </Sheet>
                            <button 
                                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                                className={cn(
                                    "p-2 rounded-full transition-all duration-300",
                                    mobileSearchOpen ? "bg-[#112a1e] text-white shadow-md rotate-90" : "text-[#112a1e] hover:bg-black/5"
                                )}
                            >
                                <Search className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Center: Mobile Logo */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-[60] mt-3 pointer-events-none">
                            <Link href="/" className="pointer-events-auto block">
                                <img src={settings.site_logo || "/placeholder.png"} alt="Logo" className="w-[85px] h-[85px] rounded-full object-cover transition-transform pointer-events-auto" />
                            </Link>
                        </div>

                        {/* Left: Mobile Cart */}
                        <div className="flex items-center gap-2 relative z-50">
                             <CartDrawer trigger={
                                <button className="bg-[#ebf3db] border border-[#c4eab3] rounded-full h-[40px] w-[50px] flex items-center justify-center relative shadow-sm hover:scale-105 transition-transform">
                                    <ShoppingBasket className="h-[22px] w-[22px] text-[#557e1f] relative bottom-1" />
                                    <div className="absolute -bottom-2.5 flex items-center justify-center w-full">
                                        <span className="bg-[#112a1e] text-white text-[11px] font-extrabold w-[20px] h-[20px] rounded-full shadow-md flex items-center justify-center border border-white">
                                            {isMounted ? items.length : 0}
                                        </span>
                                    </div>
                                </button>
                            } />
                        </div>
                    </div>

                    {/* Desktop Center: Massive Overlapping Logo */}
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-[60] pointer-events-none">
                        <div className="bg-transparent rounded-full p-2">
                            <Link href="/" className="block pointer-events-auto">
                                <img src={settings.site_logo || "/placeholder.png"} alt="Logo" className="w-[170px] h-[170px] rounded-full object-cover hover:scale-[1.02] transition-transform duration-300 translate-y-7 pointer-events-auto shadow-sm" />
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Left: Social Links and Cart */}
                    <div className="hidden md:flex flex-1 justify-end items-center gap-5 pointer-events-auto">
                        
                        {/* Social Links & Phone */}
                        <div className="flex items-center gap-1.5 bg-[#96D142] p-1.5 rounded-full shadow-sm border border-[#a3e635]">
                           <a href={process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "#"} target="_blank" rel="noreferrer" className="bg-[#fcfbe8] hover:bg-white text-[#2c3e1c] h-8 w-8 rounded-full flex items-center justify-center transition-colors shadow-sm" title="Instagram">
                              <Instagram className="h-[15px] w-[15px]" />
                           </a>
                           <a href={process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "#"} target="_blank" rel="noreferrer" className="bg-[#fcfbe8] hover:bg-white text-[#2c3e1c] h-8 w-8 rounded-full flex items-center justify-center transition-colors shadow-sm" title="Facebook">
                              <Facebook className="h-[15px] w-[15px]" />
                           </a>
                           <a href={process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP || "#"} target="_blank" rel="noreferrer" className="bg-[#fcfbe8] hover:bg-white text-[#2c3e1c] h-8 w-8 rounded-full flex items-center justify-center transition-colors shadow-sm" title="WhatsApp">
                              <MessageCircle className="h-[15px] w-[15px]" />
                           </a>
                           {settings.contact_phone && (
                               <a href={`tel:${settings.contact_phone}`} className="bg-[#fcfbe8] hover:bg-white text-[#2c3e1c] h-8 px-3 rounded-full flex items-center gap-1.5 transition-colors shadow-sm ml-1" title={settings.contact_phone}>
                                  <span className="text-[13px] font-extrabold tracking-tight">{settings.contact_phone}</span>
                                  <Phone className="h-[14px] w-[14px]" />
                               </a>
                           )}
                        </div>
                        <CartDrawer trigger={
                            <button className="bg-white rounded-full py-1.5 pl-2 pr-4 flex items-center gap-3 shadow-sm border border-white hover:border-slate-200 transition relative overflow-visible pointer-events-auto">
                                <span className="font-extrabold text-[#3a5223] tracking-tighter text-base">₪{isMounted ? totalPriceEstimated().toFixed(2) : "0.00"}</span>
                                <div className="relative bg-[#ebf3db] rounded-full p-2 h-9 w-9 flex items-center justify-center">
                                    <ShoppingBasket className="h-5 w-5 text-[#6c9b29]" />
                                    <span className="absolute -bottom-2 -left-1 bg-[#1a4222] text-white text-[11px] font-bold w-[22px] h-[22px] flex items-center justify-center rounded-full shadow-sm">
                                        {isMounted ? items.length : 0}
                                    </span>
                                </div>
                            </button>
                        } />
                    </div>
                </div>

                {/* 3. Category Navigation (White Strip) */}
                <nav className="hidden md:flex bg-white h-[46px] relative z-40 w-full" dir="rtl">
                    <div className="w-full max-w-[1920px] mx-auto h-full px-1 lg:px-2 xl:px-4">
                        <div className="grid grid-cols-[minmax(0,1fr)_160px_minmax(0,1fr)] h-full w-full">
                        
                            {/* RIGHT SIDE */}
                            <div className="flex justify-start h-full items-center">
                                {rightSideItems.map((item, i) => {
                                    if (item.isStatic) {
                                        return (
                                            <Link key={item.id} href={(item as any).href} className={cn("whitespace-nowrap px-2 md:px-3 xl:px-4 hover:text-[#AADB56] transition-colors flex items-center h-full text-[12px] md:text-[13px] xl:text-[14px] font-extrabold border-slate-200 border-dashed", (item as any).colorClass, i !== rightSideItems.length - 1 ? "border-l" : "")}>
                                                {item.name}
                                            </Link>
                                        );
                                    }

                                    const cat = item as Category;
                                    const subs = getSubCategories(cat.id);
                                    
                                    return (
                                        <div key={cat.id} className="flex h-full items-center shrink-0 group relative">
                                            <Link
                                                href={`/category/${cat.id}`}
                                                className={cn(
                                                    "whitespace-nowrap px-3 xl:px-4 hover:text-[#6c9b29] transition-colors flex items-center h-full text-[12px] md:text-[13px] xl:text-[14px] font-extrabold border-slate-200 border-dashed gap-1",
                                                    i !== rightSideItems.length - 1 ? "border-l" : ""
                                                )}
                                            >
                                                {cat.name}
                                                {subs.length > 0 && <ChevronDown className="h-3 w-3 text-slate-400 group-hover:rotate-180 transition-transform" strokeWidth={3} />}
                                            </Link>
                                            
                                            {/* Localized Megamenu Dropdown */}
                                            {subs.length > 0 && (
                                                <div className="absolute top-full right-0 pt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60] -mr-8">
                                                    <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-100 animate-in fade-in slide-in-from-top-1 px-8 py-8 rounded-[32px] flex gap-12 min-w-[620px]">
                                                        
                                                        {/* Right Side: Subcategories List */}
                                                        <div className="flex-1 flex flex-col">
                                                            <div className="flex items-center gap-2 mb-6 border-r-4 border-[#AADB56] pr-4">
                                                                <h3 className="text-[17px] font-black text-[#112a1e] tracking-tight">{cat.name}</h3>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                {subs.map(sub => (
                                                                    <Link 
                                                                        key={sub.id} 
                                                                        href={`/category/${sub.id}`}
                                                                        className="group/sub pr-4 pl-8 py-2.5 rounded-full hover:bg-[#AADB56] transition-all duration-200 text-[#112a1e] font-bold text-[16px] flex items-center justify-between"
                                                                    >
                                                                        <span>{sub.name}</span>
                                                                        <ChevronLeft className="w-4 h-4 opacity-0 -translate-x-2 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all" strokeWidth={3} />
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Left Side: Category Banner (with Smart Fallback) */}
                                                        {(() => {
                                                            const fallbacks: Record<string, string> = {
                                                                "פירות השוק": "/images/megamenu/fruits.png",
                                                                "ירקות השוק": "/images/megamenu/vegetables.png",
                                                                "ירוקים וחסות": "/images/megamenu/greens.png",
                                                                "מגשי אירוח": "/images/megamenu/platters.png",
                                                                "אגוזים ופיצוחים": "/images/megamenu/nuts.png",
                                                                "מיצים טבעיים": "/images/megamenu/juices.png",
                                                                "המזווה שלנו": "/images/megamenu/pantry.png",
                                                                "מוצרי חלב": "/images/megamenu/dairy.png",
                                                                "לחמים": "/images/megamenu/breads.png",
                                                                "משקאות ויינות": "/images/megamenu/drinks.png",
                                                                "לבית ולמטבח": "/images/megamenu/home_kitchen.png",
                                                            };
                                                            const bannerUrl = cat.image_url || fallbacks[cat.name];

                                                            return bannerUrl ? (
                                                                <div className="w-[260px] h-[340px] shrink-0 rounded-[24px] overflow-hidden shadow-xl border-4 border-white group/banner relative">
                                                                    <img 
                                                                        src={bannerUrl} 
                                                                        alt={cat.name} 
                                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover/banner:scale-110" 
                                                                    />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#112a1e]/40 to-transparent pointer-events-none" />
                                                                </div>
                                                            ) : (
                                                                <div className="w-[260px] h-[340px] bg-gradient-to-br from-[#AADB56]/10 to-[#AADB56]/30 rounded-[24px] flex items-center justify-center border-2 border-dashed border-[#AADB56]/40">
                                                                    <ShoppingBasket className="w-16 h-16 text-[#AADB56]/40" strokeWidth={1} />
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* CENTER SPACER FOR LOGO */}
                            <div className="w-[160px]" aria-hidden="true" />

                            {/* LEFT SIDE */}
                            <div className="flex justify-end h-full items-center">
                                {leftSideItems.map((item, i) => {
                                    if (item.isStatic) {
                                        return (
                                            <Link key={item.id} href={(item as any).href} className={cn("whitespace-nowrap px-2 md:px-3 xl:px-4 hover:text-[#AADB56] transition-colors flex items-center h-full text-[12px] md:text-[13px] xl:text-[14px] font-extrabold border-slate-200 border-dashed", (item as any).colorClass, i !== leftSideItems.length - 1 ? "border-l" : "")}>
                                                {item.name}
                                            </Link>
                                        );
                                    }

                                    const cat = item as Category;
                                    const subs = getSubCategories(cat.id);
                                    
                                    return (
                                        <div key={cat.id} className="flex h-full items-center shrink-0 group relative">
                                            <Link
                                                href={`/category/${cat.id}`}
                                                className={cn(
                                                    "whitespace-nowrap px-3 xl:px-4 hover:text-[#6c9b29] transition-colors flex items-center h-full text-[12px] md:text-[13px] xl:text-[14px] font-extrabold border-slate-200 border-dashed gap-1",
                                                    i !== leftSideItems.length - 1 ? "border-l" : ""
                                                )}
                                            >
                                                {cat.name}
                                                {subs.length > 0 && <ChevronDown className="h-3 w-3 text-slate-400 group-hover:rotate-180 transition-transform" strokeWidth={3} />}
                                            </Link>
                                            
                                            {/* Localized Megamenu Dropdown */}
                                            {subs.length > 0 && (
                                                <div className="absolute top-full right-0 pt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60] -mr-8">
                                                    <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-100 animate-in fade-in slide-in-from-top-1 px-8 py-8 rounded-[32px] flex gap-12 min-w-[620px]">
                                                        
                                                        {/* Right Side: Subcategories List */}
                                                        <div className="flex-1 flex flex-col">
                                                            <div className="flex items-center gap-2 mb-6 border-r-4 border-[#AADB56] pr-4">
                                                                <h3 className="text-[17px] font-black text-[#112a1e] tracking-tight">{cat.name}</h3>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                {subs.map(sub => (
                                                                    <Link 
                                                                        key={sub.id} 
                                                                        href={`/category/${sub.id}`}
                                                                        className="group/sub pr-4 pl-8 py-2.5 rounded-full hover:bg-[#AADB56] transition-all duration-200 text-[#112a1e] font-bold text-[16px] flex items-center justify-between"
                                                                    >
                                                                        <span>{sub.name}</span>
                                                                        <ChevronLeft className="w-4 h-4 opacity-0 -translate-x-2 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all" strokeWidth={3} />
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Left Side: Category Banner (with Smart Fallback) */}
                                                        {(() => {
                                                            const fallbacks: Record<string, string> = {
                                                                "פירות השוק": "/images/megamenu/fruits.png",
                                                                "ירקות השוק": "/images/megamenu/vegetables.png",
                                                                "ירוקים וחסות": "/images/megamenu/greens.png",
                                                                "מגשי אירוח": "/images/megamenu/platters.png",
                                                                "אגוזים ופיצוחים": "/images/megamenu/nuts.png",
                                                                "מיצים טבעיים": "/images/megamenu/juices.png",
                                                                "המזווה שלנו": "/images/megamenu/pantry.png",
                                                                "מוצרי חלב": "/images/megamenu/dairy.png",
                                                                "לחמים": "/images/megamenu/breads.png",
                                                                "משקאות ויינות": "/images/megamenu/drinks.png",
                                                                "לבית ולמטבח": "/images/megamenu/home_kitchen.png",
                                                            };
                                                            const bannerUrl = cat.image_url || fallbacks[cat.name];

                                                            return bannerUrl ? (
                                                                <div className="w-[260px] h-[340px] shrink-0 rounded-[24px] overflow-hidden shadow-xl border-4 border-white group/banner relative">
                                                                    <img 
                                                                        src={bannerUrl} 
                                                                        alt={cat.name} 
                                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover/banner:scale-110" 
                                                                    />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#112a1e]/40 to-transparent pointer-events-none" />
                                                                </div>
                                                            ) : (
                                                                <div className="w-[260px] h-[340px] bg-gradient-to-br from-[#AADB56]/10 to-[#AADB56]/30 rounded-[24px] flex items-center justify-center border-2 border-dashed border-[#AADB56]/40">
                                                                    <ShoppingBasket className="w-16 h-16 text-[#AADB56]/40" strokeWidth={1} />
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* 4. Mobile Toggleable Search Bar */}
                {mobileSearchOpen && (
                    <div className="w-full bg-white px-3 py-3 md:hidden animate-in slide-in-from-top duration-300" dir="rtl">
                        <GlobalSearch />
                    </div>
                )}
            </header>

            <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
        </>
    );
}
