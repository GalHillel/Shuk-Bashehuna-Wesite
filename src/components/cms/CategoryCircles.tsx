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
        <section className="w-full py-6 md:hidden overflow-hidden" dir="rtl">
            <div className="px-5 mb-5 flex items-center justify-between">
                <h3 className="text-[20px] font-black text-[#1b3626] tracking-tighter">מה בא לך היום?</h3>
                <div className="h-[2px] flex-1 bg-gradient-to-l from-[#AADB56] to-transparent mr-4 opacity-40" />
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-5">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/category/${cat.id}`}
                        className="flex flex-col items-center gap-3 min-w-[95px] snap-start group active:scale-95 transition-transform"
                    >
                        {/* Premium Story-Style Ring */}
                        <div className="relative w-[86px] h-[86px] rounded-full p-[3px] bg-white border-2 border-[#AADB56]/20 group-hover:border-[#AADB56] shadow-sm transition-all duration-300">
                            <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-50">
                                {(cat.image_url && cat.image_url.trim().length > 0) ? (
                                    <Image
                                        src={cat.image_url}
                                        alt={cat.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                        <Image
                                            src="/placeholder.png"
                                            alt={cat.name}
                                            fill
                                            className="object-cover opacity-30"
                                        />
                                    </div>
                                )}
                            </div>
                            
                            {/* Subtle Glow Overlay */}
                            <div className="absolute inset-0 rounded-full border-[3px] border-white/40 pointer-events-none" />
                        </div>
                        
                        <span className="text-[14px] font-bold text-center text-[#2c3e1c] group-hover:text-[#AADB56] transition-colors leading-tight whitespace-nowrap">
                            {cat.name}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
