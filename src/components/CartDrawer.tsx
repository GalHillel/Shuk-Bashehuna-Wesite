"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Trash2, Plus, Minus, X, Heart } from "lucide-react";
import { useCart } from "@/store/useCart";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const UNIT_LABELS: Record<string, string> = {
    kg: 'ק"ג',
    unit: "יח'",
    pack: "מארז",
};

interface CartDrawerProps {
    trigger?: React.ReactNode;
}

export function CartDrawer({ trigger }: CartDrawerProps) {
    const { items, removeItem, updateQuantity, totalPriceEstimated, clearCart } = useCart();
    const total = totalPriceEstimated();

    const [open, setOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [promoCategories, setPromoCategories] = useState<any[]>([]);

    useEffect(() => {
        async function fetchPromoCats() {
            const supabase = createClient();
            const { data } = await supabase
                .from("categories")
                .select("*")
                .eq("is_visible", true)
                .is("parent_id", null)
                .order("sort_order", { ascending: true })
                .limit(4);
            if (data) setPromoCategories(data);
        }
        fetchPromoCats();
    }, []);

    const triggerElement = trigger ? (
        trigger
    ) : (
        <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {items.length}
                </span>
            )}
        </Button>
    );

    if (items.length === 0) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {triggerElement}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[420px] p-0 border-none bg-white rounded-3xl pt-2 pb-6 shadow-2xl" dir="rtl">
                    <DialogTitle className="sr-only">העגלה ריקה</DialogTitle>
                    <div className="flex flex-col items-center pt-10 pb-4 text-center px-6 relative w-full">
                        
                        {/* Floating Bowl Icon */}
                        <div className="absolute -top-[45px] left-1/2 -translate-x-1/2 bg-white rounded-full p-1 shadow-[0_4px_15px_-4px_rgba(0,0,0,0.1)]">
                            <div className="bg-[#ffd428] rounded-full h-[70px] w-[70px] flex items-center justify-center border-4 border-white overflow-hidden relative shadow-inner">
                                <span className="text-[40px] absolute -bottom-1">🥗</span>
                            </div>
                        </div>
                        
                        <h2 className="text-[32px] font-extrabold text-[#1b3626] mt-4 mb-1.5 tracking-tight">העגלה ריקה</h2>
                        <p className="text-slate-600 font-medium text-[16px] mb-8 max-w-[90%] leading-snug">
                            ריק כאן, מלאו את העגלה במוצרים מהמחלקות הפופולריות
                        </p>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            {promoCategories.map((cat, i) => {
                                const emojis = ["🍅", "🍍", "🧀", "🥖"];
                                return (
                                    <Link key={cat.id} href={`/category/${cat.id}`} onClick={() => setOpen(false)} className="bg-[#ccfbf1]/60 rounded-2xl h-[110px] flex flex-col items-center pt-4 relative overflow-hidden group transition-all hover:bg-[#ccfbf1] hover:scale-[1.02]">
                                        <span className="font-extrabold text-[#113123] text-[20px] relative z-10 transition-colors tracking-tight text-center px-1 leading-tight">{cat.name}</span>
                                        {cat.image_url ? (
                                            <div className="absolute -bottom-2 -left-2 w-[70px] h-[70px] opacity-80 group-hover:scale-110 transition-transform">
                                                <Image src={cat.image_url} alt={cat.name} fill className="object-cover rounded-full shadow-sm" />
                                            </div>
                                        ) : (
                                            <div className="absolute -bottom-4 -left-3 text-[70px] opacity-90 transition-transform group-hover:scale-110 drop-shadow-sm rotate-[15deg]">
                                                {emojis[i % emojis.length]}
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {triggerElement}
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-[420px] flex flex-col p-0 border-l-0 shadow-2xl bg-[#f4f4f4]" dir="rtl">
                
                {/* Header */}
                <SheetHeader className="p-4 bg-white shadow-sm z-20 flex-shrink-0">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col items-start gap-1">
                            <h2 className="text-[26px] font-extrabold text-[#1b3626] leading-none flex items-center gap-2 tracking-tight">
                                העגלה שלי
                            </h2>
                            <span className="text-slate-500 font-bold text-base leading-none pr-1">
                                סה"כ {items.length} מוצרים
                            </span>
                        </div>
                        <div className="flex items-center gap-4 border-r border-slate-100 pr-4 rtl:border-l rtl:border-r-0 rtl:pl-4 rtl:pr-0">
                            <button 
                                className="flex flex-col items-center justify-center text-slate-500 hover:text-red-600 transition-colors"
                                onClick={() => clearCart()}
                            >
                                <Trash2 className="h-5 w-5 mb-1 stroke-[1.5]" />
                                <span className="text-[12px] font-medium">רוקנו</span>
                            </button>
                            <SheetTrigger asChild>
                                <button className="h-10 w-10 bg-white rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm ml-2">
                                    <X className="h-5 w-5 text-slate-700 stroke-[1.5]" />
                                </button>
                            </SheetTrigger>
                        </div>
                    </div>
                </SheetHeader>

                {/* Minimum Purchase Pill */}
                <div className="bg-[#f4f4f4] pt-4 px-4 pb-2 z-10">
                    <div className="bg-[#c2f3eb] rounded-[10px] px-3 py-2 flex items-center justify-center gap-1.5 shadow-sm border border-[#a6ebd9]">
                        {total < 180 ? (
                            <span className="text-[14px] font-medium text-[#115e59] flex items-center gap-1.5">
                                <Heart className="h-4 w-4 text-[#115e59] stroke-[1.5]" />
                                מינימום קנייה 180₪ (לא כולל דמי משלוח). נותרו לכם עוד {(180 - total).toFixed(2)}₪
                            </span>
                        ) : (
                            <span className="text-[14px] font-medium text-[#115e59] flex items-center gap-1.5">
                                <Heart className="h-4 w-4 text-[#115e59] fill-current" />
                                הגעתם למינימום ההזמנה!
                            </span>
                        )}
                    </div>
                </div>

                <ScrollArea className="flex-1 px-4 py-2 bg-[#f4f4f4]">
                    <div className="space-y-4 pb-10">
                        {items.map((item) => {
                            const itemPrice = item.product.is_on_sale && item.product.sale_price ? item.product.sale_price : item.product.price;
                            const itemTotal = itemPrice * item.quantity;
                            const step = item.product.unit_type === "kg" ? 0.5 : 1;
                            
                            return (
                            <div key={item.product.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-start justify-between relative group border border-transparent hover:border-slate-100 transition-colors">
                                
                                {/* Left Side: Price + Quantity Wrapper */}
                                <div className="flex flex-col items-center shrink-0 w-[90px]">
                                    <div className="font-extrabold text-[#1b3626] text-[20px] tracking-tight flex items-center">
                                        <span className="text-xl font-extrabold ml-1">₪</span>{itemTotal.toFixed(2)}
                                    </div>
                                    
                                    <span className="bg-[#1b3626] text-white text-[12px] font-medium px-4 py-1 rounded-full text-center mt-2 mb-3">
                                        {UNIT_LABELS[item.product.unit_type] || "יח'"}
                                    </span>
                                    
                                    <div className="bg-[#f8f8f8] rounded-full flex items-center justify-between h-9 w-full shadow-inner border border-slate-100 overflow-hidden px-1">
                                        <button 
                                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-slate-500 transition-all font-light text-xl"
                                            onClick={() => updateQuantity(item.product.id, item.quantity + step)}
                                        >
                                            +
                                        </button>
                                        <div className="text-[14px] font-bold text-slate-800 text-center select-none w-4">
                                            {item.quantity}
                                        </div>
                                        <button 
                                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-slate-500 transition-all font-light text-xl"
                                            onClick={() => {
                                                if (item.quantity <= step) removeItem(item.product.id);
                                                else updateQuantity(item.product.id, item.quantity - step);
                                            }}
                                        >
                                            -
                                        </button>
                                    </div>
                                </div>

                                {/* Right Side: Title + Image Wrapper */}
                                <div className="flex items-start justify-end w-full pl-4">
                                    <div className="flex flex-col items-end pr-3 pt-1">
                                        <div className="flex items-center gap-1.5">
                                            <h4 className="font-medium text-[18px] text-[#2c3e20] tracking-tight leading-tight">{item.product.name}</h4>
                                            <span className="text-xl leading-none" title="תוצרת ישראל">🇮🇱</span>
                                        </div>
                                    </div>
                                    <div className="relative w-[75px] h-[65px] shrink-0">
                                        {item.product.image_url ? (
                                            <Image
                                                src={item.product.image_url}
                                                alt={item.product.name}
                                                fill
                                                className="object-contain"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl">🌿</div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        )})}
                    </div>
                </ScrollArea>

                {/* Footer Section */}
                <div className="bg-[#B9E178] px-5 py-6 flex flex-col items-center gap-3 relative shrink-0">
                    <Button 
                        asChild 
                        className="w-[95%] h-[68px] rounded-[34px] bg-[#1b3626] hover:bg-black text-white text-[24px] font-medium shadow-lg flex justify-center items-center transition-transform active:scale-[0.98]" 
                    >
                        <Link href="/checkout" onClick={() => setOpen(false)}>
                            למעבר לקופה | <span className="mr-1 text-xl font-bold">₪</span><span className="font-bold">{total.toFixed(2)}</span>
                        </Link>
                    </Button>
                    
                    <p className="text-[#1b3626] text-[15px] font-medium mt-1 text-center w-full px-2 leading-relaxed">
                        *סכום הסל משוערך, הסכום לחיוב יקבע לאחר שקילת המוצרים
                    </p>
                    
                    {/* Dummy Accessibility Icon from styling */}
                    <div className="absolute -left-3 bottom-6 bg-black text-white p-2.5 rounded-full shadow-lg z-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="2"/><path d="m18 8-4-1H9L5 8"/><path d="M15 15v8"/><path d="M9 15v8"/><path d="M12 15V8"/></svg>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
