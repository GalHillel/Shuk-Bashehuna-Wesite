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
        <section className="container mx-auto px-4 py-8">
            <h3 className="text-xl font-bold mb-6 text-right">קטגוריות</h3>
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x px-2">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/category/${cat.id}`}
                        className="flex flex-col items-center gap-3 min-w-[100px] snap-start group"
                    >
                        <div className="relative p-[3px] rounded-[2rem] bg-gradient-to-tr from-green-100 via-green-200 to-green-300 group-hover:from-green-400 group-hover:to-green-600 transition-all duration-500 shadow-sm group-hover:shadow-green-900/20 group-hover:-translate-y-1">
                            <div className="bg-white rounded-[1.8rem] p-[2px]">
                                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-[1.7rem] overflow-hidden bg-secondary/10">
                                    {(cat.image_url && cat.image_url.trim().length > 0) ? (
                                        <Image
                                            src={cat.image_url}
                                            alt={cat.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                            <Image
                                                src="/placeholder.png"
                                                alt={cat.name}
                                                fill
                                                className="object-cover opacity-50"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-center text-[#052e16] group-hover:text-[#14532d] transition-colors">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
