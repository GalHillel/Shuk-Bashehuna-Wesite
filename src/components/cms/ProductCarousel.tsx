"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/supabase";

interface ProductCarouselProps {
    title: string;
    data: {
        category_id?: string;
        limit?: number;
    };
}

export function ProductCarousel({ title, data }: ProductCarouselProps) {
    const supabase = createClient();
    const [products, setProducts] = useState<Product[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchProducts() {
            let query = supabase
                .from("products")
                .select("*")
                .eq("is_active", true)
                .order("created_at", { ascending: false })
                .limit(data.limit || 10);

            if (data.category_id && data.category_id !== 'specials') {
                query = query.eq("category_id", data.category_id);
            } else if (data.category_id === 'specials') {
                query = query.eq("is_on_sale", true);
            }

            const { data: productsData } = await query;
            if (productsData) setProducts(productsData);
        }
        fetchProducts();
    }, [supabase, data.category_id, data.limit]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (products.length === 0) return null;

    return (
        <section className="w-full py-10 md:py-16 overflow-hidden group/carousel" dir="rtl">
            {/* Editorial Header */}
            <div className="px-5 md:px-12 flex items-end justify-between mb-8 gap-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                        <div className="w-6 h-[2px] bg-[#AADB56]" />
                        <span className="text-[#AADB56] font-black text-[10px] md:text-xs uppercase tracking-widest">נבחר עבורך</span>
                    </div>
                    <h3 className="text-[26px] md:text-[44px] font-black text-[#1b3626] leading-[0.9] tracking-tighter">
                        {title}
                    </h3>
                </div>
                
                {data.category_id && (
                    <Button variant="link" asChild className="text-[#AADB56] hover:text-[#112a1e] p-0 h-auto text-[15px] md:text-[17px] font-black group transition-colors flex items-center gap-1 decoration-2 underline-offset-4 whitespace-nowrap shrink-0">
                        <Link href={`/category/${data.category_id}`}>
                            לכל המוצרים
                            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-translate-x-1" />
                        </Link>
                    </Button>
                )}
            </div>

            <div className="relative">
                {/* Desktop Floating Arrows */}
                <div className="hidden md:block">
                    <button 
                        onClick={() => scroll('right')} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 h-14 w-14 rounded-full bg-white/80 hover:bg-[#AADB56] hover:text-[#112a1e] border border-slate-200 text-[#1b3626] backdrop-blur-md shadow-xl transition-all opacity-0 group-hover/carousel:opacity-100 flex items-center justify-center translate-x-4 group-hover/carousel:translate-x-0"
                    >
                        <ChevronRight className="h-6 w-6" strokeWidth={3} />
                    </button>
                    <button 
                        onClick={() => scroll('left')} 
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 h-14 w-14 rounded-full bg-white/80 hover:bg-[#AADB56] hover:text-[#112a1e] border border-slate-200 text-[#1b3626] backdrop-blur-md shadow-xl transition-all opacity-0 group-hover/carousel:opacity-100 flex items-center justify-center -translate-x-4 group-hover/carousel:translate-x-0"
                    >
                        <ChevronLeft className="h-6 w-6" strokeWidth={3} />
                    </button>
                </div>

                {/* Full-Bleed Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex flex-row overflow-x-auto gap-4 md:gap-6 pb-8 scrollbar-hide snap-x snap-mandatory px-5 md:px-12"
                >
                    {products.map((product) => (
                        <div key={product.id} className="w-[175px] sm:w-[200px] md:w-[240px] lg:w-[260px] shrink-0 snap-start">
                            <ProductCard product={product} />
                        </div>
                    ))}
                    
                    {/* Ghost card for extra scroll space */}
                    <div className="w-1 md:w-12 shrink-0 h-1" />
                </div>
            </div>
        </section>
    );
}
