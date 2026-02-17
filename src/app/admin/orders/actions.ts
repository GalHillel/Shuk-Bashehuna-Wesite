'use server'

import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { revalidatePath } from 'next/cache'

// Initialize Admin Client
const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

export async function deleteOrder(orderId: string) {
    try {
        console.log(`[Admin] Deleting order: ${orderId}`);

        // 1. Delete Order Items (Foreign Key usually cascades, but let's be explicit/safe)
        const { error: itemsError } = await supabaseAdmin
            .from("order_items")
            .delete()
            .eq("order_id", orderId);

        if (itemsError) {
            console.error("[Admin] Error deleting items:", itemsError);
            // Verify if we should stop here. Usually if items fail, order delete will fail too via FK.
            // But sometimes specific RLS might block items.
            // Let's proceed to try deleting the order, or return error?
            // Safer to return error.
            throw new Error(`Failed to delete order items: ${itemsError.message}`);
        }

        // 2. Delete Order
        const { error: orderError } = await supabaseAdmin
            .from("orders")
            .delete()
            .eq("id", orderId);

        if (orderError) {
            console.error("[Admin] Error deleting order:", orderError);
            throw new Error(`Failed to delete order: ${orderError.message}`);
        }

        revalidatePath('/admin/orders');
        return { success: true };

    } catch (error: any) {
        console.error("[Admin] Delete Operation Failed:", error);
        return { success: false, error: error.message };
    }
}
