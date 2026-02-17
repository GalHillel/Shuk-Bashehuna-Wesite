"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Volume2, VolumeX } from "lucide-react";

export function AdminRealtimeListener() {
    const [isAudioBlocked, setIsAudioBlocked] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        // Initialize Audio once
        if (typeof window !== "undefined") {
            audioRef.current = new Audio("/sounds/notification.mp3");
        }
    }, []);

    const playNotificationSound = async () => {
        if (!audioRef.current) return;
        try {
            audioRef.current.currentTime = 0;
            await audioRef.current.play();
            setIsAudioBlocked(false);
        } catch (error) {
            setIsAudioBlocked(true);
        }
    };

    useEffect(() => {
        const channel = supabase
            .channel('admin-orders-channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'orders',
                },
                (payload) => {
                    // 1. Play Sound (safely)
                    playNotificationSound();

                    // 2. Show Toast Notification
                    const newOrder = payload.new as any;
                    toast.success(`הזמנה חדשה נכנסה!`, {
                        description: `סכום: ₪${newOrder.total_price_estimated?.toFixed(2) || '0.00'} | לקוח: ${newOrder.customer_name}`,
                        duration: 5000,
                        action: {
                            label: "צפה בהזמנה",
                            onClick: () => router.push(`/admin/orders`),
                        },
                    });

                    // 3. Refresh Data
                    router.refresh();
                }
            )
            .subscribe();

        // Cleanup
        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, router]);

    // If audio is blocked, show a manual trigger button
    if (isAudioBlocked) {
        return (
            <div className="fixed bottom-6 left-6 z-[100] flex items-center gap-4 rounded-xl bg-red-600/90 backdrop-blur-md px-4 py-3 text-white shadow-lg animate-in slide-in-from-bottom-5 border border-red-500">
                <VolumeX className="h-6 w-6 animate-pulse" />
                <div className="flex flex-col">
                    <span className="font-bold text-sm">הסאונד מושתק</span>
                    <span className="text-xs opacity-90">הדפדפן חסם את ההתראה</span>
                </div>
                <button
                    onClick={() => playNotificationSound()}
                    className="mr-2 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-bold hover:bg-white/30 transition-colors"
                >
                    הפעל סאונד
                </button>
            </div>
        );
    }

    return null;
}
