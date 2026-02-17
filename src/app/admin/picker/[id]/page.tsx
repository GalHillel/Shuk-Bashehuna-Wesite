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
                .eq("order_id", id);

            if (itemsData) {
                // Initialize state with checked=false
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setItems(itemsData.map((item: any) => ({
                    ...item,
                    checked: !!item.quantity_actual && item.quantity_actual > 0, // precise check
                    missing: item.quantity_actual === 0 // If 0 explicitly, it was missing
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
                    quantity_actual: item.quantity_ordered // Default to ordered quantity
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

        // Update order status
        await supabase.from("orders").update({ status: 'preparing' }).eq("id", id);

        alert("הליקוט נשמר בהצלחה!");
        router.push("/admin/orders");
    };

    if (loading) return <div>Loading...</div>;
    if (!order) return <div>Order not found</div>;

    const isPickup = order.delivery_method === 'pickup';

    return (
        <div className="container max-w-2xl py-6 space-y-6 bg-slate-50 min-h-screen" dir="rtl">
            {/* Header */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/orders"><ArrowRight className="h-6 w-6" /></Link>
                </Button>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold">ליקוט הזמנה #{order.order_number || order.id.slice(0, 8)}</h1>
                        {isPickup && <Badge className="bg-purple-600">איסוף עצמי</Badge>}
                    </div>
                    <p className="text-muted-foreground">{order.customer_name}</p>
                </div>
            </div>

            <div className="space-y-3 pb-32">
                {items.map((item) => {
                    const isKg = item.product.unit_type === 'kg';
                    const isDone = item.checked || item.missing;

                    return (
                        <Card
                            key={item.id}
                            className={`transition-all duration-300 border overflow-hidden ${item.missing
                                ? 'bg-red-50 border-red-200 opacity-60'
                                : item.checked
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-white border-slate-200 shadow-sm'
                                }`}
                        >
                            <CardContent className="p-4 flex flex-col gap-4">
                                <div className="flex items-start gap-4">
                                    {/* Image / Icon */}
                                    <div className={`
                                        h-16 w-16 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border
                                        ${item.missing ? 'bg-red-100 border-red-200' : 'bg-slate-100 border-slate-200'}
                                    `}>
                                        {item.product.image_url ? (
                                            <img src={item.product.image_url} alt="" className={`w-full h-full object-cover ${item.missing ? 'grayscale' : ''}`} />
                                        ) : (
                                            <span className="text-xl font-bold text-slate-400">{item.product.name.charAt(0)}</span>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-bold text-lg leading-tight mb-1 ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                                            {item.product.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Badge variant="secondary" className="text-xs bg-slate-100">
                                                {isKg ? 'שקיל' : 'יחידות'}
                                            </Badge>
                                            <span className="font-medium text-base text-slate-700">
                                                {item.quantity_ordered} {isKg ? 'ק״ג' : 'יח׳'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Edit / Reset for Done items */}
                                    {isDone && (
                                        <Button variant="ghost" size="icon" onClick={() => resetItem(item.id)} className="text-slate-400 hover:text-slate-600">
                                            <RotateCcw className="h-5 w-5" />
                                        </Button>
                                    )}
                                </div>

                                {/* Actions */}
                                {!isDone ? (
                                    <div className="flex items-center justify-between gap-3 mt-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => markAsMissing(item.id)}
                                            className="flex-1 h-12 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
                                        >
                                            <X className="h-5 w-5 ml-2" />
                                            חסר
                                        </Button>

                                        {isKg ? (
                                            <div className="flex-1 flex items-center gap-2 bg-slate-50 rounded-lg border p-1 pr-3">
                                                <span className="text-xs font-bold text-slate-500">נשקל:</span>
                                                <Input
                                                    type="number"
                                                    inputMode="decimal"
                                                    className="flex-1 h-10 text-center text-lg font-bold border-0 bg-transparent focus-visible:ring-0 p-0"
                                                    placeholder={item.quantity_ordered.toString()}
                                                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                />
                                                <Button size="sm" onClick={() => markAsFound(item.id)} className="h-10 w-10 p-0 rounded-md bg-green-600 hover:bg-green-700">
                                                    <Check className="h-5 w-5 text-white" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={() => markAsFound(item.id)}
                                                className="flex-[2] h-12 bg-green-600 hover:bg-green-700 text-white font-bold shadow-sm shadow-green-900/10"
                                            >
                                                <Check className="h-5 w-5 ml-2" />
                                                נמצא ({item.quantity_ordered})
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div className={`text-center py-2 rounded-lg text-sm font-bold ${item.missing ? 'text-red-600 bg-red-50/50' : 'text-green-700 bg-green-50/50'}`}>
                                        {item.missing ? 'סומן כחסר' : `נאספו ${item.quantity_actual} ${isKg ? 'ק״ג' : 'יח׳'}`}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Sticky Mobile Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-20 md:static md:shadow-none md:border-0 md:bg-transparent md:p-0">
                <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex-1 hidden md:block">
                        <div className="flex justify-between text-sm mb-2 font-medium">
                            <span className="text-green-700">{items.filter(i => i.checked).length} נמצאו</span>
                            <span className="text-red-600">{items.filter(i => i.missing).length} חסרים</span>
                            <span className="text-slate-400">{items.length} סה״כ</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-500 ease-out"
                                style={{ width: `${(items.filter(i => i.checked || i.missing).length / items.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="w-full md:w-auto h-14 text-lg font-bold rounded-2xl bg-slate-900 hover:bg-black shadow-xl shadow-black/10 transition-all active:scale-[0.98]"
                        onClick={saveChanges}
                        disabled={items.some(i => !i.checked && !i.missing)}
                    >
                        {items.some(i => !i.checked && !i.missing)
                            ? `נשארו ${items.filter(i => !i.checked && !i.missing).length} פריטים`
                            : '✔ סיים ליקוט'
                        }
                    </Button>
                </div>
            </div>
        </div>
    );
}
