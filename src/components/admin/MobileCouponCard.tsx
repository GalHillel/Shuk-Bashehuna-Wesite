import { Button } from "@/components/ui/button";
import { Tag, Percent, Trash2, Calendar, Hash, UserCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Coupon } from "@/types/supabase";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MobileCouponCardProps {
    coupon: Coupon;
    onToggleStatus: (id: string, currentStatus: boolean) => void;
    onDelete: (id: string) => void;
}

export function MobileCouponCard({ coupon, onToggleStatus, onDelete }: MobileCouponCardProps) {
    return (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-5 space-y-5 animate-in fade-in zoom-in-95 duration-300">
            {/* Header: Code and Toggle */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-lime-50 flex items-center justify-center text-[#AADB56] shadow-inner">
                        <Tag className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-black text-[#1b3626] text-xl tracking-tighter leading-tight">{coupon.code}</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em]">נוצר ב-{format(new Date(coupon.created_at), "dd/MM/yyyy")}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <Switch 
                        checked={coupon.is_active} 
                        onCheckedChange={() => onToggleStatus(coupon.id, coupon.is_active)}
                        className="data-[state=checked]:bg-[#AADB56]"
                    />
                    <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest",
                        coupon.is_active ? "text-[#AADB56]" : "text-slate-300"
                    )}>
                        {coupon.is_active ? "פעיל" : "מושבת"}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Percent className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-tight">הנחה</span>
                    </div>
                    <div className="flex items-baseline gap-1 font-black text-[#112a1e]">
                        <span className="text-xl">{coupon.discount_amount}</span>
                        <span className="text-xs opacity-50">{coupon.discount_type === 'percentage' ? '%' : '₪'}</span>
                    </div>
                </div>
                <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Hash className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-tight">שימושים</span>
                    </div>
                    <div className="flex items-baseline gap-1 font-black text-[#112a1e]">
                        <span className="text-xl">{coupon.used_count}</span>
                        <span className="text-[11px] opacity-40 font-bold">/ {coupon.usage_limit || "∞"}</span>
                    </div>
                </div>
            </div>

            {/* User Limit Info */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#AADB56]/5 rounded-xl border border-[#AADB56]/10">
                <div className="flex items-center gap-2">
                    <UserCircle className="w-4 h-4 text-[#AADB56]" />
                    <span className="text-[11px] font-bold text-[#1b3626]">מגבלה למשתמש</span>
                </div>
                <span className="font-black text-[#112a1e] text-sm">{coupon.usage_limit_per_user || "ללא הגבלה"}</span>
            </div>

            {/* Delete Action */}
            <div className="pt-2 border-t border-slate-50 flex justify-end">
                <Button 
                    variant="ghost" 
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 font-black text-xs gap-2 rounded-xl h-10 px-4"
                    onClick={() => onDelete(coupon.id)}
                >
                    <Trash2 className="w-4 h-4" />
                    מחיקת קופון
                </Button>
            </div>
        </div>
    );
}
