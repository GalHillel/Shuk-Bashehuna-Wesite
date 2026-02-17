import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileHeader } from "@/components/admin/AdminMobileHeader";
import { AdminRealtimeListener } from "@/components/admin/AdminRealtimeListener";
import { Toaster } from "sonner";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Init Supabase (Server Side)
    const supabase = await createClient();

    // 2. Get User
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 3. Gatekeeper: No User -> Login
    if (!user) {
        redirect("/login?returnUrl=/admin");
    }

    // 4. Check Admin Status
    // Priority: DB Profile -> Env Var Fallback
    let isAdmin = false;

    // Check DB Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

    if (profile?.is_admin) {
        isAdmin = true;
    } else {
        // Fallback to Env Var (for initial bootstrap or dev)
        const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";
        if (user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            isAdmin = true;
        }
    }

    // 5. Gatekeeper: Not Admin -> Home
    if (!isAdmin) {
        redirect("/");
    }

    // 6. Access Granted
    return (
        <div className="min-h-screen bg-gray-50 flex" dir="rtl">
            <AdminRealtimeListener />
            <Toaster position="top-center" richColors />

            {/* Desktop Sidebar */}
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-h-screen md:mr-64 transition-all duration-300">
                {/* Mobile Header */}
                <AdminMobileHeader />

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 md:space-y-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
