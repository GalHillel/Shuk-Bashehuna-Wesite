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
import { ShoppingCart, Trash2, Plus, Minus, X, Heart, ChevronLeft } from "lucide-react";
import { useCart } from "@/store/useCart";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

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
    const [showClearConfirm, setShowClearConfirm] = useState(false);
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

    const handleClearCart = () => {
        clearCart();
        setShowClearConfirm(false);
    };

    if (items.length === 0) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {triggerElement}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[420px] p-0 border-none bg-white rounded-[40px] pt-4 pb-10 shadow-2xl overflow-hidden" dir="rtl">
                    <DialogTitle className="sr-only">העגלה ריקה</DialogTitle>
                    <div className="flex flex-col items-center pt-14 pb-4 text-center px-8 relative w-full">

                        {/* Premium Empty State Visual */}
                        <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 bg-[#AADB56]/20 rounded-full animate-ping duration-[3000ms]" />
                            <div className="relative bg-[#AADB56] rounded-full h-full w-full flex items-center justify-center shadow-lg border-4 border-white">
                                <ShoppingCart className="w-10 h-10 text-[#112a1e]" strokeWidth={2.5} />
                            </div>
                        </div>

                        <h2 className="text-[36px] font-black text-[#1b3626] mb-2 tracking-tighter leading-none">העגלה ריקה</h2>
                        <p className="text-slate-500 font-bold text-[17px] mb-10 max-w-[85%] leading-tight">
                            נראה שעדיין לא הוספת מוצרים לסל. בוא נתחיל למלא אותו בכל טוב!
                        </p>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            {promoCategories.map((cat, i) => {
                                return (
                                    <Link 
                                        key={cat.id} 
                                        href={`/category/${cat.id}`} 
                                        onClick={() => setOpen(false)} 
                                        className="bg-[#f8faf7] border border-slate-100 rounded-3xl h-[120px] flex flex-col items-center justify-center gap-2 p-3 group transition-all hover:bg-[#AADB56]/10 hover:border-[#AADB56]/30 active:scale-95 shadow-sm"
                                    >
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm ring-2 ring-transparent group-hover:ring-[#AADB56] transition-all">
                                            {cat.image_url ? (
                                                <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xl">🌿</div>
                                            )}
                                        </div>
                                        <span className="font-black text-[#113123] text-[15px] leading-tight text-center">{cat.name}</span>
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
            <SheetContent side="left" className="w-full sm:max-w-[440px] flex flex-col p-0 border-r-0 shadow-2xl bg-[#f7f8f7] z-[150]" dir="rtl">

                {/* Header - Editorial Style */}
                <SheetHeader className="p-6 bg-white border-b border-slate-100 z-20 flex-shrink-0">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col items-start">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-[2px] bg-[#AADB56]" />
                                <h2 className="text-[28px] font-black text-[#1b3626] leading-none tracking-tighter">
                                    העגלה שלי
                                </h2>
                            </div>
                            <span className="text-slate-400 font-bold text-[14px] uppercase tracking-wider pr-1">
                                {items.length} פריטים נבחרו עבורך
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                className="h-11 px-4 flex items-center gap-2 bg-slate-50 text-[#1b3626] hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all border border-slate-100 group"
                                onClick={() => setShowClearConfirm(true)}
                            >
                                <Trash2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                                <span className="text-[14px] font-black whitespace-nowrap">רוקן סל</span>
                            </button>
                            <SheetTrigger asChild>
                                <button className="h-11 w-11 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-white transition-all border border-slate-100 shadow-sm">
                                    <X className="h-5 w-5 text-slate-800" strokeWidth={3} />
                                </button>
                            </SheetTrigger>
                        </div>
                    </div>
                </SheetHeader>

                {/* Progress Bar / Minimum Purchase */}
                <div className="bg-white/50 backdrop-blur-sm px-6 py-4 z-10">
                    <div className={cn(
                        "rounded-[20px] p-4 flex flex-col gap-3 transition-all border shadow-sm",
                        total < 180 ? "bg-white border-yellow-200" : "bg-[#AADB56]/10 border-[#AADB56]/30 shadow-[#AADB56]/10"
                    )}>
                         <div className="flex items-center justify-between text-[15px] font-black text-[#112a1e]">
                             <span className="flex items-center gap-2">
                                <Heart className={cn("h-5 w-5", total >= 180 ? "fill-[#AADB56] text-[#AADB56]" : "text-yellow-500")} />
                                {total < 180 ? `חסר לכם ₪${(180 - total).toFixed(2)} למשלוח` : "מינימום קנייה הושלם!"}
                             </span>
                             <span>{Math.min(100, (total / 180) * 100).toFixed(0)}%</span>
                         </div>
                         <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                             <div 
                                className={cn(
                                    "h-full transition-all duration-700 ease-out rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]",
                                    total < 180 ? "bg-yellow-400" : "bg-[#AADB56]"
                                )}
                                style={{ width: `${Math.min(100, (total / 180) * 100)}%` }}
                             />
                         </div>
                    </div>
                </div>

                <ScrollArea className="flex-1 px-5 py-2">
                    <div className="space-y-4 pb-12 pt-2">
                        {items.map((item) => {
                            const itemPrice = item.product.is_on_sale && item.product.sale_price ? item.product.sale_price : item.product.price;
                            const itemTotal = itemPrice * item.quantity;
                            const step = item.product.unit_type === "kg" ? 0.5 : 1;

                            return (
                                <div key={item.product.id} className="bg-white rounded-[28px] p-4 shadow-sm flex items-center justify-between relative group border border-transparent hover:border-[#AADB56]/20 transition-all hover:shadow-md">
                                    
                                    {/* Product Details Section - Right Align (RTL) */}
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="relative w-20 h-20 shrink-0 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center p-2 group-hover:bg-white transition-colors">
                                            {item.product.image_url ? (
                                                <Image
                                                    src={item.product.image_url}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-contain transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl">🌿</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-start text-right">
                                            <h4 className="font-black text-[18px] text-[#112a1e] leading-tight mb-0.5">{item.product.name}</h4>
                                            <p className="text-slate-400 font-bold text-[13px] mb-2 uppercase">
                                                ₪{itemPrice.toFixed(2)} / {UNIT_LABELS[item.product.unit_type] || "יח'"}
                                            </p>
                                            
                                            {/* Tactile Quantity Pill */}
                                            <div className="flex items-center bg-[#f7f8f7] rounded-full p-1 border border-slate-100 shadow-inner overflow-hidden h-9">
                                                <button
                                                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-[#112a1e] shadow-sm hover:bg-[#AADB56] transition-all"
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + step)}
                                                >
                                                    <Plus className="w-4 h-4" strokeWidth={3} />
                                                </button>
                                                <span className="px-4 text-[15px] font-black text-[#112a1e] min-w-[36px] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-[#112a1e] shadow-sm hover:bg-slate-100 transition-all"
                                                    onClick={() => {
                                                        if (item.quantity <= step) removeItem(item.product.id);
                                                        else updateQuantity(item.product.id, item.quantity - step);
                                                    }}
                                                >
                                                    <Minus className="w-4 h-4" strokeWidth={3} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Price Section */}
                                    <div className="flex flex-col items-end pl-2">
                                        <div className="text-[22px] font-black text-[#112a1e] tracking-tighter">
                                            <span className="text-sm ml-1 opacity-70">₪</span>{itemTotal.toFixed(2)}
                                        </div>
                                        <button 
                                            onClick={() => removeItem(item.product.id)}
                                            className="mt-2 text-slate-300 hover:text-red-400 transition-colors p-1"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>

                {/* Footer Section - Immersive Deep Forest Background */}
                <div className="bg-[#112a1e] px-6 pt-8 pb-10 flex flex-col items-center gap-6 relative shrink-0 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] rounded-t-[40px] mt-auto">
                    
                    {/* Summary Info */}
                    <div className="flex items-center justify-between w-full px-2 text-white/90">
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-[14px] font-bold opacity-70 uppercase tracking-widest mb-1.5 pr-0.5">סה"כ לתשלום</span>
                            <div className="text-[36px] font-black tracking-tighter flex items-baseline">
                                <span className="text-xl ml-1 text-[#AADB56]">₪</span>
                                <span>{total.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <span className="text-[13px] font-bold text-white/40 mb-1 leading-none">*מחיר משוער</span>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/10 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-[#AADB56] rounded-full animate-pulse" />
                                <span className="text-xs font-black uppercase tracking-wider">משלוח מהיום להיום</span>
                            </div>
                        </div>
                    </div>

                    <Button
                        asChild
                        className="w-full h-[76px] rounded-[28px] bg-[#AADB56] hover:bg-white text-[#112a1e] text-[24px] font-black shadow-[0_20px_50px_rgba(170,219,86,0.3)] flex justify-center items-center transition-all duration-300 active:scale-[0.98] border-b-4 border-black/10 group"
                    >
                        <Link href="/checkout" onClick={() => setOpen(false)}>
                            למעבר לקופה
                            <ChevronLeft className="w-7 h-7 transition-transform group-hover:-translate-x-2" strokeWidth={3} />
                        </Link>
                    </Button>

                    <p className="text-white/40 text-[13px] font-bold text-center w-full px-4 leading-relaxed">
                        הסכום הסופי יקבע לאחר השקילה והכנת המשלוח
                    </p>
                </div>

                {/* Confirmation Modal for Clearing Cart */}
                <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
                    <DialogContent className="sm:max-w-[420px] p-0 border-none bg-white rounded-[40px] shadow-2xl overflow-hidden z-[1000]" dir="rtl">
                        <DialogTitle className="sr-only">האם לרוקן את הסל?</DialogTitle>
                        <div className="p-10 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-md">
                                <Trash2 className="w-10 h-10 text-red-500" strokeWidth={2.5} />
                            </div>
                            <h2 className="text-[32px] font-black text-[#1b3626] mb-3 tracking-tighter leading-none">לרוקן את הסל?</h2>
                            <p className="text-slate-500 font-bold text-[17px] mb-10 leading-snug">
                                אולי כדאי לשמור את המוצרים? <br/> מדובר במחיקה של כל ההתקדמות שלך.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <Button 
                                    onClick={() => setShowClearConfirm(false)}
                                    className="h-16 rounded-[24px] bg-slate-50 hover:bg-slate-100 text-slate-700 font-black text-lg border border-slate-200"
                                >
                                    אופס, בטל
                                </Button>
                                <Button 
                                    onClick={handleClearCart}
                                    className="h-16 rounded-[24px] bg-[#112a1e] hover:bg-red-600 text-white font-black text-lg shadow-lg transition-colors border-b-4 border-black/20"
                                >
                                    כן, רוקן סל
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </SheetContent>
        </Sheet>
    );
}
