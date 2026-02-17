"use client";

import Link from "next/link";
import Image from "next/image";
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
        <section className="container py-8">
            <h3 className="text-xl font-bold mb-6 text-right">מבצעים חמים</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 md:gap-4 h-[400px] md:h-[500px]">
                {/* Large Main Banner - Takes 2x2 on Desktop, 1x1 on Mobile */}
                {banners[0] && (
                    <Link
                        href={banners[0].link || "#"}
                        className="relative col-span-1 md:col-span-2 row-span-2 rounded-[2rem] overflow-hidden group block shadow-md hover:shadow-xl hover:shadow-green-900/10 transition-all duration-300"
                    >
                        <Image
                            src={(banners[0].image_url && banners[0].image_url.trim().length > 0) ? banners[0].image_url : "/placeholder.png"}
                            alt={banners[0].title || "Banner"}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#14532d]/90 via-transparent to-transparent" />
                        <div className="absolute bottom-8 right-8 text-white max-w-md">
                            <h4 className="font-bold text-3xl md:text-4xl mb-3 drop-shadow-md">{banners[0].title}</h4>
                            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full px-6 py-2 text-base font-bold hover:bg-white hover:text-[#14532d] transition-all group-hover:px-8">
                                קנה עכשיו
                                <span className="text-lg">→</span>
                            </span>
                        </div>
                    </Link>
                )}

                {banners[1] && (
                    <Link
                        href={banners[1].link || "#"}
                        className="relative col-span-1 md:col-span-2 row-span-1 rounded-[2rem] overflow-hidden group block shadow-sm hover:shadow-lg hover:shadow-green-900/5 transition-all duration-300"
                    >
                        <Image
                            src={(banners[1].image_url && banners[1].image_url.trim().length > 0) ? banners[1].image_url : "/placeholder.png"}
                            alt={banners[1].title || "Banner"}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-[#14532d]/10 transition-colors" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
                            <span className="font-bold text-[#14532d]">{banners[1].title}</span>
                        </div>
                    </Link>
                )}

                {banners[2] && (
                    <Link
                        href={banners[2].link || "#"}
                        className="relative col-span-1 md:col-span-2 row-span-1 rounded-[2rem] overflow-hidden group block shadow-sm hover:shadow-lg hover:shadow-green-900/5 transition-all duration-300"
                    >
                        <Image
                            src={(banners[2].image_url && banners[2].image_url.trim().length > 0) ? banners[2].image_url : "/placeholder.png"}
                            alt={banners[2].title || "Banner"}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-[#14532d]/10 transition-colors" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
                            <span className="font-bold text-[#14532d]">{banners[2].title}</span>
                        </div>
                    </Link>
                )}
            </div>
        </section>
    );
}
