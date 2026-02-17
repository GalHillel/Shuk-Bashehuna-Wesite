import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { format } from "date-fns";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function OrderDetails({ order }: { order: any }) {
    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[80vh]">
            {/* Items */}
            <div>
                <h3 className="font-bold mb-4">מוצרים</h3>
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
    );
}

export const getStatusBadge = (status: string) => {
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
