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
                .is("parent_id", null)
                .order("sort_order", { ascending: true });

            if (data) setCategories(data);
        }
        fetchCategories();
    }, [supabase]);

    return (
        <section className="container mx-auto px-4 py-4 md:py-6 md:hidden">
            <h3 className="text-xl font-extrabold mb-4 text-right text-slate-800 tracking-tight">קטגוריות מומלצות</h3>
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x px-2">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/category/${cat.id}`}
                        className="flex flex-col items-center gap-3 min-w-[90px] snap-start group"
                    >
                        <div className="relative p-[3px] rounded-full bg-gradient-to-br from-green-100 via-green-200 to-green-100 group-hover:from-green-400 group-hover:to-green-500 transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:-translate-y-1">
                            <div className="bg-white rounded-full p-[2px]">
                                <div className="relative w-[76px] h-[76px] rounded-full overflow-hidden bg-slate-50 border border-slate-50">
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
                        <span className="text-[13px] font-bold text-center text-slate-800 group-hover:text-primary transition-colors">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
