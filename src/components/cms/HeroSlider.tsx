"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
        <section className="w-full m-0 p-0 border-b-4 border-[#112a1e]">
            <div className="w-full">
                <Carousel
                    opts={{
                        loop: true,
                        direction: 'rtl',
                    }}
                    plugins={[
                        Autoplay({
                            delay: 5000,
                        }),
                    ]}
                    className="w-full overflow-hidden"
                >
                    <CarouselContent className="m-0">
                        {data.slides.map((slide, index) => {
                            // Use our new premium images as defaults if none provided
                            const defaultImages = ["/images/hero-1.png", "/images/hero-2.png"];
                            const imageSrc = (slide.image_url && slide.image_url.trim().length > 0)
                                ? slide.image_url
                                : defaultImages[index % 2];

                            return (
                                <CarouselItem key={index} className="relative h-[65vh] min-h-[450px] max-h-[750px] w-full p-0">
                                    <div className="absolute inset-0 overflow-hidden">
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
                                        {/* Premium Masking: Sharp localized gradient for text + overall darkening */}
                                        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent z-10" />
                                        <div className="absolute inset-0 bg-[#112a1e]/10 z-0" />
                                    </div>
                                    
                                    <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-20 lg:px-32 max-w-7xl mx-auto" dir="rtl">
                                        <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-right-8 duration-1000">
                                            {/* Editorial Accent */}
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-1 bg-[#AADB56] rounded-full" />
                                                <span className="text-white font-black text-sm md:text-base uppercase tracking-[0.2em]">שוק בשכונה • פרימיום</span>
                                            </div>

                                            <h2 className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter drop-shadow-2xl">
                                                {slide.title}
                                            </h2>
                                            
                                            <p className="text-lg md:text-2xl text-slate-200 font-bold leading-relaxed max-w-xl drop-shadow-md">
                                                {slide.subtitle}
                                            </p>

                                            <div className="pt-4">
                                                <Button
                                                    size="lg"
                                                    className="h-16 px-10 rounded-xl text-xl font-black bg-[#AADB56] text-[#112a1e] hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                                                    asChild
                                                >
                                                    <Link href={slide.link}>{slide.button_text}</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Dash Indicator at the bottom of the slide */}
                                    <div className="absolute bottom-10 right-8 md:right-20 lg:right-32 z-30 flex gap-4 items-center">
                                        {data.slides.map((_, i) => (
                                            <div key={i} className="h-1.5 w-12 bg-white/20 rounded-full overflow-hidden">
                                                {i === index && (
                                                    <div className="h-full bg-[#AADB56] animate-progress-grow rounded-full" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>
                    
                    {/* Minimalist Glass Arrows */}
                    <div className="hidden md:flex absolute top-1/2 left-8 md:left-12 -translate-y-1/2 z-30">
                        <CarouselNext className="static h-14 w-14 rounded-2xl bg-white/10 hover:bg-[#AADB56] hover:text-[#112a1e] border border-white/20 text-white backdrop-blur-xl transition-all translate-x-0 [&_svg]:rotate-180" />
                    </div>
                    <div className="hidden md:flex absolute top-1/2 right-8 md:right-12 -translate-y-1/2 z-30">
                        <CarouselPrevious className="static h-14 w-14 rounded-2xl bg-white/10 hover:bg-[#AADB56] hover:text-[#112a1e] border border-white/20 text-white backdrop-blur-xl transition-all translate-x-0 [&_svg]:rotate-180" />
                    </div>
                </Carousel>
            </div>
        </section>
    );
}

