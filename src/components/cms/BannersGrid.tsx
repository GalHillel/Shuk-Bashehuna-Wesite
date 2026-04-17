"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Banner {
    image_url: string;
    title: string;
    link: string;
}

interface BannersGridProps {
    data: {
        banners: Banner[];
    };
}

export function BannersGrid({ data }: BannersGridProps) {
    if (!data?.banners?.length) return null;

    // Use first 3 banners for Bento Grid
    const banners = data.banners.slice(0, 3);

    return (
        <section className="w-full py-8 md:py-12 overflow-hidden" dir="rtl">
            {/* Editorial Header */}
            <div className="px-5 md:px-12 flex items-end justify-between mb-8 gap-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                        <div className="w-6 h-[2px] bg-[#AADB56]" />
                        <span className="text-[#AADB56] font-black text-[10px] md:text-xs uppercase tracking-widest">מבצעים חמים</span>
                    </div>
                    <h3 className="text-[26px] md:text-[44px] font-black text-[#1b3626] leading-[0.9] tracking-tighter">
                        דילים שאסור לפספס
                    </h3>
                </div>
            </div>

            <div className="px-5 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-none md:grid-rows-2 gap-4 md:gap-6 min-h-[600px] md:h-[550px]">
                    {/* Large Main Banner */}
                    {banners[0] && (
                        <Link
                            href={banners[0].link || "#"}
                            className="relative col-span-1 md:col-span-2 row-span-1 md:row-span-2 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden group block border border-slate-100 hover:border-[#AADB56]/30 transition-all duration-500 shadow-sm hover:shadow-2xl"
                        >
                            <Image
                                src={(banners[0].image_url && banners[0].image_url.trim().length > 0) ? banners[0].image_url : "/placeholder.png"}
                                alt={banners[0].title || "Banner"}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            {/* Premium Masking */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#112a1e]/90 via-[#112a1e]/20 to-transparent" />
                            <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 text-white max-w-md">
                                <h4 className="font-black text-3xl md:text-5xl mb-6 leading-tight drop-shadow-2xl text-white">
                                    {banners[0].title}
                                </h4>
                                <div className="inline-flex items-center gap-3 bg-[#AADB56] text-[#112a1e] rounded-2xl px-8 py-4 text-lg font-black hover:bg-white transition-all group-hover:scale-105 shadow-xl">
                                    קנה עכשיו
                                    <ChevronLeft className="w-6 h-6" strokeWidth={3} />
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Secondary Banners */}
                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 gap-4 md:gap-6">
                        {banners.slice(1, 3).map((banner, i) => (
                            <Link
                                key={i}
                                href={banner.link || "#"}
                                className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group block border border-slate-100 min-h-[220px] transition-all duration-500 shadow-sm hover:shadow-xl"
                            >
                                <Image
                                    src={(banner.image_url && banner.image_url.trim().length > 0) ? banner.image_url : "/placeholder.png"}
                                    alt={banner.title || "Banner"}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-[#AADB56]/10 transition-colors" />
                                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black/60 to-transparent">
                                    <div className="flex items-center justify-between">
                                        <span className="font-black text-xl md:text-2xl text-white drop-shadow-md">
                                            {banner.title}
                                        </span>
                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:bg-[#AADB56] group-hover:text-[#112a1e] group-hover:border-transparent transition-all">
                                            <ChevronLeft className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
