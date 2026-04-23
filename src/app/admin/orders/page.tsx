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
import { RefreshCw, ShoppingBag, CheckCircle, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { deleteOrder } from "./actions";
import { OrderDetails, getStatusBadge } from "@/components/admin/OrderDetails";
import { MobileOrderCard } from "@/components/admin/MobileOrderCard";
import { AdminHeader } from "@/components/admin/AdminHeader";

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
            toast.error("שגיאה בעדכון ההזמנה");
        } else {
            toast.success("סטטוס ההזמנה עודכן");
            fetchOrders();
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (!confirm("פעולה זו תמחק את ההזמנה לצמיתות! האם להמשיך?")) return;
        setLoading(true);

        try {
            const result = await deleteOrder(orderId);

            if (result.success) {
                setOrders(prev => prev.filter(o => o.id !== orderId));
                toast.success("ההזמנה נמחקה בהצלחה");
            } else {
                toast.error(`שגיאה במחיקת ההזמנה: ${result.error}`);
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            toast.error("שגיאה לא צפויה במחיקת ההזמנה");
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

    const activeCount = orders.filter(o => ['pending', 'paid', 'preparing', 'shipping'].includes(o.status)).length;
    const historyCount = orders.filter(o => ['completed', 'cancelled', 'refunded'].includes(o.status)).length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <AdminHeader 
                title="ניהול הזמנות" 
                description="עקוב אחר הזמנות חדשות ונהל את היסטוריית המכירות"
            >
                <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={fetchOrders} 
                    disabled={loading}
                    className="h-14 w-14 rounded-2xl border-slate-100 shadow-sm hover:bg-[#AADB56]/10 transition-all bg-white"
                >
                    <RefreshCw className={`h-6 w-6 text-[#112a1e] ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </AdminHeader>

            <div className="flex bg-slate-100/50 p-1.5 rounded-2xl w-fit border border-slate-100 shadow-sm mb-4">
                <button
                    className={`px-6 md:px-10 py-3 rounded-xl font-black transition-all text-sm tracking-tight ${activeTab === 'active' ? 'bg-white text-[#112a1e] shadow-md border border-slate-50' : 'text-slate-400 hover:text-slate-600'}`}
                    onClick={() => setActiveTab('active')}
                >
                    הזמנות פעילות <span className="opacity-40 font-bold ml-1">({activeCount})</span>
                </button>
                <button
                    className={`px-6 md:px-10 py-3 rounded-xl font-black transition-all text-sm tracking-tight ${activeTab === 'history' ? 'bg-white text-[#112a1e] shadow-md border border-slate-50' : 'text-slate-400 hover:text-slate-600'}`}
                    onClick={() => setActiveTab('history')}
                >
                    היסטוריה <span className="opacity-40 font-bold ml-1">({historyCount})</span>
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-24 bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40">
                    <RefreshCw className="h-10 w-10 animate-spin mx-auto text-[#AADB56]" />
                    <p className="mt-4 text-slate-400 font-bold">טוען נתונים מהשרת...</p>
                </div>
            )}

            {!loading && filteredOrders.length === 0 && (
                <div className="text-center py-24 bg-white rounded-[32px] border border-dashed border-slate-200 shadow-inner">
                    <ShoppingBag className="h-12 w-12 mx-auto text-slate-200 mb-4" />
                    <p className="text-xl font-black text-slate-400 font-bold">
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
                    <div className="hidden md:block bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-50">
                             <h2 className="text-xl font-black text-slate-800">{activeTab === 'active' ? 'הזמנות שמחכות לך' : 'סיכום הזמנות עבר'}</h2>
                             <p className="text-sm text-slate-400 font-medium">
                                {activeTab === 'active'
                                    ? 'הזמנות שממתינות לטיפול, ליקוט או משלוח.'
                                    : 'הזמנות שהושלמו או בוטלו.'}
                            </p>
                        </div>
                        <Table dir="rtl">
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="hover:bg-transparent border-slate-50">
                                    <TableHead className="text-right py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider pr-8">מס׳ הזמנה</TableHead>
                                    <TableHead className="text-right py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider">תאריך ושעה</TableHead>
                                    <TableHead className="text-right py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider">סה״כ לתשלום</TableHead>
                                    <TableHead className="text-right py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider">תשלום</TableHead>
                                    <TableHead className="text-right py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider">סטטוס</TableHead>
                                    <TableHead className="text-left py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider pl-8">פעולות</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors border-slate-50 group">
                                        <TableCell className="font-mono text-xs font-black text-slate-600 pr-8">#{(order.shipping_address as any)?.order_number || order.id.slice(0, 8)}</TableCell>
                                        <TableCell className="font-bold text-slate-500">{format(new Date(order.created_at), "dd/MM/yyyy HH:mm")}</TableCell>
                                        <TableCell className="font-black text-slate-800 text-base">₪{order.total_price_estimated.toFixed(2)}</TableCell>
                                        <TableCell className="font-bold text-slate-500 text-xs">
                                            {order.payment_method === 'paybox' ? 'PayBox' : 
                                             order.payment_method === 'bit' ? 'Bit' : 'מזומן'}
                                        </TableCell>
                                        <TableCell className="scale-90 origin-right">{getStatusBadge(order.status)}</TableCell>
                                        <TableCell className="pl-8">
                                            <div className="flex items-center gap-1 justify-end opacity-40 group-hover:opacity-100 transition-opacity">
                                                {activeTab === 'active' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-10 w-10 text-green-500 hover:bg-green-50"
                                                        title="סמן כהושלם"
                                                        onClick={() => handleCompleteOrder(order.id)}
                                                    >
                                                        <CheckCircle className="h-5 w-5" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                    title="מחק הזמנה"
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" className="h-10 px-4 rounded-xl gap-2 font-bold text-slate-600 hover:bg-slate-100">
                                                            <Eye className="h-4 w-4" />
                                                            פרטים
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl sm:max-w-[1000px] gap-0 p-0 rounded-[40px] overflow-hidden border-none shadow-2xl" dir="rtl">
                                                        <DialogHeader className="p-8 pb-4 bg-slate-50/50">
                                                            <DialogTitle className="flex items-center justify-center w-full gap-3 text-2xl font-black text-slate-800">
                                                                <ShoppingBag className="h-7 w-7 text-[#AADB56]" />
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
                    </div>
                </>
            )}
        </div>
    );
}

