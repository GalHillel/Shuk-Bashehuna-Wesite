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

        // 1. Delete associated order items first (to be safe if no cascade)
        const { error: itemsError } = await supabase.from("order_items").delete().eq("order_id", orderId);
        if (itemsError) {
            console.error("Error deleting items:", itemsError);
            // We continue to try deleting the order even if items fail, though usually it means FK issue
        }

        // 2. Delete the order itself
        const { error } = await supabase.from("orders").delete().eq("id", orderId);
        if (error) {
            console.error("Delete error:", error);
            alert("שגיאה במחיקת ההזמנה: " + error.message);
        } else {
            fetchOrders();
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <Badge variant="outline">ממתין</Badge>;
            case 'paid': return <Badge variant="outline" className="border-green-500 text-green-600">שולם</Badge>;
            case 'preparing': return <Badge variant="secondary">בהכנה</Badge>;
            case 'shipping': return <Badge className="bg-blue-500">במשלוח</Badge>;
            case 'completed': return <Badge className="bg-green-500">הושלם</Badge>;
            case 'cancelled': return <Badge variant="destructive">בוטל</Badge>;
            default: return <Badge>{status}</Badge>;
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

            <Card>
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
                            {filteredOrders.length === 0 && !loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        לא נמצאו הזמנות {activeTab === 'active' ? 'פעילות' : 'בהיסטוריה'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
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
                                                            <DialogTitle className="flex items-center gap-2">
                                                                <ShoppingBag className="h-5 w-5 text-primary" />
                                                                פרטי הזמנה {order.id.slice(0, 8)}
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[80vh]">
                                                            {/* Items */}
                                                            <div>
                                                                <h3 className="font-bold mb-4">מוצרים</h3>
                                                                {/* Add Picking Link Here */}
                                                                {['pending', 'paid', 'preparing'].includes(order.status) && (
                                                                    <Button className="w-full mb-4 gap-2" variant="outline" onClick={() => window.location.href = `/admin/picker/${order.id}`}>
                                                                        <ShoppingBag className="h-4 w-4" />
                                                                        מעבר לליקוט
                                                                    </Button>
                                                                )}
                                                                <div className="space-y-3 border rounded-lg p-4 bg-secondary/10">
                                                                    {(order.order_items as any)?.map((item: any) => (
                                                                        <div key={item.id} className="flex justify-between items-center text-sm">
                                                                            <div className="flex gap-2">
                                                                                <span className="text-muted-foreground">{item.quantity_ordered}x</span>
                                                                                <span className="font-medium">{item.product?.name}</span>
                                                                            </div>
                                                                            <span className="font-bold">₪{item.total_item_price?.toFixed(2)}</span>
                                                                        </div>
                                                                    ))}
                                                                    <div className="border-t pt-2 mt-4 flex justify-between font-bold text-lg">
                                                                        <span>סה״כ משוער</span>
                                                                        <span>₪{order.total_price_estimated.toFixed(2)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Customer & Shipping */}
                                                            <div className="space-y-6">
                                                                <div>
                                                                    <h3 className="font-bold mb-2">פרטי לקוח ומשלוח</h3>
                                                                    <div className="text-sm space-y-1 bg-secondary/10 p-4 rounded-lg border">
                                                                        <p><span className="text-muted-foreground ml-2">שם מלא:</span> {(order.shipping_address as any)?.fullName}</p>
                                                                        <p><span className="text-muted-foreground ml-2">טלפון:</span> {(order.shipping_address as any)?.phone}</p>
                                                                        <p>
                                                                            <span className="text-muted-foreground ml-2">כתובת:</span>
                                                                            {(order.shipping_address as any)?.street} {(order.shipping_address as any)?.house},
                                                                            קומה {(order.shipping_address as any)?.floor}, דירה {(order.shipping_address as any)?.apt},
                                                                            {(order.shipping_address as any)?.city}
                                                                        </p>
                                                                        {(order.shipping_address as any)?.notes && (
                                                                            <p className="mt-2 pt-2 border-t"><span className="text-muted-foreground ml-2">הערות:</span> {(order.shipping_address as any)?.notes}</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-bold mb-2">מועד אספקה</h3>
                                                                    <div className="text-sm bg-primary/5 p-4 rounded-lg border border-primary/10">
                                                                        {format(new Date(order.delivery_slot_start), "dd/MM/yyyy")} בין {format(new Date(order.delivery_slot_start), "HH:mm")} ל-{format(new Date(order.delivery_slot_end), "HH:mm")}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

