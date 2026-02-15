import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    variant?: "mobile" | "desktop" | "icon";
    src?: string | null;
}

export function Logo({ className, variant = "desktop", src }: LogoProps) {
    const showImage = !!src;

    if (showImage && src) {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                <div className="relative h-10 w-10 flex-shrink-0">
                    <Image
                        src={src}
                        alt="Shuk Bashehuna Logo"
                        fill
                        className="object-cover rounded-full"
                        priority
                    />
                </div>
                <span className={cn(
                    "font-extrabold text-lg leading-none text-foreground tracking-tight select-none",
                    variant === "mobile" || variant === "icon" ? "hidden sm:hidden" : "inline"
                )}>
                    שוק בשכונה
                </span>
            </div>
        );
    }

    // Default SVG / Styled Text Fallback
    return (
        <div className={cn("flex items-center gap-2 font-bold text-xl tracking-tight text-primary select-none", className)}>
            {/* Icon Example (Vegetable / Clover) */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-green-600 fill-green-100"
            >
                <path d="M11 19c0-5 3-9 8-9v9h-8Z" />
                <path d="M19 19c-5 0-9-3-9-8v8h9Z" />
                <path d="M11 11c0-4-3-8-8-8v8h8Z" />
            </svg>
            <span className={cn(variant === "mobile" || variant === "icon" ? "hidden sm:hidden" : "inline")}>
                שוק בשכונה
            </span>
        </div>
    );
}
