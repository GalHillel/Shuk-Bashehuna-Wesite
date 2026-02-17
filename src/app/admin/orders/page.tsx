"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase/client";
import { useState, useEffect, useCallback } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ShoppingBag, Eye, RefreshCw, CheckCircle, Trash2 } from "lucide-react";

import { deleteOrder } from "./actions";
import { OrderDetails, getStatusBadge } from "@/components/admin/OrderDetails";
import { MobileOrderCard } from "@/components/admin/MobileOrderCard";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase
            .from("orders")
            .select(`
                *,
                order_items (
                    *,
                    product:products(*)
                )
            `)
            .order("created_at", { ascending: false });

        if (data) setOrders(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleCompleteOrder = async (orderId: string) => {
        if (!confirm("האם אתה בטוח שברצונך לסמן הזמנה זו כהושלמה?")) return;

        const { error } = await supabase.from("orders").update({ status: "completed" }).eq("id", orderId);
        if (error) {
            alert("שגיאה בעדכון ההזמנה");
        } else {
            fetchOrders();
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (!confirm("פעולה זו תמחק את ההזמנה לצמיתות! האם להמשיך?")) return;
        setLoading(true);

        try {
            const result = await deleteOrder(orderId);

            if (result.success) {
                // Remove from local state immediately
                setOrders(prev => prev.filter(o => o.id !== orderId));
                alert("ההזמנה נמחקה בהצלחה (לצמיתות)");
            } else {
                alert(`שגיאה במחיקת ההזמנה: ${result.error}`);
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            alert("שגיאה לא צפויה במחיקת ההזמנה");
        } finally {
            setLoading(false);
        }
    };



    const filteredOrders = orders.filter(order => {
        if (activeTab === 'active') {
            return ['pending', 'paid', 'preparing', 'shipping'].includes(order.status);
        } else {
            return ['completed', 'cancelled', 'refunded'].includes(order.status);
        }
    });

    return (
        <div className="p-6 space-y-6" dir="rtl">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">ניהול הזמנות</h1>
                <Button variant="outline" size="icon" onClick={fetchOrders} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            <div className="flex gap-2 border-b">
                <button
                    className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'active' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setActiveTab('active')}
                >
                    פעילות ({orders.filter(o => ['pending', 'paid', 'preparing', 'shipping'].includes(o.status)).length})
                </button>
                <button
                    className={`px-4 py-2 font-medium transition-colors border-b-2 ${activeTab === 'history' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setActiveTab('history')}
                >
                    היסטוריה ({orders.filter(o => ['completed', 'cancelled', 'refunded'].includes(o.status)).length})
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="mt-2 text-muted-foreground">טוען הזמנות...</p>
                </div>
            )}

            {!loading && filteredOrders.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                    <p className="text-lg text-muted-foreground">
                        לא נמצאו הזמנות {activeTab === 'active' ? 'פעילות' : 'בהיסטוריה'}
                    </p>
                </div>
            )}

            {!loading && filteredOrders.length > 0 && (
                <>
                    {/* Mobile View (Cards) */}
                    <div className="md:hidden space-y-4">
                        {filteredOrders.map((order) => (
                            <MobileOrderCard
                                key={order.id}
                                order={order}
                                onComplete={handleCompleteOrder}
                                onDelete={handleDeleteOrder}
                                showCompleteAction={activeTab === 'active'}
                            />
                        ))}
                    </div>

                    {/* Desktop View (Table) */}
                    <Card className="hidden md:block">
                        <CardHeader>
                            <CardTitle>{activeTab === 'active' ? 'הזמנות פעילות' : 'היסטוריית הזמנות'}</CardTitle>
                            <CardDescription>
                                {activeTab === 'active'
                                    ? 'הזמנות שממתינות לטיפול, ליקוט או משלוח.'
                                    : 'הזמנות שהושלמו או בוטלו.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-right">מס׳ הזמנה</TableHead>
                                        <TableHead className="text-right">תאריך</TableHead>
                                        <TableHead className="text-right">סה״כ (משוער)</TableHead>
                                        <TableHead className="text-right">סטטוס</TableHead>
                                        <TableHead className="text-left">פעולות</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-mono text-xs font-bold">#{(order.shipping_address as any)?.order_number || order.id.slice(0, 8)}</TableCell>
                                            <TableCell>{format(new Date(order.created_at), "dd/MM/yyyy HH:mm")}</TableCell>
                                            <TableCell>₪{order.total_price_estimated.toFixed(2)}</TableCell>
                                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                                            <TableCell className="text-left">
                                                <div className="flex items-center gap-2 justify-end">
                                                    {activeTab === 'active' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            title="סמן כהושלם"
                                                            onClick={() => handleCompleteOrder(order.id)}
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        title="מחק הזמנה"
                                                        onClick={() => handleDeleteOrder(order.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="gap-2">
                                                                <Eye className="h-4 w-4" />
                                                                פרטים
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-2xl sm:max-w-[1000px] gap-0 p-0" dir="rtl">
                                                            <DialogHeader className="p-6 pb-2">
                                                                <DialogTitle className="flex items-center justify-center w-full gap-2 text-xl">
                                                                    <ShoppingBag className="h-5 w-5 text-primary" />
                                                                    פרטי הזמנה #{(order.shipping_address as any)?.order_number || order.id.slice(0, 8)}
                                                                </DialogTitle>
                                                            </DialogHeader>
                                                            <OrderDetails order={order} />
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}

