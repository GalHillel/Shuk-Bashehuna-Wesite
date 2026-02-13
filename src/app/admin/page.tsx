"use client";

import { supabase } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { Package, ShoppingCart, FolderTree, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
    totalProducts: number;
    activeProducts: number;
    totalCategories: number;
    totalOrders: number;
    pendingOrders: number;
    lowStockProducts: { id: string; name: string; stock_quantity: number }[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        setLoading(true);

        const [productsRes, categoriesRes, ordersRes, lowStockRes] = await Promise.all([
            supabase.from("products").select("id, is_active"),
            supabase.from("categories").select("id"),
            supabase.from("orders").select("id, status"),
            supabase.from("products").select("id, name, stock_quantity").lt("stock_quantity", 10).eq("is_active", true).order("stock_quantity", { ascending: true }).limit(5),
        ]);

        setStats({
            totalProducts: productsRes.data?.length || 0,
            activeProducts: productsRes.data?.filter((p: { is_active: boolean }) => p.is_active).length || 0,
            totalCategories: categoriesRes.data?.length || 0,
            totalOrders: ordersRes.data?.length || 0,
            pendingOrders: ordersRes.data?.filter((o: { status: string }) => o.status === "pending").length || 0,
            lowStockProducts: (lowStockRes.data as DashboardStats["lowStockProducts"]) || [],
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border shadow-sm animate-pulse">
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
        {
            label: "מוצרים במלאי נמוך",
            value: stats?.lowStockProducts.length || 0,
            sub: "דורשים תשומת לב",
            icon: AlertCircle,
            color: "text-orange-600 bg-orange-50",
            href: "/admin/products",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">לוח בקרה</h1>
                <p className="text-muted-foreground mt-1">שוק בשכונה - סקירה כללית</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link key={card.label} href={card.href}>
                            <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
                                    <div className={`p-2 rounded-lg ${card.color}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </div>
                                <p className="text-3xl font-bold">{card.value}</p>
                                <p className="text-sm text-muted-foreground mt-1">{card.sub}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Low Stock Alert */}
            {stats && stats.lowStockProducts.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-orange-800 flex items-center gap-2 mb-4">
                        <AlertCircle className="h-5 w-5" />
                        מוצרים עם מלאי נמוך
                    </h3>
                    <div className="space-y-2">
                        {stats.lowStockProducts.map((p) => (
                            <Link key={p.id} href={`/admin/products/${p.id}`} className="flex items-center justify-between text-sm py-2 px-3 bg-white rounded-lg hover:bg-orange-100 transition-colors">
                                <span className="font-medium">{p.name}</span>
                                <span className="text-orange-600 font-bold">{p.stock_quantity} יח&apos;</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/products/new" className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-all text-center">
                    <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">הוסף מוצר חדש</p>
                </Link>
                <Link href="/admin/content" className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-all text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">ערוך דף הבית</p>
                </Link>
                <Link href="/admin/orders" className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-all text-center">
                    <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">צפה בהזמנות</p>
                </Link>
            </div>
        </div>
    );
}
