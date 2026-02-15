"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/supabase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

interface FloatingSearchProps {
    logoSrc?: string | null;
}

export function FloatingSearch({ logoSrc }: FloatingSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const supabase = createClient();
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

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
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

    return (
        <div className="relative mx-auto flex w-fit max-w-2xl items-center justify-center transition-all duration-500 ease-out" ref={containerRef}>
            <div className={cn(
                "group flex h-12 items-center gap-3 rounded-full bg-white/90 px-4 py-2 shadow-sm backdrop-blur-md transition-all duration-500 border border-white/20",
                "hover:w-[350px] md:hover:w-[500px] hover:bg-white hover:shadow-md",
                "focus-within:w-[350px] md:focus-within:w-[500px] focus-within:bg-white focus-within:shadow-md",
                isOpen ? "w-[350px] md:w-[500px] bg-white rounded-b-none rounded-t-2xl shadow-none border-b-0" : "w-[180px]"
            )}>

                {/* Logo Icon (Always visible) */}
                <Link href="/" className="flex-shrink-0">
                    <Logo variant="icon" src={logoSrc} className="h-8 w-8" />
                </Link>

                {/* Separator */}
                <div className={cn("h-4 w-[1px] bg-slate-300 transition-opacity", (query || isOpen) ? "opacity-0" : "group-hover:opacity-0")} />

                {/* Search Input (Expands) */}
                <div className="relative flex-1 h-full flex items-center">

                    {/* Placeholder Text (Visible when collapsed) */}
                    <span className={cn(
                        "absolute right-0 pointer-events-none truncate text-sm font-medium text-slate-500 transition-opacity duration-300",
                        (query || isOpen) ? "opacity-0" : "group-hover:opacity-0 group-focus-within:opacity-0"
                    )}>
                        שוק בשכונה...
                    </span>

                    {/* Real Input */}
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="מה בא לך לחפש היום?"
                        className={cn(
                            "w-full bg-transparent text-sm outline-none transition-opacity duration-300 placeholder:text-slate-400 h-full",
                            (query || isOpen) ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                        )}
                    />
                </div>

                {/* Search Icon / Loader */}
                <div className={cn(
                    "flex-shrink-0 rounded-full p-2 transition-all duration-300",
                    (query || isOpen)
                        ? "bg-green-100 text-green-700 opacity-100 scale-100"
                        : "bg-transparent text-slate-400 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 scale-0 group-hover:scale-100 group-focus-within:scale-100"
                )}>
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Search className="h-4 w-4" />
                    )}
                </div>
            </div>

            {/* Results Dropdown (Attached to the bottom of the pill) */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-[calc(100%-1px)] left-0 right-0 bg-white rounded-b-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-t-0 border-white/20 overflow-hidden z-[-1] animate-in fade-in slide-in-from-top-2">
                    <div className="max-h-[60vh] overflow-y-auto pt-2">
                        <div className="p-3 bg-secondary/20 text-xs font-semibold text-muted-foreground flex justify-between items-center">
                            <span>מוצרים שנמצאו</span>
                            <button onClick={() => setIsOpen(false)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                        </div>
                        {results.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => handleSelect(product.id)}
                                className="flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors text-right w-full border-b border-slate-50 last:border-0"
                            >
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/20">
                                    <Image
                                        src={product.image_url || "/placeholder.svg"}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col flex-1 gap-0.5">
                                    <span className="font-bold text-sm text-slate-900">{product.name}</span>
                                    <div className="flex items-center gap-2">
                                        {product.is_on_sale && product.sale_price ? (
                                            <>
                                                <span className="text-red-600 font-bold text-xs">₪{product.sale_price.toFixed(2)}</span>
                                                <span className="text-muted-foreground line-through text-[10px]">₪{product.price.toFixed(2)}</span>
                                            </>
                                        ) : (
                                            <span className="text-slate-700 font-bold text-xs">₪{product.price.toFixed(2)}</span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                        <Link
                            href={`/search?q=${query}`}
                            onClick={() => setIsOpen(false)}
                            className="block p-3 text-center text-sm font-bold text-green-700 hover:bg-green-50 transition-colors bg-green-50/30"
                        >
                            לכל התוצאות
                        </Link>
                    </div>
                </div>
            )}

            {/* Empty State / No Results */}
            {isOpen && query.length >= 2 && !isLoading && results.length === 0 && (
                <div className="absolute top-[calc(100%-1px)] left-0 right-0 bg-white rounded-b-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-t-0 border-white/20 overflow-hidden z-[-1]">
                    <div className="p-6 text-center">
                        <p className="text-slate-500 font-medium text-sm">לא נמצאו מוצרים</p>
                    </div>
                </div>
            )}
        </div>
    );
}
