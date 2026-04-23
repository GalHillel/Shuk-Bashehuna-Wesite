import { User, Phone, CheckCircle2, AlertCircle, Fingerprint, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileCustomerCardProps {
    customer: any;
}

export function MobileCustomerCard({ customer }: MobileCustomerCardProps) {
    return (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-5 space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 shadow-inner">
                    <User className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-black text-[#1b3626] text-xl tracking-tighter truncate leading-tight">
                        {customer.full_name || "ללא שם"}
                    </h3>
                    <div className="flex items-center gap-2 text-[#AADB56] mt-1">
                        <Phone className="w-3.5 h-3.5" />
                        <span className="text-sm font-black tracking-tight">{customer.phone || "-"}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-tight">הצטרפות</span>
                    </div>
                    <p className="font-black text-[#112a1e] text-sm">
                        {new Date(customer.created_at).toLocaleDateString('he-IL')}
                    </p>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Fingerprint className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-tight">מזהה</span>
                    </div>
                    <p className="font-mono text-[10px] text-slate-300 uppercase">
                        {customer.id.slice(0, 12)}
                    </p>
                </div>
            </div>

            <div className={cn(
                "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border font-black text-xs uppercase tracking-widest transition-colors",
                customer.marketing_opt_in 
                    ? "bg-[#AADB56]/10 text-[#1b3626] border-[#AADB56]/20" 
                    : "bg-slate-50 text-slate-400 border-slate-100"
            )}>
                {customer.marketing_opt_in ? (
                    <>
                        <CheckCircle2 className="w-4 h-4" />
                        מאשר דיוור שיווקי
                    </>
                ) : (
                    <>
                        <AlertCircle className="w-4 h-4" />
                        ללא אישור דיוור
                    </>
                )}
            </div>
        </div>
    );
}
