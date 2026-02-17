"use client";

import { useState, useEffect } from "react";
import { Accessibility, Type, Sun, Eye, Link as LinkIcon, RotateCcw, X, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AccessibilityToolbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [fontSize, setFontSize] = useState(100);
    const [currentContrast, setCurrentContrast] = useState<'normal' | 'high' | 'negative'>('normal');
    const [isGrayscale, setIsGrayscale] = useState(false);
    const [isLinksHighlighted, setIsLinksHighlighted] = useState(false);
    const [isReadableFont, setIsReadableFont] = useState(false);

    // Apply changes
    useEffect(() => {
        const root = document.documentElement;

        // Font Size
        root.style.fontSize = `${fontSize}%`;

        // Contrast Modes
        root.classList.remove("high-contrast", "negative-contrast");
        if (currentContrast === 'high') root.classList.add("high-contrast");
        if (currentContrast === 'negative') root.classList.add("negative-contrast");

        // Grayscale
        if (isGrayscale) root.classList.add("grayscale-mode");
        else root.classList.remove("grayscale-mode");

        // Highlight Links
        if (isLinksHighlighted) root.classList.add("highlight-links");
        else root.classList.remove("highlight-links");

        // Readable Font
        if (isReadableFont) root.classList.add("readable-font");
        else root.classList.remove("readable-font");

    }, [fontSize, currentContrast, isGrayscale, isLinksHighlighted, isReadableFont]);

    const resetSettings = () => {
        setFontSize(100);
        setCurrentContrast('normal');
        setIsGrayscale(false);
        setIsLinksHighlighted(false);
        setIsReadableFont(false);
    };

    return (
        <>
            {/* Toggle Button (Peeking) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-4 left-0 z-40 flex items-center gap-2",
                    "bg-black text-white shadow-[4px_5px_10px_rgba(0,0,0,0.4)]",
                    "h-8 pr-2 pl-3 rounded-r-full", // Compact size (32px)
                    "transition-transform duration-300 ease-out",
                    isOpen ? "translate-x-0" : "-translate-x-[calc(100%-32px)] hover:translate-x-0", // Peeking Logic (32px visible)
                    "group"
                )}
                aria-label="תפריט נגישות"
                aria-expanded={isOpen}
            >
                <div className="relative w-6 h-6 flex items-center justify-center bg-white/10 rounded-full shrink-0">
                    <Accessibility className="h-3.5 w-3.5" />
                </div>

                <span className={cn(
                    "text-sm font-bold whitespace-nowrap transition-opacity duration-300 delay-100",
                    isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                    נגישות
                </span>
            </button>

            {/* Accessibility Panel */}
            {isOpen && (
                <div className="fixed bottom-16 left-4 z-[90] w-[300px] bg-[#18181b] text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in slide-in-from-left-5 fade-in duration-300 backdrop-blur-sm">
                    {/* Header */}
                    <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                        <h3 className="font-bold flex items-center gap-2">
                            <Accessibility className="h-5 w-5 text-green-400" />
                            כלי נגישות
                        </h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                            aria-label="סגור תפריט"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Controls */}
                    <div className="p-4 space-y-5">
                        {/* Text Size */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Type className="h-4 w-4" />
                                <span>גודל טקסט</span>
                            </div>
                            <div className="flex items-center justify-between bg-white/5 rounded-lg p-1">
                                <Button variant="ghost" size="icon" onClick={() => setFontSize(Math.max(100, fontSize - 10))} className="hover:bg-white/10 text-white">
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="font-mono font-bold w-12 text-center">{fontSize}%</span>
                                <Button variant="ghost" size="icon" onClick={() => setFontSize(Math.min(200, fontSize + 10))} className="hover:bg-white/10 text-white">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Toggles Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Grayscale */}
                            <button
                                onClick={() => setIsGrayscale(!isGrayscale)}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-white/10 transition-all",
                                    isGrayscale ? "bg-green-600 border-green-500" : "bg-white/5 hover:bg-white/10"
                                )}
                            >
                                <Eye className="h-5 w-5" />
                                <span className="text-xs font-medium">גווני אפור</span>
                            </button>

                            {/* Highlight Links */}
                            <button
                                onClick={() => setIsLinksHighlighted(!isLinksHighlighted)}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-white/10 transition-all",
                                    isLinksHighlighted ? "bg-green-600 border-green-500" : "bg-white/5 hover:bg-white/10"
                                )}
                            >
                                <LinkIcon className="h-5 w-5" />
                                <span className="text-xs font-medium">הדגשת קישורים</span>
                            </button>

                            {/* Readable Font */}
                            <button
                                onClick={() => setIsReadableFont(!isReadableFont)}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-white/10 transition-all",
                                    isReadableFont ? "bg-green-600 border-green-500" : "bg-white/5 hover:bg-white/10"
                                )}
                            >
                                <span className="text-lg font-bold font-sans">Ab</span>
                                <span className="text-xs font-medium">פונט קריא</span>
                            </button>

                            {/* Reset */}
                            <button
                                onClick={resetSettings}
                                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-white/10 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                            >
                                <RotateCcw className="h-5 w-5" />
                                <span className="text-xs font-medium">איפוס</span>
                            </button>
                        </div>

                        {/* Contrast Modes */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Sun className="h-4 w-4" />
                                <span>ניגודיות</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setCurrentContrast(currentContrast === 'high' ? 'normal' : 'high')}
                                    className={cn(
                                        "px-3 py-2 rounded-lg text-xs font-bold border transition-all",
                                        currentContrast === 'high'
                                            ? "bg-white text-black border-white"
                                            : "bg-black text-white border-white/20 hover:border-white/50"
                                    )}
                                >
                                    גבוהה (לבן/שחור)
                                </button>
                                <button
                                    onClick={() => setCurrentContrast(currentContrast === 'negative' ? 'normal' : 'negative')}
                                    className={cn(
                                        "px-3 py-2 rounded-lg text-xs font-bold border transition-all",
                                        currentContrast === 'negative'
                                            ? "bg-yellow-400 text-black border-yellow-400"
                                            : "bg-black text-yellow-400 border-yellow-400/20 hover:border-yellow-400/50"
                                    )}
                                >
                                    היפוך צבעים
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
