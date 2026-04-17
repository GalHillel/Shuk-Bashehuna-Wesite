"use client";
import { format, addDays, isSameDay, startOfToday } from "date-fns";
import { he } from "date-fns/locale";

import { supabase } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { CheckCircle2, Loader2, MapPin, Truck, Clock, Store, Heart } from "lucide-react";
import { submitOrder } from "./actions";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const UNIT_LABELS: Record<string, string> = {
    kg: 'ק"ג',
    unit: "יח'",
    pack: "מארז",
};

type CheckoutFormValues = {
    fullName: string;
    phone: string;
    city: string;
    street: string;
    houseNumber: string;
    apartment?: string;
    floor?: string;
    notes?: string;
    deliveryDate: string;
    deliveryTime: string;
    agreeToTerms: boolean;
};

export default function CheckoutPage() {
    const router = useRouter();
    const { items, totalPriceEstimated, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [orderNumber, setOrderNumber] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bit'>('cash');

    const { register, handleSubmit, setValue, watch, formState: { errors }, clearErrors } = useForm<CheckoutFormValues>({
        defaultValues: {
            deliveryTime: "16:00-20:00",
            agreeToTerms: false
        }
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && items.length === 0 && !isSuccess) {
            router.push("/");
        }
    }, [items, isSuccess, router, isMounted]);

    const onSubmit = async (values: CheckoutFormValues) => {
        setIsSubmitting(true);
        try {
            // Try to get logged-in user, but allow guest checkout
            const { data: { user } } = await supabase.auth.getUser();

            const total = totalPriceEstimated();

            // Calculate Delivery Slot
            const [startHour, endHour] = values.deliveryTime.split("-").map(t => t.trim());
            const deliveryStart = new Date(`${values.deliveryDate}T${startHour}:00`);
            const deliveryEnd = new Date(`${values.deliveryDate}T${endHour}:00`);


            // 1. Prepare Data
            const orderPayload = {
                user_id: user?.id || null,
                customer_name: values.fullName,
                customer_phone: values.phone,
                status: "pending",
                total_price_estimated: total,
                delivery_slot_start: deliveryStart.toISOString(),
                delivery_slot_end: deliveryEnd.toISOString(),
                delivery_method: deliveryMethod,
                payment_method: paymentMethod,
                shipping_address: deliveryMethod === 'delivery' ? {
                    city: values.city,
                    street: values.street,
                    house: values.houseNumber,
                    apt: values.apartment,
                    floor: values.floor,
                    fullName: values.fullName,
                    phone: values.phone,
                    notes: values.notes
                } : {
                    fullName: values.fullName,
                    phone: values.phone,
                    notes: values.notes,
                    type: 'pickup'
                }
            };

            const orderItemsPayload = items.map(item => ({
                product_id: item.product.id,
                quantity_ordered: item.quantity,
                price_at_order: item.product.is_on_sale && item.product.sale_price
                    ? item.product.sale_price
                    : item.product.price,
                total_item_price: item.quantity * (item.product.is_on_sale && item.product.sale_price
                    ? item.product.sale_price
                    : item.product.price)
            }));

            // 2. Submit via Server Action (Logic includes Redirect)
            const result = await submitOrder(orderPayload, orderItemsPayload);

            // If we are here, it means NO redirect happened, so check for error
            if (result && !result.success) {
                throw new Error(result.error);
            }

        } catch (error: any) {
            console.error("Order error:", error);
            // Ignore redirect error if it bubbled up somehow, though server action usually handles it
            if (error.message !== "NEXT_REDIRECT") {
                alert(`שגיאה בביצוע ההזמנה: ${error.message || "שגיאה לא ידועה"}`);
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div 
            className="min-h-screen flex flex-col bg-[#f9faf6] relative overflow-hidden" 
            dir="rtl"
            style={{ 
                backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.04) 1.5px, transparent 1.5px)', 
                backgroundSize: '24px 24px' 
            }}
        >
            <main className="flex-1 max-w-6xl mx-auto px-5 pt-8 md:pt-12 pb-8 md:pb-16 relative z-10">

                {/* Editorial Header */}
                <div className="flex flex-col mb-10 gap-2">
                    <div className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[#AADB56]">
                        <div className="w-8 h-[2px] bg-[#AADB56]" />
                        <span className="text-[11px] md:text-xs">שלב סופי</span>
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-[#1b3626] leading-none tracking-tighter">פרטי הזמנה</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

                    {/* Form Section */}
                    <div className="lg:col-span-7 space-y-8">
                        <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-12">

                            {/* Mobile Summary Accordion - Redesigned */}
                            <div className="lg:hidden bg-white rounded-[32px] border border-slate-200/60 mb-8 overflow-hidden shadow-sm">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1" className="border-b-0">
                                        <AccordionTrigger className="px-6 py-5 hover:no-underline flex-row-reverse">
                                            <div className="flex flex-1 justify-between items-center w-full ml-4">
                                                <div className="flex flex-col items-start gap-0.5">
                                                    <span className="font-extrabold text-[#112a1e] text-[15px]">סיכום הזמנה</span>
                                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">לחץ לפירוט</span>
                                                </div>
                                                <div className="text-left">
                                                    <span className="text-[22px] font-black text-[#112a1e] tracking-tighter">
                                                        {isMounted ? `₪${totalPriceEstimated().toFixed(2)}` : "..."}
                                                    </span>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 pb-6 pt-2 border-t border-slate-100">
                                            <div className="space-y-4 pt-4">
                                                {items.map((item) => (
                                                    <div key={item.product.id} className="flex justify-between items-center text-sm">
                                                            <div className="flex gap-3 items-center">
                                                                <div className="relative w-12 h-12 shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                                                                    {item.product.image_url ? (
                                                                        <Image
                                                                            src={item.product.image_url}
                                                                            alt={item.product.name}
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-lg">🌿</div>
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col items-start translate-x-1">
                                                                    <span className="font-bold text-[#112a1e] text-[15px] leading-tight mb-0.5">{item.product.name}</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="bg-[#112a1e]/5 text-[#112a1e] text-[10px] font-black px-1.5 py-0.5 rounded-md border border-slate-100">
                                                                            {item.quantity} {UNIT_LABELS[item.product.unit_type] || "יח'"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        <span className="font-black text-[#112a1e]">
                                                            ₪{(item.quantity * (item.product.is_on_sale && item.product.sale_price
                                                                ? item.product.sale_price
                                                                : item.product.price
                                                            )).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                                <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center text-sm font-bold text-slate-500">
                                                    <span>משלוח</span>
                                                    <span className="text-[#AADB56]">חינם</span>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>

                            {/* Delivery Method Selection */}
                            <div className="bg-white p-2 rounded-[24px] shadow-sm border border-slate-200/60">
                                <Tabs value={deliveryMethod} onValueChange={(v) => setDeliveryMethod(v as 'delivery' | 'pickup')} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 h-14 bg-slate-50/80 p-1 rounded-[20px]">
                                        <TabsTrigger value="delivery" className="h-full rounded-[16px] data-[state=active]:bg-white data-[state=active]:text-[#112a1e] data-[state=active]:shadow-md font-black text-[15px] transition-all">
                                            <Truck className="w-5 h-5 ml-2" />
                                            משלוח עד הבית
                                        </TabsTrigger>
                                        <TabsTrigger value="pickup" className="h-full rounded-[16px] data-[state=active]:bg-white data-[state=active]:text-[#112a1e] data-[state=active]:shadow-md font-black text-[15px] transition-all">
                                            <Store className="w-5 h-5 ml-2" />
                                            איסוף עצמי
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            {/* Main Contact Section */}
                            <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-200/60 space-y-6">
                                <h3 className="text-lg font-black text-[#112a1e] mb-2 border-r-4 border-[#AADB56] pr-4">פרטים אישיים</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="fullName" className="text-slate-600 font-bold text-xs uppercase tracking-wider pr-1">שם מלא</Label>
                                        <Input
                                            id="fullName"
                                            placeholder="ישראל ישראלי"
                                            className="bg-slate-50/50 border-slate-200 h-12 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#AADB56]/20 focus:border-[#AADB56] transition-all font-bold placeholder:text-slate-300"
                                            {...register("fullName", { required: true })}
                                        />
                                        {errors.fullName && <p className="text-red-500 text-xs font-bold mt-1">שם מלא חובה</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="phone" className="text-slate-600 font-bold text-xs uppercase tracking-wider pr-1">מספר טלפון</Label>
                                        <Input
                                            id="phone"
                                            placeholder="050-0000000"
                                            className="bg-slate-50/50 border-slate-200 h-12 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#AADB56]/20 focus:border-[#AADB56] transition-all font-bold placeholder:text-slate-300"
                                            {...register("phone", { required: true })}
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs font-bold mt-1">טלפון חובה</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Conditional Address / Pickup Section */}
                            <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-200/60">
                                {deliveryMethod === 'delivery' ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 mb-2 border-r-4 border-[#AADB56] pr-4">
                                            <h3 className="text-lg font-black text-[#112a1e]">כתובת למשלוח</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="grid gap-2">
                                                <Label htmlFor="city" className="text-slate-600 font-bold text-xs uppercase tracking-wider pr-1">עיר</Label>
                                                <Input
                                                    id="city"
                                                    placeholder="נתניה"
                                                    className="bg-slate-50/50 border-slate-200 h-12 rounded-2xl"
                                                    {...register("city", { required: true })}
                                                />
                                                {errors.city && <p className="text-red-500 text-xs font-bold mt-1">עיר חובה</p>}
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="street" className="text-slate-600 font-bold text-xs uppercase tracking-wider pr-1">רחוב</Label>
                                                <Input
                                                    id="street"
                                                    placeholder="הרצל"
                                                    className="bg-slate-50/50 border-slate-200 h-12 rounded-2xl"
                                                    {...register("street", { required: true })}
                                                />
                                                {errors.street && <p className="text-red-500 text-xs font-bold mt-1">רחוב חובה</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 md:gap-6">
                                            <div className="grid gap-2">
                                                <Label htmlFor="houseNumber" className="text-slate-600 font-bold text-xs uppercase tracking-wider pr-1">בית</Label>
                                                <Input id="houseNumber" {...register("houseNumber", { required: true })} className="bg-slate-50/50 border-slate-200 h-12 rounded-2xl" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="floor" className="text-slate-600 font-bold text-xs uppercase tracking-wider pr-1">קומה</Label>
                                                <Input id="floor" {...register("floor")} className="bg-slate-50/50 border-slate-200 h-12 rounded-2xl" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="apartment" className="text-slate-600 font-bold text-xs uppercase tracking-wider pr-1">דירה</Label>
                                                <Input id="apartment" {...register("apartment")} className="bg-slate-50/50 border-slate-200 h-12 rounded-2xl" />
                                            </div>
                                        </div>

                                        <div className="grid gap-2 pt-2">
                                            <Label htmlFor="notes" className="text-slate-600 font-bold text-xs uppercase tracking-wider pr-1">הערות למשלוח</Label>
                                            <Input
                                                id="notes"
                                                placeholder="..."
                                                className="bg-slate-50/50 border-slate-200 h-12 rounded-2xl"
                                                {...register("notes")}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-2 text-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-[#AADB56]/10 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm ring-4 ring-slate-50">
                                            <Store className="w-8 h-8 text-[#AADB56]" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-[#112a1e] text-xl mb-1">איסוף עצמי בתיאום מראש</h3>
                                            <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-[280px] mx-auto">
                                                ההזמנה תמתין לך בחנות עין גנים 96, פתח תקווה. 
                                                <br />
                                                נעדכן אותך כשהיא מוכנה!
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 rounded-[20px] p-3 inline-block border border-slate-100">
                                            <p className="text-[11px] font-black uppercase text-[#112a1e] tracking-widest opacity-60">תשלום בקופה בעת האיסוף</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Timing Section */}
                            <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-200/60 space-y-6">
                                <div className="flex items-center gap-3 mb-2 border-r-4 border-[#AADB56] pr-4">
                                    <h3 className="text-lg font-black text-[#112a1e]">מועד ה{deliveryMethod === 'delivery' ? 'משלוח' : 'איסוף'}</h3>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="grid gap-4">
                                        <Label className="text-slate-600 font-bold text-xs uppercase tracking-wider pr-1">בחר תאריך רצוי</Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {Array.from({ length: 7 }).map((_, i) => {
                                                const date = addDays(startOfToday(), i);
                                                const isSelected = watch("deliveryDate") === format(date, "yyyy-MM-dd");
                                                return (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => setValue("deliveryDate", format(date, "yyyy-MM-dd"))}
                                                        className={cn(
                                                            "flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all group/date",
                                                            isSelected 
                                                                ? "border-[#AADB56] bg-[#AADB56] text-white shadow-lg shadow-lime-200" 
                                                                : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white text-[#112a1e]"
                                                        )}
                                                    >
                                                        <span className={cn(
                                                            "text-[10px] font-black uppercase tracking-widest mb-1",
                                                            isSelected ? "text-white/80" : "text-slate-400 group-hover/date:text-slate-500"
                                                        )}>
                                                            {format(date, "EEEE", { locale: he })}
                                                        </span>
                                                        <span className="text-xl font-black tracking-tighter leading-none">
                                                            {format(date, "dd/MM")}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <input type="hidden" {...register("deliveryDate", { required: true })} />
                                        {errors.deliveryDate && <p className="text-red-500 text-xs font-bold mt-1 text-center">אנא בחר תאריך</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="deliveryTime" className="text-slate-600 font-bold text-xs uppercase tracking-wider pr-1">חלון זמן</Label>
                                        <Select onValueChange={(value) => setValue("deliveryTime", value)} defaultValue="16:00-20:00">
                                            <SelectTrigger className="bg-slate-50/50 border-slate-200 h-12 rounded-2xl font-bold">
                                                <SelectValue placeholder="בחר חלון זמן" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-slate-200 shadow-xl overflow-hidden">
                                                <SelectItem value="08:00-12:00">08:00 - 12:00</SelectItem>
                                                <SelectItem value="12:00-16:00">12:00 - 16:00</SelectItem>
                                                <SelectItem value="16:00-20:00">16:00 - 20:00</SelectItem>
                                                <SelectItem value="20:00-22:00">20:00 - 22:00</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <input type="hidden" {...register("deliveryTime", { required: true })} />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Section */}
                            <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-200/60 space-y-6">
                                <div className="flex items-center gap-3 mb-2 border-r-4 border-[#AADB56] pr-4">
                                    <h3 className="text-lg font-black text-[#112a1e]">אמצעי תשלום</h3>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div
                                        onClick={() => setPaymentMethod('cash')}
                                        className={cn(
                                            "cursor-pointer p-5 rounded-3xl border-2 transition-all flex items-center gap-4 relative overflow-hidden group/opt",
                                            paymentMethod === 'cash' ? "border-[#AADB56] bg-[#AADB56]/5" : "border-slate-100 hover:bg-slate-50"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                            paymentMethod === 'cash' ? "border-[#AADB56] bg-[#AADB56]" : "border-slate-300"
                                        )}>
                                            {paymentMethod === 'cash' && <div className="w-2 h-2 rounded-full bg-white" />}
                                        </div>
                                        <div>
                                            <p className="font-black text-[#112a1e]">
                                                {deliveryMethod === 'delivery' ? 'מזומן לשליח' : 'תשלום בקופה'}
                                            </p>
                                            <p className="text-[13px] text-slate-500 font-bold">
                                                {deliveryMethod === 'delivery' ? 'תשלום במועד קבלת ההזמנה' : 'תשלום בעת איסוף ההזמנה'}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setPaymentMethod('bit')}
                                        className={cn(
                                            "cursor-pointer p-5 rounded-3xl border-2 transition-all relative overflow-hidden",
                                            paymentMethod === 'bit' ? "border-[#0083DA] bg-blue-50/50" : "border-slate-100 hover:bg-slate-50"
                                        )}
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={cn(
                                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                paymentMethod === 'bit' ? "border-[#0083DA] bg-[#0083DA]" : "border-slate-300"
                                            )}>
                                                {paymentMethod === 'bit' && <div className="w-2 h-2 rounded-full bg-white" />}
                                            </div>
                                            <div>
                                                <p className="font-black text-[#112a1e]">Bit (ביט) - העברה מהירה</p>
                                                <p className="text-[13px] text-slate-500 font-bold">העברה נוחה ומאובטחת</p>
                                            </div>
                                        </div>

                                        {paymentMethod === 'bit' && (
                                            <div className="mr-10 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                                <div className="bg-white p-4 rounded-2xl border border-blue-200/50 shadow-sm">
                                                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1.5">מספר העסק לביט</p>
                                                    <p className="font-black text-[22px] text-[#0083DA] tracking-widest leading-none pr-0.5">054-663-7558</p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        const total = totalPriceEstimated().toFixed(2);
                                                        navigator.clipboard.writeText(total);
                                                        import("sonner").then(({ toast }) => toast.success("הסכום הועתק! עובר לביט..."));
                                                        setTimeout(() => {
                                                            window.location.href = "https://bitpay.co.il/app/me/0546637558";
                                                        }, 1200);
                                                    }}
                                                    className="w-full bg-[#0083DA] hover:bg-[#0070bb] text-white font-black h-14 rounded-2xl shadow-lg transition-transform active:scale-95"
                                                >
                                                    העתק סכום (₪{totalPriceEstimated().toFixed(2)}) ופתח ביט
                                                </Button>
                                                <p className="text-xs text-slate-500 text-center font-bold px-4 leading-normal">
                                                    * לאחר ביצוע ההעברה בביט, יש לחזור לכאן וללחוץ על "שלח הזמנה" למטה
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Terms section */}
                            <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-[32px] border border-slate-200/60 group transition-all hover:bg-[#AADB56]/5">
                                <Checkbox
                                    id="terms"
                                    checked={watch("agreeToTerms")}
                                    className="data-[state=checked]:bg-[#112a1e] data-[state=checked]:border-[#112a1e] w-6 h-6 rounded-lg transition-all"
                                    onCheckedChange={(checked) => setValue("agreeToTerms", checked as boolean, { shouldValidate: true })}
                                />
                                <div className="grid gap-2 leading-tight">
                                    <label
                                        htmlFor="terms"
                                        className="text-[14px] font-bold text-[#112a1e] leading-snug cursor-pointer select-none"
                                    >
                                        אני מאשר/ת את <Link href="/terms" target="_blank" className="text-[#AADB56] underline underline-offset-4 hover:text-[#1b3626] transition-colors">תקנון האתר</Link> ואת <Link href="/privacy" target="_blank" className="text-[#AADB56] underline underline-offset-4 hover:text-[#1b3626] transition-colors">מדיניות הפרטיות</Link>.
                                    </label>
                                    <p className="text-[12px] text-slate-500 font-bold leading-relaxed">
                                        ידוע לי כי לא ניתן להחזיר פירות וירקות ("טובין פסידים") לאחר קבלת המשלוח. סכום החיוב המשוער ייקבע סופית לאחר שקילה.
                                    </p>
                                    {errors.agreeToTerms && (
                                        <p className="text-red-500 text-xs font-black mt-1.5 animate-pulse">חובה לאשר כדי להשלים רכישה</p>
                                    )}
                                </div>
                                <input type="hidden" {...register("agreeToTerms", { required: true })} />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-20 rounded-[32px] bg-[#AADB56] hover:bg-[#112a1e] text-[#112a1e] hover:text-white text-xl font-black shadow-xl shadow-[#AADB56]/20 transition-all duration-500 hover:scale-[1.02] active:scale-95 border-b-4 border-black/10 group overflow-hidden"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="ml-3 h-6 w-6 animate-spin" />
                                        שולח הזמנה...
                                    </>
                                ) : (
                                    <span className="flex items-center gap-3">
                                        שלח הזמנה וסיים רכישה
                                        <CheckCircle2 className="w-6 h-6 transition-transform group-hover:scale-125" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Summary Sticky Section */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-28 space-y-8 bg-white p-8 md:p-10 rounded-[40px] shadow-xl border border-slate-200/50 hidden lg:block overflow-hidden group/summ">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#AADB56]/5 rounded-bl-[120px] -z-1" />

                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1.5 h-1.5 bg-[#AADB56] rounded-full animate-pulse" />
                                <h2 className="text-[22px] font-black text-[#1b3626] tracking-tighter">סיכום הזמנה</h2>
                            </div>

                            <div className="space-y-5 max-h-[320px] overflow-y-auto pr-2 scrollbar-hide py-2">
                                {items.map((item) => (
                                    <div key={item.product.id} className="flex justify-between items-center group/item transition-all">
                                        <div className="flex gap-4 items-center">
                                            <div className="relative w-16 h-16 shrink-0 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 group-hover/item:border-[#AADB56]/30 transition-all shadow-sm">
                                                {item.product.image_url ? (
                                                    <Image
                                                        src={item.product.image_url}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover transition-transform group-hover/item:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xl">🌿</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="font-bold text-[17px] text-[#112a1e] transition-colors leading-tight mb-1">{item.product.name}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-[#112a1e]/5 text-[#112a1e] text-[11px] font-black px-2 py-0.5 rounded-lg border border-slate-100">
                                                        {item.quantity} {UNIT_LABELS[item.product.unit_type] || "יח'"}
                                                    </span>
                                                    <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                                                        במחיר ₪{(item.product.is_on_sale && item.product.sale_price
                                                            ? item.product.sale_price
                                                            : item.product.price
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <span className="font-black text-[18px] text-[#112a1e] tracking-tighter shrink-0">
                                                ₪{(item.quantity * (item.product.is_on_sale && item.product.sale_price
                                                    ? item.product.sale_price
                                                    : item.product.price
                                                )).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-slate-100 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[14px] font-bold text-slate-500 uppercase tracking-widest">סה״כ פריטים</span>
                                    <span className="font-black text-[#112a1e] text-lg">{isMounted ? `₪${totalPriceEstimated().toFixed(2)}` : "..."}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[14px] font-bold text-slate-500 uppercase tracking-widest">משלוח</span>
                                    <div className="bg-[#AADB56]/10 px-3 py-1 rounded-full border border-[#AADB56]/20">
                                        <span className="text-[#AADB56] font-black text-xs uppercase tracking-widest">משלוח חינם</span>
                                    </div>
                                </div>

                                <div className="pt-6 mt-6 border-t border-slate-100">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[16px] font-black text-[#112a1e] uppercase tracking-widest leading-none pb-1.5 opacity-60">סכום משוער</span>
                                        <div className="flex items-baseline text-[#112a1e]">
                                            <span className="text-xl ml-1 font-black leading-none opacity-60">₪</span>
                                            <span className="text-4xl md:text-5xl font-black tracking-tighter leading-none pr-0.5">
                                                {isMounted ? totalPriceEstimated().toFixed(2) : "..."}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-[12px] text-slate-500 font-bold leading-normal text-right">
                                        * המחיר הסופי עשוי להשתנות בהתאם למשקל המדויק של המוצרים השקילים (לפי גרם). התשלום יתבצע מול ה{deliveryMethod === 'delivery' ? 'שליח' : 'קופאי'} בעת האספקה.
                                    </p>
                                </div>
                            </div>

                            {/* Trust Bar */}
                            <div className="pt-8 grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-3xl flex flex-col items-center justify-center gap-2 text-center group/trust transition-all hover:bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover/trust:bg-[#AADB56]/10 transition-all">
                                        <Truck className="w-5 h-5 text-slate-500 group-hover/trust:text-[#AADB56]" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-[#112a1e] tracking-widest">משלוח מהיר</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-3xl flex flex-col items-center justify-center gap-2 text-center group/trust transition-all hover:bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover/trust:bg-[#AADB56]/10 transition-all">
                                        <Heart className="w-5 h-5 text-slate-500 group-hover/trust:text-[#AADB56]" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-[#112a1e] tracking-widest">תוצרת טרייה</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
