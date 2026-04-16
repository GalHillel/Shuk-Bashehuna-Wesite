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
        <section className="container py-4 md:py-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">{title}</h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => scroll('right')} className="rounded-full h-10 w-10 border-slate-200 hover:bg-slate-50 text-slate-700 bg-white shadow-sm">
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => scroll('left')} className="rounded-full h-10 w-10 border-slate-200 hover:bg-slate-50 text-slate-700 bg-white shadow-sm">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex flex-row overflow-x-auto gap-3 md:gap-4 pb-4 md:pb-4 -mx-4 md:-mx-4 px-4 md:px-4 scrollbar-hide snap-x snap-mandatory"
            >
                {products.map((product) => (
                    <div key={product.id} className="w-[165px] sm:w-[180px] md:w-[190px] lg:w-[200px] xl:w-[220px] shrink-0 snap-start">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
            {data.category_id && (
                <div className="text-center mt-2">
                    <Button variant="link" asChild className="text-primary text-lg font-bold">
                        <Link href={`/category/${data.category_id}`}>לכל המוצרים בקטגוריה &larr;</Link>
                    </Button>
                </div>
            )}
        </section>
    );
}
