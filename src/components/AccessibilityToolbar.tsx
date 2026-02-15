"use client";

import { useState, useEffect } from "react";
import { Accessibility, Type, Sun, Eye, Link as LinkIcon, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AccessibilityToolbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [fontSize, setFontSize] = useState(100); // Percentage
    const [isHighContrast, setIsHighContrast] = useState(false);
    const [isGrayscale, setIsGrayscale] = useState(false);
    const [isLinksHighlighted, setIsLinksHighlighted] = useState(false);

    // Apply changes
    useEffect(() => {
        const root = document.documentElement;

        // Font Size
        root.style.fontSize = `${fontSize}%`;

        // High Contrast
        if (isHighContrast) {
            root.classList.add("high-contrast");
        } else {
            root.classList.remove("high-contrast");
        }

        // Grayscale
        if (isGrayscale) {
            root.classList.add("grayscale-mode");
        } else {
            root.classList.remove("grayscale-mode");
        }

        // Highlight Links
        if (isLinksHighlighted) {
            root.classList.add("highlight-links");
        } else {
            root.classList.remove("highlight-links");
        }

        // Persist
        localStorage.setItem("accessibility-settings", JSON.stringify({
            fontSize,
            isHighContrast,
            isGrayscale,
            isLinksHighlighted
        }));

    }, [fontSize, isHighContrast, isGrayscale, isLinksHighlighted]);

    // Load settings
    useEffect(() => {
        const saved = localStorage.getItem("accessibility-settings");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setFontSize(parsed.fontSize || 100);
                setIsHighContrast(parsed.isHighContrast || false);
                setIsGrayscale(parsed.isGrayscale || false);
                setIsLinksHighlighted(parsed.isLinksHighlighted || false);
            } catch (e) {
                console.error("Failed to parse accessibility settings", e);
            }
        }
    }, []);

    const resetSettings = () => {
        setFontSize(100);
        setIsHighContrast(false);
        setIsGrayscale(false);
        setIsLinksHighlighted(false);
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 left-0 z-[90] bg-blue-600 text-white pl-4 pr-6 py-3 rounded-r-3xl shadow-lg transition-all duration-300 hover:bg-blue-700",
                    "-translate-x-1/3 hover:translate-x-0 active:translate-x-0 focus:translate-x-0",
                    isOpen ? "translate-x-0" : ""
                )}
                aria-label="תפריט נגישות"
            >
                <Accessibility className="h-6 w-6 translate-x-1" />
            </button>

            {/* Toolbar Panel */}
            {isOpen && (
                <div className="fixed bottom-20 left-4 z-[90] w-72 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Accessibility className="h-4 w-4" />
                            כלי נגישות
                        </h3>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Font Size */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium flex items-center gap-2">
                                <Type className="h-4 w-4" />
                                גודל טקסט
                            </span>
                            <div className="flex gap-1">
                                <Button variant="outline" size="sm" onClick={() => setFontSize(Math.max(100, fontSize - 10))}>-</Button>
                                <span className="w-12 text-center text-sm my-auto">{fontSize}%</span>
                                <Button variant="outline" size="sm" onClick={() => setFontSize(Math.min(150, fontSize + 10))}>+</Button>
                            </div>
                        </div>

                        {/* High Contrast */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium flex items-center gap-2">
                                <Sun className="h-4 w-4" />
                                ניגודיות גבוהה
                            </span>
                            <div className="flex items-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={isHighContrast} onChange={() => setIsHighContrast(!isHighContrast)} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>

                        {/* Grayscale */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                גווני אפור
                            </span>
                            <div className="flex items-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={isGrayscale} onChange={() => setIsGrayscale(!isGrayscale)} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>

                        {/* Highlight Links */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium flex items-center gap-2">
                                <LinkIcon className="h-4 w-4" />
                                הדגשת קישורים
                            </span>
                            <div className="flex items-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={isLinksHighlighted} onChange={() => setIsLinksHighlighted(!isLinksHighlighted)} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                            <Button variant="ghost" size="sm" className="w-full text-slate-500 hover:text-slate-700" onClick={resetSettings}>
                                <RotateCcw className="h-3 w-3 mr-2" />
                                איפוס הגדרות
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
