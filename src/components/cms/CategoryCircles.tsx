"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Category } from "@/types/supabase";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function CategoryCircles() {
    const supabase = createClient();
    const [categories, setCategories] = useState<Category[]>([]);

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
    }, [supabase]);

    return (
        <section className="container py-8">
            <h3 className="text-xl font-bold mb-6 text-right">קטגוריות</h3>
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x px-2">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/category/${cat.id}`}
                        className="flex flex-col items-center gap-3 min-w-[80px] snap-start group"
                    >
                        <div className="relative p-[3px] rounded-full bg-gradient-to-tr from-yellow-400 via-orange-500 to-red-500 group-hover:from-green-400 group-hover:to-green-600 transition-all duration-500 shadow-sm group-hover:shadow-md">
                            <div className="bg-white rounded-full p-[2px]">
                                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-secondary/10">
                                    {(cat.image_url && cat.image_url.trim().length > 0) ? (
                                        <Image
                                            src={cat.image_url}
                                            alt={cat.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-2xl">
                                            🥑
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-center text-foreground/80 group-hover:text-primary transition-colors">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
