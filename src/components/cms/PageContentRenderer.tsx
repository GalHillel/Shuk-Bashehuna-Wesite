"use client";

import Image from "next/image";
import { PageBlock } from "@/types/cms";
import { cn } from "@/lib/utils";
import { 
    AlertTriangle, 
    Info, 
    CheckCircle2, 
    AlertCircle, 
    ZoomIn,
    ChevronDown
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";

interface PageContentRendererProps {
    blocks: PageBlock[];
    className?: string;
}

export function PageContentRenderer({ blocks, className }: PageContentRendererProps) {
    if (!blocks || blocks.length === 0) return null;

    return (
        <div className={cn("space-y-8 lg:space-y-12", className)}>
            {blocks.map((block, index) => {
                switch (block.type) {
                    case 'heading':
                        const Tag = block.level === 3 ? 'h3' : block.level === 4 ? 'h4' : 'h2';
                        return (
                            <Tag 
                                key={block.id} 
                                className={cn(
                                    "font-black text-[#112a1e] tracking-tight text-right",
                                    Tag === 'h2' ? "text-2xl md:text-3xl border-r-4 border-[#AADB56] pr-4 mt-12" : "text-xl md:text-2xl"
                                )}
                            >
                                {block.content}
                            </Tag>
                        );

                    case 'paragraph':
                        return (
                            <div 
                                key={block.id} 
                                className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed whitespace-pre-wrap text-right"
                            >
                                {block.content}
                            </div>
                        );

                    case 'image':
                        if (!block.url) return null;
                        return (
                            <div key={block.id} className="my-8 flex flex-col items-center">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="relative w-full max-w-2xl aspect-[4/3] bg-white rounded-2xl shadow-md border-4 border-white hover:shadow-xl transition-all duration-300 group overflow-hidden">
                                            <Image 
                                                src={block.url} 
                                                alt={block.caption || "Image"} 
                                                fill 
                                                className="object-contain group-hover:scale-[1.02] transition-transform duration-500" 
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <div className="bg-white text-[#112a1e] p-3 rounded-full shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                                    <ZoomIn className="w-6 h-6" />
                                                </div>
                                            </div>
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-4xl max-h-[90vh] p-1 bg-white border-none shadow-2xl overflow-hidden rounded-2xl">
                                        <DialogTitle className="sr-only">{block.caption || "Image Preview"}</DialogTitle>
                                        <DialogDescription className="sr-only">תצוגה מוגדלת של התמונה</DialogDescription>
                                        <div className="relative w-full h-[80vh] bg-slate-50 flex items-center justify-center">
                                            <Image 
                                                src={block.url} 
                                                alt={block.caption || "Full Image"} 
                                                fill 
                                                className="object-contain" 
                                            />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                {block.caption && (
                                    <p className="mt-3 text-sm text-slate-400 font-bold italic">{block.caption}</p>
                                )}
                            </div>
                        );

                    case 'alert':
                        const variantStyles = {
                            info: "bg-blue-50 border-blue-100 text-blue-800",
                            warning: "bg-amber-50 border-amber-100 text-amber-800",
                            danger: "bg-red-50 border-red-100 text-red-800",
                            success: "bg-green-50 border-green-100 text-green-800",
                        };
                        const Icon = {
                            info: Info,
                            warning: AlertTriangle,
                            danger: AlertCircle,
                            success: CheckCircle2,
                        }[block.variant || 'info'];

                        return (
                            <div 
                                key={block.id} 
                                className={cn(
                                    "p-6 rounded-2xl border flex items-start gap-4 text-right",
                                    variantStyles[block.variant || 'info']
                                )}
                            >
                                <Icon className="w-6 h-6 shrink-0 mt-0.5" />
                                <div className="text-lg font-bold leading-relaxed whitespace-pre-wrap">
                                    {block.content}
                                </div>
                            </div>
                        );

                    case 'faq_item':
                        return (
                            <Accordion key={block.id} type="single" collapsible className="w-full">
                                <AccordionItem 
                                    value={block.id} 
                                    className="bg-white px-6 py-1 border border-slate-100 shadow-sm rounded-2xl overflow-hidden data-[state=open]:border-[#AADB56] data-[state=open]:shadow-md transition-all duration-300"
                                >
                                    <AccordionTrigger className="text-lg md:text-xl font-extrabold text-[#112a1e] hover:text-[#7fbc26] hover:no-underline transition-colors py-4">
                                        {block.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-[17px] md:text-lg text-slate-600 font-medium leading-relaxed pb-6 pt-2">
                                        <div className="pl-4 border-r-4 border-[#AADB56] pr-4 bg-slate-50 rounded-lg p-4">
                                            {block.answer}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
}
