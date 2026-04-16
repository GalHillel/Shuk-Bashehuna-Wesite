"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/supabase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/useCart";

export function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const supabase = createClient();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const performSearch = useCallback(async (searchTerm: string) => {
        setIsLoading(true);
        setIsOpen(true);

        const { data } = await supabase
            .from("products")
            .select("*")
            .ilike("name", `%${searchTerm}%`)
            .eq("is_active", true)
            .limit(6);

        if (data) setResults(data as Product[]);
        setIsLoading(false);
    }, [supabase]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length >= 2) {
                performSearch(query);
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, performSearch]);

    // Handle clicks outside dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (productId: string) => {
        router.push(`/product/${productId}`);
        setIsOpen(false);
        setQuery("");
    };

    const clearSearch = () => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
    };

    const { addItem } = useCart();

    const handleAdd = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();
        e.preventDefault();
        addItem(product, 1);
        setIsOpen(false);
        setQuery("");
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    className="w-full bg-white text-slate-800 focus:ring-4 focus:ring-white/30 border-none rounded-full py-4 pr-14 pl-14 shadow-md outline-none transition-all placeholder:text-slate-400 font-bold"
                    placeholder="מה תרצו להזמין היום?"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <Search className="h-6 w-6" />
                    )}
                </div>
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                    >
                        <X className="h-4 w-4 text-slate-600" />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && (
                <div className="absolute top-[calc(100%+8px)] w-full bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2">
                    {results.length > 0 ? (
                        <div className="flex flex-col">
                            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">מוצרים שנמצאו</div>
                            {results.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => handleSelect(product.id)}
                                    role="button"
                                    tabIndex={0}
                                    className="group flex items-center gap-4 p-3 hover:bg-slate-50 transition-colors text-right w-full border-b border-slate-50 last:border-0 cursor-pointer"
                                >
                                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-white shadow-sm border border-slate-100">
                                        <Image
                                            src={product.image_url || "/placeholder.png"}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1 justify-center gap-1">
                                        <span className="font-bold text-[15px] text-slate-800 leading-tight">{product.name}</span>
                                        <div className="flex items-center gap-2">
                                            {product.is_on_sale && product.sale_price ? (
                                                <>
                                                    <span className="text-red-600 font-bold text-sm">₪{product.sale_price.toFixed(2)}</span>
                                                    <span className="text-slate-400 line-through text-xs">₪{product.price.toFixed(2)}</span>
                                                </>
                                            ) : (
                                                <span className="text-primary font-bold text-sm">₪{product.price.toFixed(2)}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => handleAdd(e, product)}
                                        className="h-10 w-10 flex-shrink-0 bg-green-50 hover:bg-primary text-primary hover:text-white rounded-full flex items-center justify-center transition-all shadow-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    </button>
                                </div>
                            ))}
                            <Link
                                href={`/search?q=${query}`}
                                onClick={() => setIsOpen(false)}
                                className="p-3 text-center text-sm font-bold text-primary hover:bg-green-50 transition-colors bg-slate-50"
                            >
                                לכל התוצאות עבור &quot;{query}&quot;
                            </Link>
                        </div>
                    ) : query.length >= 2 && !isLoading ? (
                        <div className="p-8 text-center flex flex-col items-center gap-3">
                            <span className="bg-slate-100 p-3 rounded-full"><Search className="h-6 w-6 text-slate-400" /></span>
                            <p className="text-slate-500 font-medium">לא נמצאו מוצרים עבור &quot;{query}&quot;</p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
