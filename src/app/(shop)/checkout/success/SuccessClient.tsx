'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MessageCircle, Home } from 'lucide-react';
import Link from 'next/link';

import Image from 'next/image';

const UNIT_LABELS: Record<string, string> = {
    kg: 'ק"ג',
    unit: "יח'",
    pack: "מארז",
};

interface SuccessClientProps {
    orderId: string;
    customerName: string;
    totalAmount: number;
    paymentMethod: string;
    isPickup?: boolean;
    items?: any[];
}

import { createClient } from '@/lib/supabase/client';

export default function SuccessClient({ orderId, customerName, totalAmount, paymentMethod, isPickup, items = [] }: SuccessClientProps) {
    const { clearCart } = useCart();
    const supabase = createClient();

    useEffect(() => {
        clearCart();

        // Broadcast new order event to admin panel
        const channel = supabase.channel('admin-orders-channel');
        channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await channel.send({
                    type: 'broadcast',
                    event: 'new-order',
                    payload: { 
                        id: orderId, 
                        customer_name: customerName, 
                        total_price_estimated: totalAmount 
                    },
                });
                console.log("📡 Broadcasted new order to admin");
            }
        });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [clearCart, orderId, customerName, totalAmount, supabase]);

    const baseUrl = process.env.NEXT_PUBLIC_WHATSAPP_LINK || "https://wa.me/972542236335";

    // Format payment method for display
    let paymentMethodDisplay = paymentMethod === 'paybox' ? 'פייבוקס' : (paymentMethod === 'bit' ? 'ביט' : 'מזומן');
    if (paymentMethod === 'cash' && isPickup) {
        paymentMethodDisplay = 'תשלום בקופה';
    }

    // Clean message format
    const message = `היי שוק בשכונה,
ביצעתי הזמנה מספר: ${orderId}
שם: ${customerName}
סכום: ${totalAmount.toFixed(2)} ש"ח
תשלום: ${paymentMethodDisplay}
${isPickup ? 'איסוף מהחנות' : 'משלוח'}
אשמח לאישור והכנה.`;

    const finalUrl = `${baseUrl}?text=${encodeURIComponent(message)}`;

    return (
        <div className="min-h-screen pt-0 pb-12 px-5 text-center flex flex-col items-center" dir="rtl">
            
            {/* Header / Icon */}
            <div className="mb-8 relative mt-2">
                <div className="absolute inset-0 bg-[#AADB56]/20 rounded-full blur-2xl animate-pulse scale-150"></div>
                <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md border-4 border-[#AADB56]/10">
                    <CheckCircle2 className="w-14 h-14 text-[#AADB56]" />
                </div>
            </div>

            {/* Main Content Card */}
            <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl border border-slate-200/50 p-8 md:p-10 space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#AADB56]/5 rounded-bl-[100px] -z-1" />
                
                <div className="space-y-3">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                        <div className="w-8 h-[2px] bg-[#AADB56]" />
                        <span className="text-[#AADB56] font-black text-[11px] uppercase tracking-widest">הזמנה הושלמה</span>
                        <div className="w-8 h-[2px] bg-[#AADB56]" />
                    </div>
                    <h1 className="text-3xl font-black text-[#1b3626] tracking-tighter leading-tight">תודה, {customerName}!</h1>
                    <p className="text-slate-500 font-bold text-sm">ההזמנה שלך התקבלה ונכנסת לעבודה.</p>
                </div>

                {/* Digital Receipt Card */}
                <div className="bg-slate-50 rounded-[32px] p-6 space-y-5 border border-slate-200/60 relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200/50">
                        <span className="text-[11px] font-black uppercase text-slate-500 tracking-widest">מספר הזמנה</span>
                        <span className="font-mono text-[#112a1e] font-bold bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
                            #{orderId.slice(0, 8)}
                        </span>
                    </div>

                    {/* Products List */}
                    {items.length > 0 && (
                        <div className="py-2 space-y-4 border-b border-slate-200/50">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-right">
                                    <div className="flex gap-3 items-center">
                                        <div className="relative w-10 h-10 shrink-0 bg-white rounded-lg overflow-hidden border border-slate-100 shadow-sm">
                                            {item.product.image_url ? (
                                                <Image 
                                                    src={item.product.image_url} 
                                                    alt={item.product.name} 
                                                    fill 
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-lg">🌿</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-start translate-x-1">
                                            <span className="font-bold text-[#112a1e] text-[14px] leading-tight">{item.product.name}</span>
                                            <span className="bg-[#112a1e]/5 text-[#112a1e] text-[9px] font-black px-1.5 py-0.5 rounded-md border border-slate-100 mt-1">
                                                {item.quantity} {UNIT_LABELS[item.product.unit_type] || "יח'"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between items-center pb-4 border-b border-slate-200/50">
                        <span className="text-[11px] font-black uppercase text-slate-500 tracking-widest">שיטת תשלום</span>
                        <span className="font-bold text-[#112a1e]">{paymentMethodDisplay}</span>
                    </div>

                    <div className="flex justify-between items-end pt-2">
                        <span className="text-[11px] font-black uppercase text-slate-500 tracking-widest mb-1.5">סה"כ לתשלום</span>
                        <div className="flex items-baseline text-[#112a1e]">
                            <span className="text-sm ml-1 font-black opacity-60">₪</span>
                            <span className="text-3xl font-black tracking-tighter leading-none">{totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Payment / WhatsApp Action */}
                <div className="space-y-4 pt-4">
                    {paymentMethod === 'paybox' && (
                        <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100 space-y-4 mb-4 animate-in fade-in slide-in-from-top-4">
                            <div className="space-y-1">
                                <h3 className="font-black text-[#0083DA] text-lg">תשלום ב-PayBox</h3>
                                <p className="text-slate-500 font-bold text-[13px]">
                                    לחצו על הכפתור כדי להשלים את התשלום
                                </p>
                            </div>
                            <Button
                                asChild
                                className="w-full h-14 bg-[#0083DA] hover:bg-[#0070bb] text-white font-black text-lg rounded-2xl shadow-md transition-all active:scale-95"
                            >
                                <a 
                                    href={`https://payboxapp.page.link/?link=https://payboxapp.com/pay?amount=${totalAmount.toFixed(2)}&phone=${process.env.NEXT_PUBLIC_PAYBOX_NUMBER || '0546637558'}&description=${encodeURIComponent('תשלום עבור הזמנה ' + orderId.slice(0, 8))}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    שלם עכשיו ב-PayBox (₪{totalAmount.toFixed(2)})
                                </a>
                            </Button>
                            <p className="text-[11px] text-slate-400 font-bold">
                                מספר טלפון להעברה ידנית: {process.env.NEXT_PUBLIC_PAYBOX_NUMBER || "054-663-7558"}
                            </p>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <h3 className="font-black text-[#112a1e] text-lg">שלב אחרון לסיום!</h3>
                        <p className="text-slate-500 font-bold text-[13px] leading-relaxed">
                            כדי שנתחיל להכין את ההזמנה, <br />
                            אנא שלח לנו הודעה ב-WhatsApp לאישור.
                        </p>
                    </div>

                    <Button
                        asChild
                        className="w-full h-16 bg-[#25D366] hover:bg-[#1b3626] text-white font-black text-lg rounded-[20px] shadow-lg shadow-green-500/10 transition-all hover:scale-[1.02] active:scale-95 group/wa"
                    >
                        <a href={finalUrl} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="ml-2 h-6 w-6 transition-transform group-hover/wa:rotate-12" />
                            לחץ לאישור ב-WhatsApp
                        </a>
                    </Button>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-10 flex items-center justify-center gap-6">
                <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-[#112a1e] font-black text-sm transition-colors group/home">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm group-hover/home:bg-[#AADB56]/10 group-hover/home:border-[#AADB56]/20 transition-all">
                        <Home className="w-4 h-4" />
                    </div>
                    חזרה לדף הבית
                </Link>
            </div>
        </div>
    );
}
