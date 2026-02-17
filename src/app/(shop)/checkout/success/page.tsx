import { createClient } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import SuccessClient from "./SuccessClient";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { Database } from "@/types/supabase";

export const dynamic = 'force-dynamic';

interface SuccessPageProps {
    searchParams: Promise<{
        order_id?: string;
    }>;
}

async function SuccessPageContent({ order_id }: { order_id: string }) {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
        return null;
    }

    const supabaseAdmin = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );

    // Fetch order details
    const { data: order, error } = await supabaseAdmin
        .from('orders')
        .select('id, customer_name, total_price_estimated, payment_method, shipping_address', { count: 'exact' })
        .eq('id', order_id)
        .single();

    if (error || !order) {
        console.error("Error fetching order:", error);
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
                <p className="text-xl font-bold text-slate-400">הזמנה לא נמצאה</p>
            </div>
        );
    }

    // Determine the ID to display (use order_number if available for Friendliness, else UUID)
    // Actually, UUID is safer for uniqueness in URL, but for display we might use order_number if we had it easily.
    // The prompt asked for [order_id] in the message. I will use the one passed in URL which is the UUID usually, 
    // or maybe the random 8 digit one if I can access it.
    // The previous code generated an 8 digit order_number in shipping_address.
    // Let's try to use that for the message if possible, otherwise UUID.

    const orderNumber = (order.shipping_address as any)?.order_number || order.id.slice(0, 8);
    const displayId = (order.shipping_address as any)?.order_number || order.id;

    return (
        <SuccessClient
            orderId={displayId}
            customerName={order.customer_name || 'לקוח'}
            totalAmount={order.total_price_estimated}
            paymentMethod={order.payment_method || 'cash'}
        />
    );
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
    const { order_id } = await searchParams;

    if (!order_id) {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center">
            <Suspense fallback={<Loader2 className="w-10 h-10 animate-spin text-green-600" />}>
                <SuccessPageContent order_id={order_id} />
            </Suspense>
        </div>
    );
}
