"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, Tag, Percent, Scissors, Calendar, Hash, Check, X } from "lucide-react";
import { Coupon } from "@/types/supabase";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MobileCouponCard } from "@/components/admin/MobileCouponCard";

export default function CouponsAdminPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [newCoupon, setNewCoupon] = useState({
        code: "",
        discount_amount: 0,
        discount_type: "fixed" as "fixed" | "percentage",
        usage_limit: null as number | null,
        usage_limit_per_user: null as number | null,
        is_active: true
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    async function fetchCoupons() {
        setLoading(true);
        const { data } = await supabase
            .from("coupons")
            .select("*")
            .order("created_at", { ascending: false });
        if (data) setCoupons(data);
        setLoading(false);
    }

    async function handleAddCoupon(e: React.FormEvent) {
        e.preventDefault();
        const { error } = await supabase
            .from("coupons")
            .insert(newCoupon);
        
        if (error) {
            toast.error("שגיאה ביצירת קופון: " + error.message);
        } else {
            toast.success("קופון נוצר בהצלחה!");
            setIsAdding(false);
            setNewCoupon({
                code: "",
                discount_amount: 0,
                discount_type: "fixed",
                usage_limit: null,
                usage_limit_per_user: null,
                is_active: true
            });
            fetchCoupons();
        }
    }

    async function toggleCouponStatus(id: string, currentStatus: boolean) {
        const { error } = await supabase
            .from("coupons")
            .update({ is_active: !currentStatus })
            .eq("id", id);
        
        if (error) {
            toast.error("שגיאה בעדכון סטטוס: " + error.message);
        } else {
            toast.success("סטטוס עודכן");
            setCoupons(coupons.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));
        }
    }

    async function deleteCoupon(id: string) {
        if (!confirm("האם אתה בטוח שברצונך למחוק קופון זה?")) return;
        
        const { error } = await supabase
            .from("coupons")
            .delete()
            .eq("id", id);
        
        if (error) {
            toast.error("שגיאה במחיקת קופון: " + error.message);
        } else {
            toast.success("קופון נמחק");
            setCoupons(coupons.filter(c => c.id !== id));
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <AdminHeader 
                title="ניהול קופונים" 
                description="נהלו את קודי ההנחה ומבצעי הקידום באתר"
            >
                <Button 
                    onClick={() => setIsAdding(!isAdding)}
                    className={cn(
                        "h-14 w-full md:w-auto px-8 rounded-2xl font-black transition-all shadow-xl",
                        isAdding ? "bg-slate-200 text-slate-800 hover:bg-slate-300" : "bg-[#AADB56] text-[#112a1e] hover:bg-[#112a1e] hover:text-white"
                    )}
                >
                    {isAdding ? <X className="ml-2 h-5 w-5" /> : <Plus className="ml-2 h-5 w-5" />}
                    {isAdding ? "ביטול" : "קופון חדש"}
                </Button>
            </AdminHeader>

            {isAdding && (
                <div className="bg-white p-8 rounded-[40px] shadow-2xl border-2 border-[#AADB56]/20 mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <form onSubmit={handleAddCoupon} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
                        <div className="space-y-2">
                            <Label className="text-slate-400 font-bold text-xs uppercase tracking-wider">קוד קופון</Label>
                            <Input 
                                placeholder="למשל: FIRST20" 
                                value={newCoupon.code} 
                                onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                                className="h-14 rounded-2xl font-black uppercase text-lg border-slate-200"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-400 font-bold text-xs uppercase tracking-wider">סוג הנחה</Label>
                            <Select value={newCoupon.discount_type} onValueChange={(v: any) => setNewCoupon({...newCoupon, discount_type: v})}>
                                <SelectTrigger className="h-14 rounded-2xl font-bold bg-slate-50/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                    <SelectItem value="fixed">סכום קבוע (₪)</SelectItem>
                                    <SelectItem value="percentage">אחוזים (%)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-400 font-bold text-xs uppercase tracking-wider">גובה ההנחה</Label>
                            <Input 
                                type="number" 
                                value={newCoupon.discount_amount} 
                                onChange={(e) => setNewCoupon({...newCoupon, discount_amount: Number(e.target.value)})}
                                className="h-14 rounded-2xl font-black text-lg border-slate-200"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-400 font-bold text-xs uppercase tracking-wider">מגבלה כללית (ריק = ללא הגבלה)</Label>
                            <Input 
                                type="number" 
                                value={newCoupon.usage_limit || ""} 
                                onChange={(e) => setNewCoupon({...newCoupon, usage_limit: e.target.value ? Number(e.target.value) : null})}
                                className="h-14 rounded-2xl font-bold border-slate-200"
                                placeholder="∞"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-400 font-bold text-xs uppercase tracking-wider">מגבלה למשתמש (ריק = ללא הגבלה)</Label>
                            <Input 
                                type="number" 
                                value={newCoupon.usage_limit_per_user || ""} 
                                onChange={(e) => setNewCoupon({...newCoupon, usage_limit_per_user: e.target.value ? Number(e.target.value) : null})}
                                className="h-14 rounded-2xl font-bold border-slate-200"
                                placeholder="∞"
                            />
                        </div>
                        <div>
                            <Button type="submit" className="w-full h-14 rounded-2xl bg-[#1b3626] text-white hover:bg-[#2c533c] font-black shadow-lg">
                                צור קופון
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="md:hidden space-y-4">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                         <div key={i} className="h-48 bg-white rounded-[28px] animate-pulse border border-slate-100" />
                    ))
                ) : coupons.length === 0 ? (
                    <div className="bg-white p-12 rounded-[28px] text-center border border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold">לא נמצאו קופונים</p>
                    </div>
                ) : (
                    coupons.map((coupon) => (
                        <MobileCouponCard
                            key={coupon.id}
                            coupon={coupon}
                            onToggleStatus={toggleCouponStatus}
                            onDelete={deleteCoupon}
                        />
                    ))
                )}
            </div>

            <div className="hidden md:block bg-white rounded-[40px] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-20 flex items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-[#AADB56]" />
                    </div>
                ) : coupons.length === 0 ? (
                    <div className="p-20 text-center">
                        <p className="text-slate-400 font-bold">לא נמצאו קופונים במערכת</p>
                    </div>
                ) : (
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                                <th className="px-8 py-6">קוד</th>
                                <th className="px-8 py-6">הנחה</th>
                                <th className="px-8 py-6">שימושים / כללי</th>
                                <th className="px-8 py-6">מגבלה למשתמש</th>
                                <th className="px-8 py-6">סטטוס</th>
                                <th className="px-8 py-6">נוצר ב</th>
                                <th className="px-8 py-6 text-left">פעולות</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-lime-50 flex items-center justify-center text-[#AADB56] border border-white">
                                                <Tag className="w-6 h-6" />
                                            </div>
                                            <span className="font-black text-[#112a1e] text-2xl tracking-tighter">{coupon.code}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-baseline gap-1 font-black text-[#112a1e]">
                                            <span className="text-3xl tracking-tighter">{coupon.discount_amount}</span>
                                            <span className="text-sm opacity-40">{coupon.discount_type === 'percentage' ? '%' : '₪'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-slate-800 font-black text-lg">{coupon.used_count}</span>
                                            <span className="text-slate-300 font-bold">/</span>
                                            <span className="text-slate-400 font-bold">{coupon.usage_limit || "∞"}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-slate-500 font-black">{coupon.usage_limit_per_user || "∞"}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <Switch 
                                                checked={coupon.is_active} 
                                                onCheckedChange={() => toggleCouponStatus(coupon.id, coupon.is_active)}
                                                className="data-[state=checked]:bg-[#AADB56]"
                                            />
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest min-w-[50px]",
                                                coupon.is_active ? "text-[#AADB56]" : "text-slate-300"
                                            )}>
                                                {coupon.is_active ? "פעיל" : "מושבת"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-slate-400 font-bold text-sm tracking-tight">
                                        {format(new Date(coupon.created_at), "dd/MM/yyyy")}
                                    </td>
                                    <td className="px-8 py-6 text-left">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => deleteCoupon(coupon.id)}
                                            className="h-10 w-10 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
