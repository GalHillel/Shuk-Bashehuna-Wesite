"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSkip {
    title: string;
    subtitle: string;
    image_url: string;
    button_text: string;
    link: string;
}

interface HeroSliderProps {
    data: {
        slides: HeroSkip[];
    };
}

export function HeroSlider({ data }: HeroSliderProps) {
    if (!data.slides || data.slides.length === 0) return null;

    return (
        <section className="w-full m-0 p-0 overflow-hidden">
            <div className="w-full">
                <Carousel
                    opts={{
                        loop: true,
                        direction: 'rtl',
                    }}
                    plugins={[
                        Autoplay({
                            delay: 6000,
                        }),
                    ]}
                    className="w-full relative group/slider"
                >
                    <CarouselContent className="m-0">
                        {data.slides.map((slide, index) => {
                            const defaultImages = ["/images/hero-story-1.png", "/images/hero-story-2.png"];
                            const imageSrc = (slide.image_url && slide.image_url.trim().length > 0)
                                ? slide.image_url
                                : defaultImages[index % 2];

                            return (
                                <CarouselItem key={index} className="relative h-[70vh] min-h-[500px] max-h-[850px] w-full p-0 overflow-hidden">
                                    {/* Story-style Progress Bars (Top) */}
                                    <div className="absolute top-10 left-1/2 -translate-x-1/2 z-40 flex gap-2 w-full max-w-2xl px-8" dir="rtl">
                                        {data.slides.map((_, i) => (
                                            <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-md">
                                                {i === index && (
                                                    <div className="h-full bg-[#AADB56] animate-progress-grow rounded-full shadow-[0_0_10px_#AADB56]" />
                                                )}
                                                {i < index && (
                                                    <div className="h-full bg-[#AADB56] opacity-40 rounded-full" />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="absolute inset-0">
                                        <div className="absolute inset-0 animate-ken-burns">
                                            <Image
                                                src={imageSrc}
                                                alt={slide.title}
                                                fill
                                                className="object-cover"
                                                priority={index === 0}
                                                sizes="100vw"
                                            />
                                        </div>
                                        {/* Premium Masking: Sophisticated Lime Wash */}
                                        <div className="absolute inset-0 bg-gradient-to-l from-[#112a1e]/80 via-[#112a1e]/20 to-transparent z-10" />
                                        <div className="absolute inset-0 bg-[#AADB56]/5 mix-blend-overlay z-[5]" />
                                        
                                        {/* Decorative Dot Pattern Overlay */}
                                        <div className="absolute inset-0 z-[6] opacity-10" 
                                             style={{ 
                                                 backgroundImage: 'radial-gradient(circle, #AADB56 1.5px, transparent 1.5px)', 
                                                 backgroundSize: '24px 24px' 
                                             }} 
                                        />
                                    </div>
                                    
                                    <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-20 lg:px-40 max-w-[1600px] mx-auto" dir="rtl">
                                        <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-right-12 duration-1000">
                                            {/* Subheading Badge */}
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                                                <div className="w-2 h-2 bg-[#AADB56] rounded-full animate-pulse" />
                                                <span className="text-white font-black text-xs md:text-sm uppercase tracking-widest">חוויית שוק פרימיום</span>
                                            </div>

                                            <h2 className="text-[48px] md:text-[88px] font-black text-white leading-[0.95] tracking-tighter drop-shadow-2xl">
                                                {slide.title.split(' ').map((word, i) => (
                                                    <span key={i} className={cn(i === 1 ? "text-[#AADB56]" : "")}>
                                                        {word}{' '}
                                                    </span>
                                                ))}
                                            </h2>
                                            
                                            <p className="text-xl md:text-2xl text-slate-100 font-bold leading-tight max-w-xl opacity-90 border-r-4 border-[#AADB56] pr-6">
                                                {slide.subtitle}
                                            </p>

                                            <div className="pt-6">
                                                <Button
                                                    size="lg"
                                                    className="h-[72px] px-12 rounded-[24px] text-2xl font-black bg-[#AADB56] text-[#112a1e] hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_20px_50px_rgba(170,219,86,0.3)] border-b-4 border-black/10"
                                                    asChild
                                                >
                                                    <Link href={slide.link} className="flex items-center gap-3">
                                                        {slide.button_text}
                                                        <ChevronLeft className="w-6 h-6" strokeWidth={3} />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>
                    
                </Carousel>
            </div>
        </section>
    );
}

