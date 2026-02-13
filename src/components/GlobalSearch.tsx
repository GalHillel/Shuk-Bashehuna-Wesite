"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/supabase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    className="w-full bg-secondary/30 border border-transparent focus:border-primary rounded-full py-2.5 pr-12 pl-10 outline-none transition-all placeholder:text-muted-foreground"
                    placeholder="מה בא לכם לבשל היום? (עגבניות, לחם, חלב...)"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <Search className="h-5 w-5" />
                    )}
                </div>
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full transition-colors"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-background border rounded-2xl shadow-xl overflow-hidden z-[60]">
                    {results.length > 0 ? (
                        <div className="flex flex-col">
                            <div className="p-3 bg-secondary/20 text-xs font-semibold text-muted-foreground">מוצרים שנמצאו</div>
                            {results.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => handleSelect(product.id)}
                                    className="flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors text-right w-full"
                                >
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/20">
                                        <Image
                                            src={product.image_url || "/placeholder.svg"}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className="font-bold text-sm">{product.name}</span>
                                        <div className="flex items-center gap-2">
                                            {product.is_on_sale && product.sale_price ? (
                                                <>
                                                    <span className="text-red-600 font-bold text-xs">₪{product.sale_price.toFixed(2)}</span>
                                                    <span className="text-muted-foreground line-through text-[10px]">₪{product.price.toFixed(2)}</span>
                                                </>
                                            ) : (
                                                <span className="text-primary font-bold text-xs">₪{product.price.toFixed(2)}</span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                            <Link
                                href={`/search?q=${query}`}
                                onClick={() => setIsOpen(false)}
                                className="p-3 text-center text-sm font-medium text-primary hover:bg-primary/5 transition-colors border-t"
                            >
                                לכל התוצאות עבור &quot;{query}&quot;
                            </Link>
                        </div>
                    ) : query.length >= 2 && !isLoading ? (
                        <div className="p-8 text-center">
                            <p className="text-muted-foreground">לא נמצאו מוצרים עבור &quot;{query}&quot;</p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
