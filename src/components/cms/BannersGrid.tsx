"use client";

import Link from "next/link";
import Image from "next/image";

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

    return (
        <section className="container py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.banners.map((banner, idx) => (
                    <Link
                        key={idx}
                        href={banner.link}
                        className="relative h-[200px] md:h-[280px] rounded-xl overflow-hidden group block"
                    >
                        <Image
                            src={banner.image_url}
                            alt={banner.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm">
                            <span className="font-bold text-lg">{banner.title}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
