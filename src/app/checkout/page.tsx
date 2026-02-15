"use client";

import { supabase } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/useCart";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/Footer";
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
import { CheckCircle2, Loader2, MapPin, Truck, Clock } from "lucide-react";
import { submitOrder } from "./actions";

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
};

export default function CheckoutPage() {
    const router = useRouter();
    const { items, totalPriceEstimated, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<CheckoutFormValues>({
        defaultValues: {
            deliveryTime: "16:00-20:00"
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
                shipping_address: {
                    city: values.city,
                    street: values.street,
                    house: values.houseNumber,
                    apt: values.apartment,
                    floor: values.floor,
                    fullName: values.fullName,
                    phone: values.phone,
                    notes: values.notes
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

            // 2. Submit via Server Action (Bypassing RLS)
            const result = await submitOrder(orderPayload, orderItemsPayload);

            if (!result.success) {
                throw new Error(result.error);
            }

            // 3. Success
            setOrderId(result.orderId || null);
            setIsSuccess(true);
            clearCart();
        } catch (error: any) {
            console.error("Order error:", error);
            alert(`שגיאה בביצוע ההזמנה: ${error.message || "שגיאה לא ידועה"}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <SiteHeader />
                <main className="flex-1 max-w-2xl mx-auto px-4 py-20 text-center">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2 text-slate-900">ההזמנה בוצעה בהצלחה!</h1>
                        <p className="text-slate-600 mb-6 text-lg">תודה שבחרת בנו. ההזמנה שלך (# {orderId?.slice(0, 8)}) התקבלה ומעובדת ברגעים אלו.</p>
                        <Button
                            onClick={() => router.push("/")}
                            className="w-full max-w-xs bg-slate-900 hover:bg-slate-800 text-white py-6 text-lg rounded-xl"
                        >
                            חזרה לדף הבית
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <SiteHeader />
            <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-slate-100 rounded-lg">
                        <Truck className="w-6 h-6 text-slate-900" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">פרטי הזמנה ומשלוח</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Form Section */}
                    <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Summary for Mobile */}
                        {/* Summary for Mobile */}
                        <div className="lg:hidden bg-slate-50 rounded-2xl border border-dashed border-slate-200 mb-8 overflow-hidden">
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1" className="border-b-0">
                                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                        <div className="flex flex-1 justify-between items-center text-xl w-full">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="font-bold text-slate-900 text-base">סיכום ביניים</span>
                                                <span className="text-slate-500 text-xs font-normal">לחץ לפירוט</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xl">
                                                <span className="font-black text-slate-900">
                                                    {isMounted ? `₪${totalPriceEstimated().toFixed(2)}` : "..."}
                                                </span>
                                                <span className="text-slate-500 text-sm">סה״כ לתשלום (משוער)</span>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-6 bg-white/50">
                                        <div className="space-y-4 pt-4 border-t border-slate-100">
                                            {items.map((item) => (
                                                <div key={item.product.id} className="flex justify-between items-start text-sm">
                                                    <div className="flex gap-3">
                                                        <div className="font-bold text-slate-500 min-w-[24px]">
                                                            {item.quantity}x
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-900">{item.product.name}</p>
                                                            <p className="text-xs text-slate-400">
                                                                ₪{(item.product.is_on_sale && item.product.sale_price
                                                                    ? item.product.sale_price
                                                                    : item.product.price
                                                                ).toFixed(2)} ליחידה
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="font-bold text-slate-900">
                                                        ₪{(item.quantity * (item.product.is_on_sale && item.product.sale_price
                                                            ? item.product.sale_price
                                                            : item.product.price
                                                        )).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                            <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center text-sm font-medium text-slate-500">
                                                <span>משלוח</span>
                                                <span className="text-green-600">חינם</span>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        <div className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="fullName" className="text-slate-700 font-bold">שם מלא</Label>
                                <Input
                                    id="fullName"
                                    placeholder="ישראל ישראלי"
                                    className="bg-slate-50 border-slate-200 h-12 rounded-xl focus:ring-slate-900"
                                    {...register("fullName", { required: true })}
                                />
                                {errors.fullName && <p className="text-red-500 text-sm font-medium">שם מלא חובה</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone" className="text-slate-700 font-bold">מספר טלפון</Label>
                                <Input
                                    id="phone"
                                    placeholder="050-0000000"
                                    className="bg-slate-50 border-slate-200 h-12 rounded-xl"
                                    {...register("phone", { required: true })}
                                />
                                {errors.phone && <p className="text-red-500 text-sm font-medium">טלפון חובה</p>}
                            </div>

                            <div className="flex items-center gap-3 mt-8 mb-4">
                                <MapPin className="w-5 h-5 text-slate-400" />
                                <h3 className="text-lg font-bold text-slate-900">כתובת למשלוח</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="city" className="text-slate-700 text-sm font-bold">עיר</Label>
                                    <Input
                                        id="city"
                                        placeholder="נתניה"
                                        className="bg-slate-50 border-slate-200 h-12 rounded-xl"
                                        {...register("city", { required: true })}
                                    />
                                    {errors.city && <p className="text-red-500 text-sm font-medium">עיר חובה</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="street" className="text-slate-700 text-sm font-bold">רחוב</Label>
                                    <Input
                                        id="street"
                                        placeholder="הרצל"
                                        className="bg-slate-50 border-slate-200 h-12 rounded-xl"
                                        {...register("street", { required: true })}
                                    />
                                    {errors.street && <p className="text-red-500 text-sm font-medium">רחוב חובה</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="houseNumber" className="text-slate-700 text-sm font-bold">בית</Label>
                                    <Input id="houseNumber" {...register("houseNumber", { required: true })} className="bg-slate-50 h-12 rounded-xl" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="floor" className="text-slate-700 text-sm font-bold">קומה</Label>
                                    <Input id="floor" {...register("floor")} className="bg-slate-50 h-12 rounded-xl" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="apartment" className="text-slate-700 text-sm font-bold">דירה</Label>
                                    <Input id="apartment" {...register("apartment")} className="bg-slate-50 h-12 rounded-xl" />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="notes" className="text-slate-700 text-sm font-bold">הערות למשלוח (קוד לבניין, ליד השער וכו׳)</Label>
                                <Input
                                    id="notes"
                                    placeholder="..."
                                    className="bg-slate-50 border-slate-200 h-12 rounded-xl"
                                    {...register("notes")}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-8 mb-4">
                            <Clock className="w-5 h-5 text-slate-400" />
                            <h3 className="text-lg font-bold text-slate-900">זמן משלוח מועדף</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="deliveryDate" className="text-slate-700 font-bold">תאריך משלוח</Label>
                                <Input
                                    id="deliveryDate"
                                    type="date"
                                    min={new Date().toISOString().split("T")[0]}
                                    className="bg-slate-50 border-slate-200 h-12 rounded-xl"
                                    {...register("deliveryDate", { required: true })}
                                />
                                {errors.deliveryDate && <p className="text-red-500 text-sm font-medium">תאריך חובה</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="deliveryTime" className="text-slate-700 font-bold">חלון זמן</Label>
                                <Select onValueChange={(value) => setValue("deliveryTime", value)} defaultValue="16:00-20:00">
                                    <SelectTrigger className="bg-slate-50 border-slate-200 h-12 rounded-xl">
                                        <SelectValue placeholder="בחר חלון זמן" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="08:00-12:00">08:00 - 12:00</SelectItem>
                                        <SelectItem value="12:00-16:00">12:00 - 16:00</SelectItem>
                                        <SelectItem value="16:00-20:00">16:00 - 20:00</SelectItem>
                                        <SelectItem value="20:00-22:00">20:00 - 22:00</SelectItem>
                                    </SelectContent>
                                </Select>
                                <input type="hidden" {...register("deliveryTime", { required: true })} />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-8 text-xl font-bold rounded-2xl shadow-lg shadow-slate-200 transition-all transform hover:scale-[1.01] mt-8"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="ml-2 h-6 w-6 animate-spin" />
                                    שולח הזמנה...
                                </>
                            ) : (
                                "שלח הזמנה (תשלום מול השליח)"
                            )}
                        </Button>
                    </form>

                    {/* Summary Section */}
                    <div className="hidden lg:block space-y-8 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                        <h2 className="text-xl font-black text-slate-900 border-b border-slate-200 pb-4">סיכום הזמנה</h2>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {items.map((item) => (
                                <div key={item.product.id} className="flex justify-between items-center group">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white rounded-lg border border-slate-100 flex items-center justify-center font-bold text-sm">
                                            {item.quantity}x
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{item.product.name}</p>
                                            <p className="text-sm text-slate-500">
                                                ₪{(item.product.is_on_sale && item.product.sale_price
                                                    ? item.product.sale_price
                                                    : item.product.price
                                                ).toFixed(2)} ליחידה
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-slate-900">
                                        ₪{(item.quantity * (item.product.is_on_sale && item.product.sale_price
                                            ? item.product.sale_price
                                            : item.product.price
                                        )).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <Separator className="bg-slate-200" />

                        <div className="space-y-3">
                            <div className="flex justify-between text-slate-600">
                                <span>סה״כ מוצרים</span>
                                <span className="font-mono">{isMounted ? `₪${totalPriceEstimated().toFixed(2)}` : "..."}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>משלוח</span>
                                <span className="text-green-600 font-bold">חינם</span>
                            </div>
                            <Separator className="bg-slate-200" />
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-xl font-black text-slate-900">סה״כ לתשלום</span>
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">
                                    {isMounted ? `₪${totalPriceEstimated().toFixed(2)}` : "..."}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-4 leading-relaxed">* המחיר הסופי עשוי להשתנות בהתאם למשקל המדויק של המוצרים השקילים (לפי גרם). התשלום יתבצע מול השליח בעת האספקה.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
