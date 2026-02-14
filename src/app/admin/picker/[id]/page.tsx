"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Check } from "lucide-react";
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
                    checked: !!item.quantity_actual, // If already weighed/picked, mark checked
                    missing: false
                })));
            }
            setLoading(false);
        }
        fetchOrder();
    }, [id]);

    const handleQuantityChange = (itemId: string, val: string) => {
        const value = parseFloat(val);
        setItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, quantity_actual: isNaN(value) ? null : value, checked: true } : item
        ));
    };

    const toggleMissing = (itemId: string) => {
        setItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, missing: !item.missing, checked: !item.missing } : item
        ));
    };

    const toggleChecked = (itemId: string) => {
        setItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
        ));
    };

    const saveChanges = async () => {
        const supabase = createClient();
        const updates = items.map(item => ({
            id: item.id,
            quantity_actual: item.missing ? 0 : (item.quantity_actual || item.quantity_ordered),
            // We could add a 'picked' status column if schema allowed, for now quantity_actual implies picked
        }));

        for (const update of updates) {
            await supabase.from("order_items").update({ quantity_actual: update.quantity_actual }).eq("id", update.id);
        }

        // Update order status
        await supabase.from("orders").update({ status: 'preparing' }).eq("id", id);

        alert("הליקוט נשמר בהצלחה!");
        router.push("/admin/picker");
    };

    if (loading) return <div>Loading...</div>;
    if (!order) return <div>Order not found</div>;

    return (
        <div className="container max-w-2xl py-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/picker"><ArrowRight className="h-6 w-6" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">ליקוט הזמנה #{order.id.slice(0, 8)}</h1>
                    <p className="text-muted-foreground">{order.customer_name}</p>
                </div>
            </div>

            <div className="space-y-4">
                {items.map((item) => {
                    const isKg = item.product.unit_type === 'kg';
                    return (
                        <Card key={item.id} className={`transition-all ${item.checked ? 'bg-green-50/50 border-green-200' : ''} ${item.missing ? 'bg-red-50/50 border-red-200' : ''}`}>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div
                                    className="h-12 w-12 bg-secondary rounded-md flex items-center justify-center font-bold text-lg cursor-pointer"
                                    onClick={() => toggleChecked(item.id)}
                                >
                                    {item.checked ? <Check className="h-6 w-6 text-green-600" /> : item.product.name.charAt(0)}
                                </div>

                                <div className="flex-1">
                                    <h3 className={`font-bold text-lg ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                                        {item.product.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Badge variant="outline">{isKg ? 'שקיל' : 'יחידות'}</Badge>
                                        <span>להזמנה: {item.quantity_ordered} {isKg ? 'ק״ג' : 'יח׳'}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 items-end">
                                    {isKg ? (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                className="w-20 h-9 text-center"
                                                placeholder={item.quantity_ordered.toString()}
                                                value={item.quantity_actual ?? ''}
                                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                            />
                                            <span className="text-sm">ק״ג</span>
                                        </div>
                                    ) : (
                                        <Button
                                            variant={item.checked ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => toggleChecked(item.id)}
                                        >
                                            {item.checked ? 'נאסף' : 'אסוף'}
                                        </Button>
                                    )}

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`h-6 text-xs ${item.missing ? 'text-red-600' : 'text-muted-foreground'}`}
                                        onClick={() => toggleMissing(item.id)}
                                    >
                                        {item.missing ? 'סומן כחסר' : 'חסר?'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card className="sticky bottom-4 border-t shadow-lg bg-background">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">{items.filter(i => i.checked).length} מתוך {items.length} נאספו</p>
                    </div>
                    <Button size="lg" className="gap-2" onClick={saveChanges}>
                        <Check className="h-5 w-5" />
                        סיים ליקוט
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
