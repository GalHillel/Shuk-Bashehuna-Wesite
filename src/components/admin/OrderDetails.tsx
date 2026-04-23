import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User, MapPin, CreditCard, Calendar, MessageSquare, Package } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function OrderDetails({ order }: { order: any }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[85vh] p-1 scale-in-95 animate-in fade-in duration-300">
            {/* Items Column */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <Package className="w-5 h-5 text-[#AADB56]" />
                        פירוט מוצרים
                    </h3>
                    <Badge className="bg-[#AADB56]/10 text-[#1b3626] border-[#AADB56]/20 font-black px-3 py-1 uppercase tracking-widest text-[9px]">
                        {order.order_items?.length || 0} פריטים
                    </Badge>
                </div>

                {['pending', 'paid', 'preparing'].includes(order.status) && (
                    <Button 
                        className="w-full h-14 rounded-2xl bg-[#AADB56] text-[#112a1e] hover:bg-[#112a1e] hover:text-white font-black text-lg shadow-xl shadow-[#AADB56]/10 transition-all gap-3" 
                        onClick={() => window.location.href = `/admin/picker/${order.id}`}
                    >
                        <ShoppingBag className="h-6 w-6" />
                        מעבר לממשק ליקוט
                    </Button>
                )}

                <div className="space-y-0.5 bg-slate-50/50 rounded-[32px] p-2 border border-slate-100 overflow-hidden shadow-inner">
                    {(order.order_items as any)?.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center p-4 bg-white rounded-2xl mb-1 shadow-sm border border-slate-50 group hover:border-[#AADB56]/30 transition-all">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-[#1b3626] border border-white">
                                    {item.quantity_ordered}
                                </div>
                                <div>
                                    <span className="font-black text-slate-700 block leading-tight">{item.product?.name}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                        מחיר ליחידה: ₪{item.price_at_order?.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <span className="font-black text-[#1b3626] text-lg tracking-tighter">₪{item.total_item_price?.toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="p-6 mt-4 flex justify-between items-center bg-[#112a1e] rounded-[24px] text-white shadow-xl">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">סה״כ לתשלום משוער</p>
                            <p className="text-sm font-bold opacity-70 leading-none">הסכום הסופי ייקבע לאחר שקילה</p>
                        </div>
                        <span className="text-4xl font-black tracking-tighter text-[#AADB56]">₪{order.total_price_estimated.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Customer & Shipping Column */}
            <div className="space-y-8">
                {/* Customer Details */}
                <div className="space-y-4">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <User className="w-5 h-5 text-[#AADB56]" />
                        פרטי לקוח ומשלוח
                    </h3>
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-white">
                                <User className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">שם וטלפון</p>
                                <p className="font-black text-[#112a1e] text-lg">{(order.shipping_address as any)?.fullName}</p>
                                <p className="text-slate-500 font-bold">{(order.shipping_address as any)?.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-white">
                                <MapPin className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">כתובת למשלוח</p>
                                <p className="font-bold text-slate-700 leading-snug">
                                    {(order.shipping_address as any)?.street} {(order.shipping_address as any)?.house}, 
                                    קומה {(order.shipping_address as any)?.floor}, דירה {(order.shipping_address as any)?.apt}<br/>
                                    {(order.shipping_address as any)?.city}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-white">
                                <CreditCard className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">אמצעי תשלום</p>
                                <Badge className={cn(
                                    "font-black tracking-tighter text-sm",
                                    order.payment_method === 'cash' ? "bg-slate-100 text-slate-600 hover:bg-slate-100" : "bg-[#AADB56]/20 text-[#1b3626] hover:bg-[#AADB56]/30 shadow-none border-none"
                                )}>
                                    {order.payment_method === 'paybox' ? 'PayBox' : 
                                     order.payment_method === 'bit' ? 'Bit (ביט)' : 'מזומן - Cash'}
                                </Badge>
                            </div>
                        </div>

                        {(order.shipping_address as any)?.notes && (
                            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 flex gap-3">
                                <MessageSquare className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">הערות להזמנה</p>
                                    <p className="text-sm font-bold text-orange-800">{(order.shipping_address as any)?.notes}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Delivery Timing */}
                <div className="space-y-4">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#AADB56]" />
                        מועד אספקה
                    </h3>
                    <div className="bg-[#AADB56]/5 p-6 rounded-[32px] border border-[#AADB56]/10 flex items-center justify-between shadow-sm shadow-[#AADB56]/5">
                        <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-[#AADB56]/20 text-[#AADB56]">
                                <Calendar className="w-6 h-6" />
                             </div>
                             <div>
                                <p className="font-black text-[#112a1e] text-lg leading-tight">
                                    {format(new Date(order.delivery_slot_start), "dd/MM/yyyy")}
                                </p>
                                <p className="text-slate-500 font-bold text-sm">יום {format(new Date(order.delivery_slot_start), "EEEE", { locale: require('date-fns/locale/he') })}</p>
                             </div>
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">טווח שעות</p>
                            <p className="font-black text-[#112a1e] text-xl tracking-tighter">
                                {format(new Date(order.delivery_slot_start), "HH:mm")} - {format(new Date(order.delivery_slot_end), "HH:mm")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getStatusBadge = (status: string) => {
    const common = "font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-sm transition-all";
    switch (status) {
        case 'pending': return <Badge className={cn(common, "bg-white text-slate-400 border-slate-100")}>ממתין</Badge>;
        case 'paid': return <Badge className={cn(common, "bg-green-50 text-green-600 border-green-200")}>שולם</Badge>;
        case 'preparing': return <Badge className={cn(common, "bg-orange-50 text-orange-600 border-orange-200 shadow-orange-100")}>בהכנה</Badge>;
        case 'shipping': return <Badge className={cn(common, "bg-blue-50 text-blue-600 border-blue-200 shadow-blue-100")}>במשלוח</Badge>;
        case 'completed': return <Badge className={cn(common, "bg-[#AADB56]/10 text-[#1b3626] border-[#AADB56]/30 shadow-[#AADB56]/10")}>הושלם</Badge>;
        case 'cancelled': return <Badge className={cn(common, "bg-red-50 text-red-600 border-red-200")}>בוטל</Badge>;
        default: return <Badge className={common}>{status}</Badge>;
    }
};

