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
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[400px] md:h-[500px]">
                {/* Large Main Banner - Takes 2x2 on Desktop, 1x1 on Mobile */}
                {banners[0] && (
                    <Link
                        href={banners[0].link || "#"}
                        className="relative col-span-1 md:col-span-2 row-span-2 rounded-3xl overflow-hidden group block shadow-sm hover:shadow-md transition-shadow"
                    >
                        <Image
                            src={(banners[0].image_url && banners[0].image_url.trim().length > 0) ? banners[0].image_url : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600"}
                            alt={banners[0].title || "Banner"}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-6 right-6 text-white">
                            <h4 className="font-bold text-2xl md:text-3xl mb-2">{banners[0].title}</h4>
                            <span className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full px-4 py-1.5 text-sm font-medium hover:bg-white hover:text-primary transition-colors">
                                קנה עכשיו
                            </span>
                        </div>
                    </Link>
                )}

                {/* Secondary Banners - Stacked on Mobile? Actually grid-rows-2 implies... 
                    Mobile: Just flex column or keep grid?
                    Let's use grid-cols-1 for mobile so they stack naturally.
                    But wait, h-[400px] fixed height might be too small for 3 items stacked.
                    Let's adjust height or use aspect-ratio.
                    For simplicity and robustness:
                */}

                {banners[1] && (
                    <Link
                        href={banners[1].link || "#"}
                        className="relative col-span-1 md:col-span-2 row-span-1 rounded-3xl overflow-hidden group block shadow-sm hover:shadow-md transition-shadow"
                    >
                        <Image
                            src={(banners[1].image_url && banners[1].image_url.trim().length > 0) ? banners[1].image_url : "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800"}
                            alt={banners[1].title || "Banner"}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl shadow-sm">
                            <span className="font-bold text-primary">{banners[1].title}</span>
                        </div>
                    </Link>
                )}

                {banners[2] && (
                    <Link
                        href={banners[2].link || "#"}
                        className="relative col-span-1 md:col-span-2 row-span-1 rounded-3xl overflow-hidden group block shadow-sm hover:shadow-md transition-shadow"
                    >
                        <Image
                            src={(banners[2].image_url && banners[2].image_url.trim().length > 0) ? banners[2].image_url : "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800"}
                            alt={banners[2].title || "Banner"}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl shadow-sm">
                            <span className="font-bold text-primary">{banners[2].title}</span>
                        </div>
                    </Link>
                )}
            </div>
        </section>
    );
}
