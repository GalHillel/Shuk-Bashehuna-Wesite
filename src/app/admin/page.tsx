"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { Package, ShoppingCart, FolderTree, TrendingUp, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";

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
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">לוח בקרה</h1>
                <div className="flex flex-wrap justify-center gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border shadow-sm animate-pulse w-[240px]">
                            <div className="h-4 bg-slate-200 rounded w-24 mb-4" />
                            <div className="h-8 bg-slate-200 rounded w-16" />
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
            sub: `${stats?.activeProducts || 0} פעילים`,
            icon: Package,
            color: "text-blue-600 bg-blue-50",
            href: "/admin/products",
        },
        {
            label: "קטגוריות",
            value: stats?.totalCategories || 0,
            sub: "קטגוריות פעילות",
            icon: FolderTree,
            color: "text-green-600 bg-green-50",
            href: "/admin/categories",
        },
        {
            label: "הזמנות",
            value: stats?.totalOrders || 0,
            sub: `${stats?.pendingOrders || 0} ממתינות`,
            icon: ShoppingCart,
            color: "text-purple-600 bg-purple-50",
            href: "/admin/orders",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">לוח בקרה</h1>
                <p className="text-muted-foreground mt-1">שוק בשכונה - סקירה כללית</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link key={card.label} href={card.href} className="w-full">
                            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:border-[#AADB56]/30 transition-all cursor-pointer group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#AADB56]/5 rounded-bl-[100px] -mr-8 -mt-8 group-hover:bg-[#AADB56]/10 transition-colors" />
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-sm font-black text-slate-400 uppercase tracking-wider">{card.label}</span>
                                    <div className={`p-3 rounded-2xl ${card.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                </div>
                                <p className="text-5xl font-black text-slate-800 tracking-tight">{card.value}</p>
                                <p className="text-sm font-bold text-slate-400 mt-2 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#AADB56]" />
                                    {card.sub}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>


            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/admin/products/new" className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:scale-[1.02] transition-all text-center flex flex-col items-center justify-center gap-2 group">
                    <div className="bg-[#AADB56]/10 p-4 rounded-2xl group-hover:bg-[#AADB56]/20 transition-colors">
                        <Package className="h-8 w-8 text-[#6c9b29]" />
                    </div>
                    <p className="font-black text-slate-800">הוסף מוצר חדש</p>
                </Link>
                <Link href="/admin/content" className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:scale-[1.02] transition-all text-center flex flex-col items-center justify-center gap-2 group">
                    <div className="bg-blue-50 p-4 rounded-2xl group-hover:bg-blue-100 transition-colors">
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="font-black text-slate-800">ערוך דף הבית</p>
                </Link>
                <Link href="/admin/orders" className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:scale-[1.02] transition-all text-center flex flex-col items-center justify-center gap-2 group">
                    <div className="bg-purple-50 p-4 rounded-2xl group-hover:bg-purple-100 transition-colors">
                        <ShoppingCart className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="font-black text-slate-800">ניהול הזמנות</p>
                </Link>
            </div>
        </div>
    );
}
