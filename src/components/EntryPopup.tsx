"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";

export function EntryPopup() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const hasSeenPopup = sessionStorage.getItem("hasSeenEntryPopup");

        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setOpen(true);
            }, 3500); // 3.5 seconds

            return () => clearTimeout(timer);
        }
    }, []);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            sessionStorage.setItem("hasSeenEntryPopup", "true");
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl rounded-[40px] bg-transparent">
                <DialogTitle className="sr-only">ברוכים הבאים לשוק בשכונה</DialogTitle>
                <DialogDescription className="sr-only">קבלו את מגוון הפירות והירקות הטריים עד הבית</DialogDescription>

                <div className="relative aspect-[4/5] sm:aspect-square w-full group">
                    {/* Background Image */}
                    <Image
                        src="/images/entry-popup.png"
                        alt="Fresh Vegetables Background"
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        priority
                    />

                    {/* Dark Overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#112a1e] via-[#112a1e]/20 to-transparent" />

                    {/* Close Button */}
                    <button
                        onClick={() => handleOpenChange(false)}
                        className="absolute top-6 left-6 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-colors z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Content Section */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-6 md:p-10 text-center" dir="rtl">
                        <div className="w-full p-6 md:p-8 backdrop-blur-xl bg-white/10 rounded-[32px] border border-white/20 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
                                    שמחים שחזרתם!<br />
                                    <span className="text-[#AADB56]">20 ₪ מתנה</span>
                                </h2>
                                <p className="text-lg md:text-xl font-bold text-slate-200 mt-3 drop-shadow-sm">
                                    לרכישה הראשונה באתר!
                                </p>
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 mt-4 animate-pulse">
                                    <p className="text-white text-xs font-bold uppercase tracking-widest mb-1">השתמשו בקוד קופון:</p>
                                    <p className="text-[#AADB56] text-3xl font-black tracking-[0.2em]">FIRST20</p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleOpenChange(false)}
                                className="w-full bg-[#AADB56] text-[#112a1e] py-4 md:py-5 rounded-2xl font-black text-xl hover:bg-[#b7ed56] hover:shadow-[0_0_20px_rgba(170,219,86,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-xl"
                            >
                                התחילו לקנות
                            </button>

                            <p className="text-xs text-white/40 font-bold uppercase tracking-widest">הכי טרי • הכי קרוב • הכי טעים</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
