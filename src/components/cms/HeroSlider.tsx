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
    return (
        <section className="w-full py-4 md:py-6">
            <div className="container px-0 md:px-4">
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
                    className="w-full rounded-none md:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-500"
                >
                    <CarouselContent>
                        {data.slides.map((slide, index) => {
                            const imageSrc = (slide.image_url && slide.image_url.trim().length > 0)
                                ? slide.image_url
                                : "/placeholder.png";

                            return (
                                <CarouselItem key={index} className="relative h-[50vh] min-h-[400px] max-h-[600px] w-full">
                                    <div className="absolute inset-0">
                                        <Image
                                            src={imageSrc}
                                            alt={slide.title}
                                            fill
                                            className="object-cover brightness-[0.9] md:rounded-3xl"
                                            priority={index === 0}
                                            sizes="100vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#14532d] via-[#14532d]/30 to-transparent md:rounded-3xl opacity-90" />
                                    </div>
                                    <div className="relative h-full flex flex-col items-center justify-center text-center p-6 text-white pb-16 md:pb-6">
                                        <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-700 flex flex-col items-center">
                                            <h2 className="text-4xl md:text-7xl font-extrabold mb-4 tracking-tight text-white drop-shadow-lg leading-tight">
                                                {slide.title}
                                            </h2>
                                            <p className="text-lg md:text-2xl text-white/90 mb-8 font-medium drop-shadow-md leading-relaxed max-w-2xl">
                                                {slide.subtitle}
                                            </p>
                                            <Button
                                                size="lg"
                                                className="rounded-full px-12 py-7 text-xl font-bold bg-[#4ade80] text-[#052e16] hover:bg-[#22c55e] hover:text-white border-2 border-transparent transition-all shadow-[0_0_20px_rgba(74,222,128,0.4)] hover:shadow-[0_0_30px_rgba(74,222,128,0.6)] hover:scale-105"
                                                asChild
                                            >
                                                <Link href={slide.link}>{slide.button_text}</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>
                    {/* Navigation hidden on mobile to be cleaner, shown on hover on desktop? Or just standard. 
                        Let's keep standard but styled nicer.
                    */}
                    <CarouselNext className="hidden md:flex left-4 border-none bg-white/20 hover:bg-white/40 text-white rotate-180 backdrop-blur-md" />
                    <CarouselPrevious className="hidden md:flex right-4 border-none bg-white/20 hover:bg-white/40 text-white rotate-180 backdrop-blur-md" />
                </Carousel>
            </div>
        </section>
    );
}
