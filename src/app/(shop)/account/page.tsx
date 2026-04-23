"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Loader2, Package, User, Phone, MapPin, ChevronLeft, LogOut,
    ShoppingBag, Clock, CheckCircle2, MessageCircle, Mail, Truck,
    X, Home, Building, Save
} from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Order, Profile } from "@/types/supabase";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AccountPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Form states
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");

    // Address states
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [floor, setFloor] = useState("");
    const [apartment, setApartment] = useState("");

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        async function fetchData() {
            if (!user) return;

            const { data: prof } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (prof) {
                setProfile(prof);
                setFullName(prof.full_name || "");
                setPhone(prof.phone || "");

                const addr = prof.default_address as any;
                if (addr) {
                    setCity(addr.city || "");
                    setStreet(addr.street || "");
                    setHouseNumber(addr.houseNumber || "");
                    setFloor(addr.floor || "");
                    setApartment(addr.apartment || "");
                }
            }

            const { data: ords } = await supabase
                .from("orders")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (ords) setOrders(ords);
            setLoading(false);
        }

        if (user) fetchData();
    }, [user]);

    async function handleUpdateProfile(e: React.FormEvent) {
        e.preventDefault();
        if (!user) return;
        setUpdating(true);
        setSaveSuccess(false);

        const { error } = await supabase
            .from("profiles")
            .update({
                full_name: fullName,
                phone: phone,
                default_address: { city, street, houseNumber, floor, apartment }
            })
            .eq("id", user.id);

        if (error) {
            alert("שגיאה בעדכון הפרופיל: " + error.message);
        } else {
            setProfile({ ...profile!, full_name: fullName, phone: phone, default_address: { city, street, houseNumber, floor, apartment } });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
        setUpdating(false);
    }

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f9faf6]">
                <Loader2 className="h-10 w-10 animate-spin text-[#AADB56]" />
            </div>
        );
    }

    if (!user) return null;

    const firstName = profile?.full_name?.split(' ')[0] || user.email?.split('@')[0];

    return (
        <div className="flex min-h-screen flex-col bg-[#fcfcfc]" dir="rtl">

            {/* Hero — Lime with dots */}
            <div
                className="bg-[#AADB56] pt-12 md:pt-16 pb-10 md:pb-14 text-center relative overflow-hidden"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 2px, transparent 2.5px)',
                    backgroundSize: '24px 24px'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none" />
                <div className="relative z-10 container mx-auto px-4">
                    <h1 className="text-3xl md:text-5xl font-black text-[#112a1e] mb-3 tracking-tighter drop-shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
                        שלום, {firstName} 👋
                    </h1>
                    <div className="w-16 h-1.5 bg-[#112a1e] mx-auto mb-4 rounded-full opacity-20" />
                    <p className="text-base md:text-xl text-[#2c3e1c] font-black max-w-2xl mx-auto px-4 leading-tight opacity-90 animate-in fade-in slide-in-from-bottom-4 delay-200 duration-700">
                        נהלו את הפרטים, הכתובת וההזמנות שלכם
                    </p>
                </div>
            </div>

            {/* Content — Dotted background */}
            <main
                className="flex-1 min-w-full py-10 md:py-16 px-4"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.04) 1.5px, transparent 1.5px)',
                    backgroundSize: '24px 24px'
                }}
            >
                <div className="max-w-5xl mx-auto space-y-10">

                    {/* ─── Personal Details + Address ─── */}
                    <section className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-200/60">
                        <form onSubmit={handleUpdateProfile}>

                            {/* Personal info row */}
                            <div className="flex items-center gap-3 mb-6 border-r-4 border-[#AADB56] pr-4">
                                <User className="w-5 h-5 text-[#AADB56]" />
                                <h2 className="text-lg md:text-xl font-black text-[#1b3626]">פרטים אישיים</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                <div className="space-y-2">
                                    <Label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest pr-1">שם מלא</Label>
                                    <Input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="h-12 rounded-2xl text-base font-bold bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#AADB56]/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest pr-1">טלפון</Label>
                                    <Input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="h-12 rounded-2xl text-base font-bold bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#AADB56]/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest pr-1">אימייל</Label>
                                    <Input
                                        value={user.email}
                                        disabled
                                        className="h-12 rounded-2xl text-base font-bold bg-slate-100 border-slate-100 text-slate-400 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Address row */}
                            <div className="flex items-center gap-3 mb-6 border-r-4 border-[#AADB56] pr-4">
                                <MapPin className="w-5 h-5 text-[#AADB56]" />
                                <h2 className="text-lg md:text-xl font-black text-[#1b3626]">כתובת למשלוח</h2>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
                                <div className="space-y-2 col-span-1">
                                    <Label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest pr-1">עיר</Label>
                                    <Input
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="פתח תקווה"
                                        className="h-12 rounded-2xl text-base font-bold bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#AADB56]/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-2 col-span-1">
                                    <Label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest pr-1">רחוב</Label>
                                    <Input
                                        value={street}
                                        onChange={(e) => setStreet(e.target.value)}
                                        placeholder="הרצל"
                                        className="h-12 rounded-2xl text-base font-bold bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#AADB56]/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest pr-1">בית</Label>
                                    <Input
                                        value={houseNumber}
                                        onChange={(e) => setHouseNumber(e.target.value)}
                                        placeholder="12"
                                        className="h-12 rounded-2xl text-base font-bold bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#AADB56]/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest pr-1">קומה</Label>
                                    <Input
                                        value={floor}
                                        onChange={(e) => setFloor(e.target.value)}
                                        placeholder="3"
                                        className="h-12 rounded-2xl text-base font-bold bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#AADB56]/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400 font-bold text-[10px] uppercase tracking-widest pr-1">דירה</Label>
                                    <Input
                                        value={apartment}
                                        onChange={(e) => setApartment(e.target.value)}
                                        placeholder="5"
                                        className="h-12 rounded-2xl text-base font-bold bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#AADB56]/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Save row */}
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Button
                                    type="submit"
                                    disabled={updating}
                                    className="w-full sm:w-auto h-12 px-10 rounded-2xl text-base font-black bg-[#AADB56] hover:bg-[#1b3626] text-[#1b3626] hover:text-white transition-all shadow-lg shadow-lime-100"
                                >
                                    {updating ? <Loader2 className="animate-spin h-5 w-5" /> : (
                                        <span className="flex items-center gap-2"><Save className="w-4 h-4" />שמור שינויים</span>
                                    )}
                                </Button>
                                {saveSuccess && (
                                    <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold animate-in fade-in slide-in-from-right-4">
                                        <CheckCircle2 className="w-4 h-4" />
                                        הפרטים נשמרו בהצלחה!
                                    </div>
                                )}
                            </div>
                        </form>
                    </section>

                    {/* ─── Order History ─── */}
                    <section className="bg-white rounded-[32px] md:rounded-[40px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-200/60 overflow-hidden">
                        <div className="p-6 md:p-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 border-r-4 border-[#AADB56] pr-4">
                                    <ShoppingBag className="w-5 h-5 text-[#AADB56]" />
                                    <h2 className="text-lg md:text-2xl font-black text-[#1b3626]">היסטוריית הזמנות</h2>
                                </div>
                                <span className="bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{orders.length} הזמנות</span>
                            </div>
                        </div>

                        {orders.length === 0 ? (
                            <div className="px-6 py-12 md:px-10 md:py-20 text-center bg-slate-50/50">
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 rotate-3 group-hover:rotate-0 transition-transform">
                                    <ShoppingBag className="w-10 h-10 text-[#AADB56]" />
                                </div>
                                <h3 className="text-2xl font-black text-[#1b3626] mb-3 tracking-tighter">הסל שלכם מחכה להתמלא...</h3>
                                <p className="text-slate-400 font-bold mb-8 mx-auto max-w-sm text-sm leading-relaxed">
                                    נראה שעדיין לא ביצעתם הזמנות. זה הזמן להתחיל למלא את המטבח בפירות וירקות טריים מהחקלאי!
                                </p>
                                <Button asChild className="h-14 px-10 rounded-[20px] bg-[#112a1e] hover:bg-[#AADB56] text-white hover:text-[#112a1e] font-black transition-all shadow-xl hover:scale-105 active:scale-95">
                                    <Link href="/" className="flex items-center gap-3">
                                        <ShoppingBasket className="w-5 h-5" />
                                        להמשך קנייה וצבירת קופונים
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden md:block">
                                    <table className="w-full text-right">
                                        <thead>
                                            <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                                <th className="px-8 py-4">מספר</th>
                                                <th className="px-8 py-4">תאריך</th>
                                                <th className="px-8 py-4">סטטוס</th>
                                                <th className="px-8 py-4">סכום</th>
                                                <th className="px-8 py-4 text-left"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {orders.map((order) => (
                                                <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-8 py-5">
                                                        <span className="font-black text-[#1b3626] text-lg tracking-tighter">
                                                            #{(order.shipping_address as any)?.order_number || order.id.slice(0, 8)}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="text-[#1b3626] font-bold text-sm">{format(new Date(order.created_at), "dd/MM/yyyy")}</span>
                                                            <span className="text-slate-400 text-[10px] font-bold">{format(new Date(order.created_at), "HH:mm")}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">{renderStatusBadge(order.status)}</td>
                                                    <td className="px-8 py-5">
                                                        <span className="text-[#1b3626] font-black text-lg tracking-tighter">₪{order.total_price_estimated.toFixed(2)}</span>
                                                    </td>
                                                    <td className="px-8 py-5 text-left">
                                                        <Link
                                                            href={`/checkout/success?order_id=${order.id}`}
                                                            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-[#1b3626] hover:bg-[#AADB56] transition-all group-hover:scale-110"
                                                        >
                                                            <ChevronLeft className="w-5 h-5" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="md:hidden px-4 pb-4 space-y-3">
                                    {orders.map((order) => (
                                        <Link
                                            key={order.id}
                                            href={`/checkout/success?order_id=${order.id}`}
                                            className="block bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-[#AADB56] transition-all active:scale-[0.98]"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="font-black text-[#1b3626] text-base tracking-tighter">
                                                    #{(order.shipping_address as any)?.order_number || order.id.slice(0, 8)}
                                                </span>
                                                {renderStatusBadge(order.status)}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400 font-bold text-xs">
                                                    {format(new Date(order.created_at), "dd/MM/yyyy · HH:mm")}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[#1b3626] font-black text-lg tracking-tighter">₪{order.total_price_estimated.toFixed(2)}</span>
                                                    <ChevronLeft className="w-4 h-4 text-slate-300" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </section>

                    {/* ─── Logout + Support row ─── */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                        <Link
                            href="https://wa.me/972546637558"
                            target="_blank"
                            className="text-slate-400 hover:text-[#AADB56] text-sm font-bold transition-colors flex items-center gap-2"
                        >
                            <MessageCircle className="w-4 h-4" />
                            צריכים עזרה? דברו איתנו בוואטסאפ
                        </Link>
                        <button
                            onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
                            className="text-red-400 hover:text-red-600 text-sm font-bold transition-colors flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            התנתקות מהחשבון
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
}

function renderStatusBadge(status: string) {
    const configs: Record<string, { label: string, color: string, icon: any }> = {
        pending: { label: "בהמתנה", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
        paid: { label: "שולם", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
        preparing: { label: "בהכנה", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Package },
        shipping: { label: "בדרך אליך", color: "bg-purple-100 text-purple-700 border-purple-200", icon: Truck },
        completed: { label: "הושלם", color: "bg-[#AADB56]/20 text-[#1b3626] border-[#AADB56]/30", icon: CheckCircle2 },
        cancelled: { label: "בוטל", color: "bg-rose-100 text-rose-700 border-rose-200", icon: X },
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
        <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border", config.color)}>
            <Icon className="w-3 h-3" />
            {config.label}
        </span>
    );
}
