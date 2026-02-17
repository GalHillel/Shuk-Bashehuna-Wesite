"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already accepted cookies
        const accepted = localStorage.getItem("cookie_consent_accepted");
        if (!accepted) {
            // Show banner after a short delay for smooth entrance
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        setIsVisible(false);
        localStorage.setItem("cookie_consent_accepted", "true");
    };

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 z-50 p-4 transition-transform duration-500 ease-in-out",
                "bg-[#14532d] border-t border-green-800 shadow-2xl safe-area-bottom"
            )}
            dir="rtl"
        >
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3 text-white">
                    <div className="p-2 bg-white/10 rounded-full shrink-0">
                        <Cookie className="h-5 w-5 text-green-200" />
                    </div>
                    <p className="text-sm leading-relaxed max-w-2xl">
                        אתר זה עושה שימוש בקבצי Cookies על מנת לשפר את חווית הגלישה.
                        במידה ותמשיך לגלוש הנך מסכים לשימוש זה ולתנאי{" "}
                        <Link href="/privacy" className="underline underline-offset-2 hover:text-green-200 font-medium transition-colors">
                            מדיניות הפרטיות
                        </Link>
                        .
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                        onClick={handleAccept}
                        size="sm"
                        className="w-full sm:w-auto bg-white text-[#14532d] hover:bg-green-50 font-bold rounded-full px-6 whitespace-nowrap"
                    >
                        אני מסכים
                    </Button>
                </div>
            </div>
        </div>
    );
}
