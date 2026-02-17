'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MessageCircle, Home } from 'lucide-react';
import Link from 'next/link';

interface SuccessClientProps {
    orderId: string;
    customerName: string;
    totalAmount: number;
    paymentMethod: string;
}

export default function SuccessClient({ orderId, customerName, totalAmount, paymentMethod }: SuccessClientProps) {
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    const baseUrl = process.env.NEXT_PUBLIC_WHATSAPP_LINK || "https://wa.me/972542236335";

    // Format payment method for display
    const paymentMethodDisplay = paymentMethod === 'bit' ? 'ביט' : 'מזומן';

    // Clean message format
    const message = `היי שוק בשכונה,
ביצעתי הזמנה מספר: ${orderId}
שם: ${customerName}
סכום: ${totalAmount.toFixed(2)} ש"ח
תשלום: ${paymentMethodDisplay}
אשמח לאישור והכנה.`;

    const finalUrl = `${baseUrl}?text=${encodeURIComponent(message)}`;

    return (
        <div className="max-w-md mx-auto p-6 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Icon */}
            <div className="flex justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <CheckCircle2 className="w-24 h-24 text-green-600 relative z-10 drop-shadow-sm" />
                </div>
            </div>

            {/* Texts */}
            <div className="space-y-2">
                <h1 className="text-3xl font-black text-slate-900">ההזמנה התקבלה בהצלחה!</h1>
                <p className="text-lg text-slate-500 font-medium">
                    מספר הזמנה: <span className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded mx-1">#{orderId.slice(0, 8)}</span>
                </p>
            </div>

            {/* Action Box */}
            <div className="bg-green-50/80 border border-green-100 p-6 rounded-2xl shadow-sm space-y-4">
                <div className="space-y-1">
                    <h3 className="font-bold text-green-900 text-lg">שלב אחרון לסיום!</h3>
                    <p className="text-green-700 text-sm leading-relaxed">
                        כדי שנתחיל להכין את ההזמנה, <br />
                        אנא שלח לנו הודעה ב-WhatsApp לאישור.
                    </p>
                </div>

                <Button
                    asChild
                    className="w-full h-14 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-lg rounded-xl shadow-lg shadow-green-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <a href={finalUrl} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="ml-2 h-6 w-6" />
                        לחץ לאישור ב-WhatsApp
                    </a>
                </Button>
            </div>

            {/* Footer */}
            <div className="pt-4">
                <Button variant="ghost" className="text-slate-400 hover:text-slate-600" asChild>
                    <Link href="/">
                        <Home className="ml-2 h-4 w-4" />
                        חזרה לדף הבית
                    </Link>
                </Button>
            </div>
        </div>
    );
}
