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
        <section className="w-full">
            <Carousel
                plugins={[
                    Autoplay({
                        delay: 5000,
                    }),
                ]}
                className="w-full"
            >
                <CarouselContent>
                    {data.slides.map((slide, index) => (
                        <CarouselItem key={index} className="relative h-[400px] md:h-[500px] w-full">
                            <div className="absolute inset-0">
                                <Image
                                    src={slide.image_url}
                                    alt={slide.title}
                                    fill
                                    className="object-cover brightness-[0.85]"
                                    priority={index === 0}
                                />
                            </div>
                            <div className="relative container h-full flex items-center justify-center text-center">
                                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-2xl animate-in fade-in zoom-in duration-500">
                                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-primary">
                                        {slide.title}
                                    </h2>
                                    <p className="text-lg md:text-xl text-muted-foreground mb-6">
                                        {slide.subtitle}
                                    </p>
                                    <Button size="lg" className="rounded-full px-8 text-lg" asChild>
                                        <Link href={slide.link}>{slide.button_text}</Link>
                                    </Button>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 bg-white/80 hover:bg-white" />
                <CarouselNext className="right-4 bg-white/80 hover:bg-white" />
            </Carousel>
        </section>
    );
}
