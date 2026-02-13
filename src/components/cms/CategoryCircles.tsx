"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Category } from "@/types/supabase";
import Image from "next/image";

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
            <h3 className="text-xl font-bold mb-6 text-center md:text-right">קטגוריות מובילות</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/category/${cat.id}`}
                        className="flex flex-col items-center gap-2 min-w-[80px] snap-start group"
                    >
                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all shadow-md bg-secondary/10">
                            {cat.image_url ? (
                                <Image
                                    src={cat.image_url}
                                    alt={cat.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                                    🥑
                                </div>
                            )}
                        </div>
                        <span className="text-sm font-medium text-center">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
