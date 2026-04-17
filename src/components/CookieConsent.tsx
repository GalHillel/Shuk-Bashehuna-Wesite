"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already accepted cookies with the new key
        const accepted = localStorage.getItem("shuk_cookie_consent_v1");
        if (!accepted) {
            // Show banner after a short delay for smooth entrance
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        setIsVisible(false);
        localStorage.setItem("shuk_cookie_consent_v1", "true");
    };

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                "fixed bottom-6 left-6 right-6 z-[120] transition-all duration-700 ease-out",
                "animate-in fade-in slide-in-from-bottom-10"
            )}
            dir="rtl"
        >
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] p-5 md:p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 rounded-2xl bg-[#AADB56]/20 flex items-center justify-center shrink-0 border border-[#AADB56]/30">
                            <Cookie className="h-7 w-7 text-[#112a1e]" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-black text-[#112a1e] text-lg tracking-tight">אנחנו משתמשים בעוגיות 🍪</h4>
                            <p className="text-slate-600 font-bold text-sm leading-relaxed">
                                אתר זה עושה שימוש בקבצי Cookies כדי להבטיח שתקבלו את החוויה הטובה ביותר, לשמור על סל הקניות שלכם ולנתח את נתוני הגלישה. 
                                <br className="hidden md:block" />
                                למידע נוסף, עיינו ב
                                <Link href="/privacy" className="text-[#112a1e] underline decoration-[#AADB56] decoration-2 underline-offset-4 hover:text-[#AADB56] transition-colors mx-1">
                                    מדיניות הפרטיות
                                </Link>
                                שלנו.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 md:border-r border-slate-200/60 pt-4 md:pt-0 md:pr-6">
                        <Button
                            onClick={handleAccept}
                            className="w-full md:w-auto bg-[#112a1e] hover:bg-[#1b3626] text-white font-black px-8 py-6 rounded-2xl text-[16px] shadow-xl hover:shadow-[0_10px_20px_rgba(17,42,30,0.2)] transition-all active:scale-95"
                        >
                            אישור והמשך
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
