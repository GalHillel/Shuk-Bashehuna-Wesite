'use server'

import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

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

export async function submitOrder(orderData: any, orderItems: any[]) {
    try {
        // 1. Create Order
        const { data: order, error: orderError } = await supabaseAdmin
            .from("orders")
            .insert({
                ...orderData,
                // Add friendly order number to shipping_address
                shipping_address: {
                    ...orderData.shipping_address,
                    order_number: Math.floor(10000000 + Math.random() * 90000000).toString() // 8-digit random number
                }
            })
            .select()
            .single();

        if (orderError) throw new Error(`Order creation failed: ${orderError.message}`);

        // 2. Prepare Order Items with the new Order ID
        const itemsWithOrderId = orderItems.map((item: any) => ({
            ...item,
            order_id: order.id
        }));

        // 3. Insert Order Items
        const { error: itemsError } = await supabaseAdmin
            .from("order_items")
            .insert(itemsWithOrderId);

        if (itemsError) {
            // Optional: Delete the order if items fail? 
            // For now, just throw, but in production consider cleanup.
            console.error("Order items failed:", itemsError);
            throw new Error(`Order items creation failed: ${itemsError.message}`);
        }

        return {
            success: true,
            orderId: order.id,
            orderNumber: (order.shipping_address as any)?.order_number
        };

    } catch (error: any) {
        console.error("Server Action Error:", error);
        return { success: false, error: error.message };
    }
}
