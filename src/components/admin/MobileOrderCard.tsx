import { Button } from "@/components/ui/button";
import { CheckCircle, Eye, ShoppingBag, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { OrderDetails, getStatusBadge } from "./OrderDetails";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface MobileOrderCardProps {
    order: any;
    onComplete: (id: string) => void;
    onDelete: (id: string) => void;
    showCompleteAction?: boolean;
}

export function MobileOrderCard({ order, onComplete, onDelete, showCompleteAction }: MobileOrderCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-bold bg-slate-100 px-2 py-0.5 rounded">
                            #{(order.shipping_address as any)?.order_number || order.id.slice(0, 8)}
                        </span>
                        {getStatusBadge(order.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {format(new Date(order.created_at), "dd/MM/yyyy HH:mm")}
                    </p>
                </div>
                <div className="text-left">
                    <span className="font-bold text-lg block">₪{order.total_price_estimated.toFixed(2)}</span>
                </div>
            </div>

            {/* Info Snippet */}
            <div className="text-sm bg-gray-50 p-2 rounded-lg">
                <p className="font-medium truncate">{(order.shipping_address as any)?.fullName}</p>
                <p className="text-muted-foreground truncate">{(order.shipping_address as any)?.city}, {(order.shipping_address as any)?.street}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1 gap-2">
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

                {showCompleteAction && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-green-600 bg-green-50 hover:bg-green-100"
                        onClick={() => onComplete(order.id)}
                    >
                        <CheckCircle className="h-5 w-5" />
                    </Button>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 bg-red-50 hover:bg-red-100"
                    onClick={() => onDelete(order.id)}
                >
                    <Trash2 className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
