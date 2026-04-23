"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { Package, ShoppingCart, FolderTree, TrendingUp, AlertCircle, FileText, Plus } from "lucide-react";
import Link from "next/link";

import { AdminHeader } from "@/components/admin/AdminHeader";

interface DashboardStats {
    totalProducts: number;
    activeProducts: number;
    totalCategories: number;
    totalOrders: number;
    pendingOrders: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        setLoading(true);

        const [productsRes, categoriesRes, ordersRes] = await Promise.all([
            supabase.from("products").select("id, is_active"),
            supabase.from("categories").select("id"),
            supabase.from("orders").select("id, status"),
        ]);

        setStats({
            totalProducts: productsRes.data?.length || 0,
            activeProducts: productsRes.data?.filter((p: { is_active: boolean }) => p.is_active).length || 0,
            totalCategories: categoriesRes.data?.length || 0,
            totalOrders: ordersRes.data?.length || 0,
            pendingOrders: ordersRes.data?.filter((o: { status: string }) => o.status === "pending").length || 0,
        });
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <AdminHeader 
                    title="לוח בקרה" 
                    description="שוק בשכונה - סקירה כללית" 
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm animate-pulse h-48">
                            <div className="h-4 bg-slate-100 rounded-full w-24 mb-6" />
                            <div className="h-12 bg-slate-100 rounded-2xl w-20 mb-4" />
                            <div className="h-3 bg-slate-100 rounded-full w-32" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const cards = [
        {
            label: "מוצרים",
            value: stats?.totalProducts || 0,
            sub: `${stats?.activeProducts || 0} פעילים במערכת`,
            icon: Package,
            color: "text-blue-600 bg-blue-50/50",
            href: "/admin/products",
        },
        {
            label: "קטגוריות",
            value: stats?.totalCategories || 0,
            sub: "ניהול קטגוריות ותפריטים",
            icon: FolderTree,
            color: "text-green-600 bg-green-50/50",
            href: "/admin/categories",
        },
        {
            label: "הזמנות",
            value: stats?.totalOrders || 0,
            sub: `${stats?.pendingOrders || 0} ממתינות לטיפול`,
            icon: ShoppingCart,
            color: "text-purple-600 bg-purple-50/50",
            href: "/admin/orders",
        },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <AdminHeader 
                title="לוח בקרה" 
                description="ברוך הבא! הנה סקירה מהירה של מה שקורה בחנות שלך היום." 
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link key={card.label} href={card.href} className="w-full">
                            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer group relative overflow-hidden h-full">
                                <div className="absolute top-0 left-0 w-32 h-32 bg-[#AADB56]/5 rounded-br-[100px] -ml-8 -mt-8 group-hover:bg-[#AADB56]/10 transition-colors" />
                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{card.label}</span>
                                    <div className={`p-4 rounded-2xl ${card.color} shadow-sm group-hover:rotate-12 transition-transform`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                </div>
                                <p className="text-6xl font-black text-slate-800 tracking-tighter mb-2 relative z-10">{card.value}</p>
                                <p className="text-xs font-bold text-slate-400 flex items-center gap-2 relative z-10">
                                    <span className="w-2 h-2 rounded-full bg-[#AADB56] animate-pulse" />
                                    {card.sub}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-800 mr-2">פעולות מהירות</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link href="/admin/products/new" className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:border-[#AADB56] hover:bg-[#AADB56]/5 transition-all text-center flex flex-col items-center justify-center gap-4 group">
                        <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-white transition-colors">
                            <Plus className="h-6 w-6 text-[#6c9b29]" />
                        </div>
                        <p className="font-black text-slate-700 text-sm">הוסף מוצר</p>
                    </Link>
                    <Link href="/admin/orders" className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:border-purple-200 hover:bg-purple-50/30 transition-all text-center flex flex-col items-center justify-center gap-4 group">
                        <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-white transition-colors">
                            <ShoppingCart className="h-6 w-6 text-purple-500" />
                        </div>
                        <p className="font-black text-slate-700 text-sm">טפל בהזמנות</p>
                    </Link>
                    <Link href="/admin/coupons" className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:border-orange-200 hover:bg-orange-50/30 transition-all text-center flex flex-col items-center justify-center gap-4 group">
                        <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-white transition-colors">
                            <TrendingUp className="h-6 w-6 text-orange-500" />
                        </div>
                        <p className="font-black text-slate-700 text-sm">צור קופון</p>
                    </Link>
                    <Link href="/admin/content" className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:border-blue-200 hover:bg-blue-50/30 transition-all text-center flex flex-col items-center justify-center gap-4 group">
                        <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-white transition-colors">
                            <FileText className="h-6 w-6 text-blue-500" />
                        </div>
                        <p className="font-black text-slate-700 text-sm">עריכת תוכן</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
