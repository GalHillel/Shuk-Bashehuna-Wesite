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
                                : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600";

                            return (
                                <CarouselItem key={index} className="relative h-[50vh] min-h-[400px] max-h-[600px] w-full">
                                    <div className="absolute inset-0">
                                        <Image
                                            src={imageSrc}
                                            alt={slide.title}
                                            fill
                                            className="object-cover brightness-[0.85] md:rounded-3xl"
                                            priority={index === 0}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:rounded-3xl" />
                                    </div>
                                    <div className="relative h-full flex flex-col items-center justify-center text-center p-6 text-white pb-16 md:pb-6">
                                        <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-700">
                                            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-white drop-shadow-md">
                                                {slide.title}
                                            </h2>
                                            <p className="text-lg md:text-2xl text-white/90 mb-8 font-medium drop-shadow leading-relaxed max-w-2xl mx-auto">
                                                {slide.subtitle}
                                            </p>
                                            <Button
                                                size="lg"
                                                className="rounded-full px-10 py-6 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-transparent hover:border-white/20 transition-all shadow-lg hover:shadow-xl hover:scale-105"
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
