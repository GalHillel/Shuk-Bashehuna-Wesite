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
    Plus,
    Minus
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

    // Grouping logic for FAQ items
    const renderedBlocks: React.ReactNode[] = [];
    let currentFaqGroup: any[] = [];

    const flushFaqGroup = () => {
        if (currentFaqGroup.length > 0) {
            const groupId = `faq-group-${renderedBlocks.length}`;
            renderedBlocks.push(
                <Accordion key={groupId} type="single" collapsible className="w-full space-y-3">
                    {currentFaqGroup.map((item) => (
                        <AccordionItem 
                            key={item.id} 
                            value={item.id} 
                            className="bg-white px-5 md:px-8 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-3xl overflow-hidden data-[state=open]:border-[#AADB56] data-[state=open]:shadow-[0_10px_30px_rgba(170,219,86,0.1)] transition-all duration-500 group"
                        >
                            <AccordionTrigger className="text-base md:text-lg font-bold text-[#1a2e05] hover:text-[#3a5223] hover:no-underline transition-all py-5 text-right [&>svg]:hidden">
                                <span className="flex-1 pr-1">{item.question}</span>
                                <div className="bg-[#f2f7e4] group-data-[state=open]:bg-[#AADB56] p-1.5 rounded-full transition-colors duration-300">
                                    <Plus className="h-4 w-4 text-[#112a1e] group-data-[state=open]:hidden" strokeWidth={3} />
                                    <Minus className="h-4 w-4 text-white hidden group-data-[state=open]:block" strokeWidth={3} />
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-sm md:text-base text-slate-700 font-medium leading-relaxed pb-6 pt-0 animate-in fade-in slide-in-from-top-1 duration-300">
                                <div className="bg-[#f7fbe1] rounded-2xl p-5 border border-[#e4f0c8]/50">
                                    {item.answer}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            );
            currentFaqGroup = [];
        }
    };

    blocks.forEach((block) => {
        if (block.type === 'faq_item') {
            currentFaqGroup.push(block);
        } else {
            flushFaqGroup();
            
            // Render other block types
            switch (block.type) {
                case 'heading': {
                    const Tag = block.level === 3 ? 'h3' : block.level === 4 ? 'h4' : 'h2';
                    renderedBlocks.push(
                        <Tag 
                            key={block.id} 
                            className={cn(
                                "font-extrabold text-[#112a1e] tracking-tight text-right",
                                Tag === 'h2' ? "text-2xl md:text-3xl border-r-4 border-[#AADB56] pr-4 mt-12 mb-6" : "text-xl md:text-2xl mt-8 mb-4"
                            )}
                        >
                            {block.content}
                        </Tag>
                    );
                    break;
                }

                case 'paragraph':
                    renderedBlocks.push(
                        <div 
                            key={block.id} 
                            className="text-base md:text-lg text-slate-600 font-medium leading-relaxed whitespace-pre-wrap text-right mb-6"
                        >
                            {block.content}
                        </div>
                    );
                    break;

                case 'image':
                    if (block.url) {
                        renderedBlocks.push(
                            <div key={block.id} className="my-12 flex flex-col items-center">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="relative w-full max-w-2xl aspect-[16/10] bg-white rounded-3xl shadow-xl border-8 border-white hover:shadow-2xl transition-all duration-500 group overflow-hidden">
                                            <Image 
                                                src={block.url} 
                                                alt={block.caption || "Image"} 
                                                fill 
                                                className="object-cover group-hover:scale-[1.03] transition-transform duration-700" 
                                            />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <div className="bg-white/90 backdrop-blur-md text-[#112a1e] p-4 rounded-full shadow-2xl transform scale-50 group-hover:scale-100 transition-all duration-500">
                                                    <ZoomIn className="w-8 h-8" />
                                                </div>
                                            </div>
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-5xl max-h-[95vh] p-0 bg-white border-none shadow-2xl overflow-hidden rounded-3xl">
                                        <DialogTitle className="sr-only">{block.caption || "Image Preview"}</DialogTitle>
                                        <DialogDescription className="sr-only">תצוגה מוגדלת של התמונה</DialogDescription>
                                        <div className="relative w-full h-[85vh] bg-slate-50">
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
                                    <p className="mt-4 text-[15px] text-slate-400 font-black italic tracking-wide">{block.caption}</p>
                                )}
                            </div>
                        );
                    }
                    break;

                case 'alert': {
                    const variantStyles = {
                        info: "bg-blue-50 border-blue-200 text-blue-900 shadow-blue-900/5",
                        warning: "bg-amber-50 border-amber-200 text-amber-900 shadow-amber-900/5",
                        danger: "bg-red-50 border-red-200 text-red-900 shadow-red-900/5",
                        success: "bg-green-50 border-green-200 text-green-900 shadow-green-900/5",
                    };
                    const Icon = {
                        info: Info,
                        warning: AlertTriangle,
                        danger: AlertCircle,
                        success: CheckCircle2,
                    }[block.variant || 'info'];

                    renderedBlocks.push(
                        <div 
                            key={block.id} 
                            className={cn(
                                "p-8 rounded-3xl border-2 flex items-start gap-5 text-right shadow-sm mb-10 transition-transform hover:scale-[1.01] duration-300",
                                variantStyles[block.variant || 'info']
                            )}
                        >
                            <Icon className="w-8 h-8 shrink-0 mt-0.5" strokeWidth={2.5} />
                            <div className="text-xl font-black leading-relaxed whitespace-pre-wrap">
                                {block.content}
                            </div>
                        </div>
                    );
                    break;
                }
            }
        }
    });

    // Final flush for remaining FAQs
    flushFaqGroup();

    return (
        <div className={cn("space-y-6 lg:space-y-8 pb-20", className)}>
            {renderedBlocks}
        </div>
    );
}
