"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight, CheckCircle2 } from "lucide-react";

export default function PickingListPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            const supabase = createClient();
            const { data } = await supabase
                .from("orders")
                .select("*, order_items(count)")
                .in('status', ['paid', 'pending']) // Assuming 'paid' means ready to pick
                .order("created_at", { ascending: false });

            if (data) setOrders(data);
            setLoading(false);
        }
        fetchOrders();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin">
                        <ArrowRight className="h-6 w-6" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">ליקוט הזמנות</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {orders.map(order => (
                    <Link key={order.id} href={`/admin/picker/${order.id}`}>
                        <Card className="hover:border-primary transition-colors cursor-pointer">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">#{order.id.slice(0, 8)}</h3>
                                        <p className="text-muted-foreground text-sm">
                                            {format(new Date(order.created_at), "dd/MM HH:mm")}
                                        </p>
                                    </div>
                                    <Badge variant={order.status === 'paid' ? 'default' : 'outline'}>
                                        {order.status === 'paid' ? 'שולם' : order.status}
                                    </Badge>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>לקוח:</span>
                                        <span className="font-medium">{order.customer_name || 'אורח'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>פריטים:</span>
                                        <span className="font-medium">{order.order_items[0]?.count || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>עיר:</span>
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        <span className="font-medium">{(order.shipping_address as any)?.city}</span>
                                    </div>
                                </div>

                                <Button className="w-full gap-2 mt-4">
                                    <Package className="h-4 w-4" />
                                    התחל ליקוט
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                {!loading && orders.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg">אין הזמנות הממתינות לליקוט</p>
                    </div>
                )}
            </div>
        </div>
    );
}
