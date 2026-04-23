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

import { redirect } from 'next/navigation';

export async function submitOrder(orderData: any, orderItems: any[]) {
    let orderId = null;

    try {
        // 1. Strict Validation: Reject coupons for guests
        const isGuest = !orderData.user_id;
        let finalShippingAddress = { ...orderData.shipping_address };
        let finalTotalPrice = orderData.total_price_estimated;

        if (isGuest && finalShippingAddress.coupon_code) {
            // Revert discount for guests trying to bypass frontend
            const discountAmount = finalShippingAddress.discount_amount || 0;
            finalTotalPrice += discountAmount;
            finalShippingAddress.coupon_code = null;
            finalShippingAddress.discount_amount = 0;
        }

        // 2. Create Order
        const { data: order, error: orderError } = await supabaseAdmin
            .from("orders")
            .insert({
                ...orderData,
                total_price_estimated: finalTotalPrice,
                // Add friendly order number to shipping_address
                shipping_address: {
                    ...finalShippingAddress,
                    order_number: Math.floor(10000000 + Math.random() * 90000000).toString() // 8-digit random number
                }
            })
            .select()
            .single();

        if (orderError) throw new Error(`Order creation failed: ${orderError.message}`);

        // 3. Update User Profile (Persistence)
        if (orderData.user_id && orderData.delivery_method === 'delivery') {
            const { city, street, house, apt, floor, fullName, phone } = finalShippingAddress;
            await supabaseAdmin
                .from("profiles")
                .update({
                    full_name: fullName,
                    phone: phone,
                    default_address: { city, street, houseNumber: house, apartment: apt, floor }
                })
                .eq("id", orderData.user_id);
        }

        // 4. Prepare Order Items with the new Order ID
        const itemsWithOrderId = orderItems.map((item: any) => ({
            ...item,
            order_id: order.id
        }));

        // 5. Insert Order Items
        const { error: itemsError } = await supabaseAdmin
            .from("order_items")
            .insert(itemsWithOrderId);

        if (itemsError) {
            console.error("Order items failed:", itemsError);
            throw new Error(`Order items creation failed: ${itemsError.message}`);
        }

        orderId = order.id;

    } catch (error: any) {
        console.error("Server Action Error:", error);
        return { success: false, error: error.message };
    }

    if (orderId) {
        redirect(`/checkout/success?order_id=${orderId}`);
    }

    return { success: false, error: "Unknown error" };
}
