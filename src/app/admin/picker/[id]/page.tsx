"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Check, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { Order, OrderItem, Product } from "@/types/supabase";

import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/AdminHeader";

type CheckableItem = OrderItem & {
    product: Product;
    checked: boolean;
    missing: boolean;
};

export default function PickingPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const [items, setItems] = useState<CheckableItem[]>([]);
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrder() {
            const supabase = createClient();
            const { data: orderData } = await supabase
                .from("orders")
                .select("*")
                .eq("id", id)
                .single();

            if (orderData) setOrder(orderData);

            const { data: itemsData } = await supabase
                .from("order_items")
                .select("*, product:products(*)")
                .order("created_at", { ascending: true })
                .eq("order_id", id);

            if (itemsData) {
                setItems(itemsData.map((item: any) => ({
                    ...item,
                    checked: !!item.quantity_actual && item.quantity_actual > 0,
                    missing: item.quantity_actual === 0
                })));
            }
            setLoading(false);
        }
        fetchOrder();
    }, [id]);

    const handleQuantityChange = (itemId: string, val: string) => {
        const value = parseFloat(val);
        setItems(prev => prev.map(item =>
            item.id === itemId ? {
                ...item,
                quantity_actual: isNaN(value) ? null : value,
                checked: true,
                missing: false
            } : item
        ));
    };

    const markAsMissing = (itemId: string) => {
        setItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, missing: true, checked: false, quantity_actual: 0 } : item
        ));
    };

    const markAsFound = (itemId: string) => {
        setItems(prev => prev.map(item =>
            item.id === itemId
                ? {
                    ...item,
                    missing: false,
                    checked: true,
                    quantity_actual: item.quantity_ordered
                }
                : item
        ));
    };

    const resetItem = (itemId: string) => {
        setItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, missing: false, checked: false, quantity_actual: null } : item
        ));
    };

    const saveChanges = async () => {
        const supabase = createClient();
        const updates = items.map(item => ({
            id: item.id,
            quantity_actual: item.missing ? 0 : (item.quantity_actual || item.quantity_ordered),
        }));

        for (const update of updates) {
            await supabase.from("order_items").update({ quantity_actual: update.quantity_actual }).eq("id", update.id);
        }

        await supabase.from("orders").update({ status: 'preparing' }).eq("id", id);
        toast.success("הליקוט נשמר בהצלחה!");
        router.push("/admin/orders");
    };

    if (loading) return <div className="p-20 text-center"><AdminHeader title="טוען..." /></div>;
    if (!order) return <div className="p-20 text-center"><AdminHeader title="הזמנה לא נמצאה" /></div>;

    const isPickup = order.delivery_method === 'pickup';
    const completedCount = items.filter(i => i.checked || i.missing).length;
    const progress = (completedCount / items.length) * 100;

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-32" dir="rtl">
            <AdminHeader 
                title={`ליקוט הזמנה #${order.order_number || order.id.slice(0, 8)}`}
                description={order.customer_name}
            >
                 <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button variant="ghost" size="icon" asChild className="h-14 w-14 rounded-2xl bg-white border border-slate-100 shadow-sm">
                        <Link href="/admin/orders"><ArrowRight className="h-6 w-6 text-slate-400" /></Link>
                    </Button>
                    {isPickup && <Badge className="h-10 px-4 rounded-xl bg-purple-100 text-purple-700 border-purple-200 font-black uppercase text-[10px] tracking-widest mr-auto md:mr-0">איסוף עצמי</Badge>}
                 </div>
            </AdminHeader>

            {/* Progress Top Bar on Mobile */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-1.5 bg-slate-100/50 backdrop-blur-sm">
                 <div className="h-full bg-[#AADB56] transition-all duration-700 ease-out shadow-[0_0_10px_#AADB56]" style={{ width: `${progress}%` }} />
            </div>

            <div className="grid grid-cols-1 gap-4">
                {items.map((item) => {
                    const isKg = item.product.unit_type === 'kg';
                    const isDone = item.checked || item.missing;

                    return (
                        <Card
                            key={item.id}
                            className={cn(
                                "transition-all duration-500 rounded-[32px] overflow-hidden border-2",
                                item.missing ? "bg-red-50/30 border-red-100 group opacity-70" :
                                item.checked ? "bg-green-50/30 border-green-100" :
                                "bg-white border-slate-50 shadow-xl shadow-slate-100/50"
                            )}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start gap-5">
                                    {/* Product Image */}
                                    <div className={cn(
                                        "h-20 w-20 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden border-2 shadow-inner transition-all",
                                        item.missing ? "bg-white border-red-100" : "bg-white border-slate-50",
                                        isDone && "scale-95"
                                    )}>
                                        {item.product.image_url ? (
                                            <img src={item.product.image_url} alt="" className={cn("w-full h-full object-contain p-1", item.missing && "grayscale")} />
                                        ) : (
                                            <div className="text-2xl">📦</div>
                                        )}
                                    </div>

                                    {/* Info Section */}
                                    <div className="flex-1 min-w-0 py-1">
                                        <h3 className={cn(
                                            "font-black text-xl tracking-tighter leading-tight transition-all",
                                            isDone ? "text-slate-400" : "text-[#112a1e]"
                                        )}>
                                            {item.product.name}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-200">
                                                {isKg ? 'שקיל' : 'יחידות'}
                                            </span>
                                            <span className="font-black text-lg text-[#112a1e] tracking-tight">
                                                {item.quantity_ordered} <span className="text-sm opacity-40">{isKg ? 'ק״ג' : 'יח׳'}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Reset Button */}
                                    {isDone && (
                                        <Button variant="ghost" size="icon" onClick={() => resetItem(item.id)} className="h-10 w-10 rounded-xl text-slate-300 hover:text-slate-600 hover:bg-slate-100/50 transition-all">
                                            <RotateCcw className="h-5 w-5" />
                                        </Button>
                                    )}
                                </div>

                                {/* Controls */}
                                <div className="mt-6 pt-6 border-t border-slate-100/50">
                                    {!isDone ? (
                                        <div className="flex items-center gap-4">
                                            <Button
                                                variant="outline"
                                                onClick={() => markAsMissing(item.id)}
                                                className="flex-1 h-14 rounded-2xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 font-black tracking-tight gap-2 transition-all"
                                            >
                                                <X className="h-5 w-5" />
                                                סמן כחסר
                                            </Button>

                                            {isKg ? (
                                                <div className="flex-[2] flex items-center gap-3 bg-[#AADB56]/5 rounded-2xl border-2 border-[#AADB56]/20 p-2 overflow-hidden shadow-inner group-focus-within:border-[#AADB56] transition-all">
                                                    <span className="text-[10px] font-black text-[#688a2f] uppercase tracking-widest mr-2 whitespace-nowrap">משקל בפועל:</span>
                                                    <Input
                                                        type="number"
                                                        inputMode="decimal"
                                                        className="flex-1 h-10 text-center text-xl font-black border-0 bg-transparent focus-visible:ring-0 p-0 text-[#112a1e]"
                                                        placeholder={item.quantity_ordered.toString()}
                                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                    />
                                                    <Button size="icon" onClick={() => markAsFound(item.id)} className="h-10 w-10 rounded-xl bg-[#AADB56] hover:bg-[#112a1e] text-[#112a1e] hover:text-white transition-all shadow-lg shrink-0">
                                                        <Check className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    onClick={() => markAsFound(item.id)}
                                                    className="flex-[2] h-14 rounded-2xl bg-[#AADB56] hover:bg-[#112a1e] text-[#112a1e] hover:text-white font-black tracking-tight gap-2 shadow-xl shadow-[#AADB56]/10 transition-all"
                                                >
                                                    <Check className="h-5 w-5" />
                                                    איסוף {item.quantity_ordered} יח׳
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className={cn(
                                            "flex items-center justify-center gap-3 py-3 rounded-2xl font-black text-sm tracking-tight border shadow-inner",
                                            item.missing ? "text-red-500 bg-red-50 border-red-100" : "text-[#1b3626] bg-[#AADB56]/10 border-[#AADB56]/20"
                                        )}>
                                            {item.missing ? (
                                                <><X className="h-4 w-4" /> סומן כחסר</>
                                            ) : (
                                                <><Check className="h-4 w-4" /> נאספו {item.quantity_actual} {isKg ? 'ק״ג' : 'יח׳'}</>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Sticky Mobile Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/80 backdrop-blur-xl border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-50 transition-all duration-500">
                <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-6">
                    <div className="hidden md:block flex-1 w-full">
                        <div className="flex justify-between text-[11px] mb-3 font-black text-slate-400 uppercase tracking-widest px-1">
                            <div className="flex gap-4">
                                <span className={cn("transition-colors", completedCount > 0 ? "text-green-600" : "")}>{items.filter(i => i.checked).length} נאספו</span>
                                <span className={cn("transition-colors", items.filter(i => i.missing).length > 0 ? "text-red-500" : "")}>{items.filter(i => i.missing).length} חסרים</span>
                            </div>
                            <span>{completedCount} מתוך {items.length}</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 shadow-inner">
                            <div
                                className="h-full bg-[#AADB56] transition-all duration-1000 ease-out shadow-[0_0_10px_#AADB56]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className={cn(
                            "w-full md:w-64 h-16 text-xl font-black rounded-[24px] shadow-2xl transition-all active:scale-[0.98]",
                            progress < 100 ? "bg-slate-900 border-2 border-slate-100" : "bg-[#112a1e] hover:bg-black text-white"
                        )}
                        onClick={saveChanges}
                        disabled={progress < 100}
                    >
                        {progress < 100
                            ? `נשארו ${items.length - completedCount} פריטים`
                            : '✔ סיים ליקוט'
                        }
                    </Button>
                </div>
            </div>
        </div>
    );
}

