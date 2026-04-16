import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/supabase";
import { deleteImageFromStorage } from "@/lib/storage-utils";

export type DeletionResult = 
  | { type: 'deleted' } 
  | { type: 'deactivated' } 
  | { type: 'error'; message: string };

/**
 * Performs a safe deletion of a product.
 * 1. Checks if the product is associated with any orders.
 * 2. If it has orders, sets is_active = false (deactivation).
 * 3. If no orders, cleans up storage and deletes the database record (absolute removal).
 */
export async function safeDeleteProduct(product: Product): Promise<DeletionResult> {
    const supabase = createClient();

    try {
        // 1. Safety Check: Check for existing orders
        const { data: items, error: checkError } = await supabase
            .from("order_items")
            .select("id")
            .eq("product_id", product.id)
            .limit(1);

        if (checkError) {
            return { type: 'error', message: "שגיאה בבדיקת היסטוריית הזמנות: " + checkError.message };
        }

        if (items && items.length > 0) {
            // Product has orders: Deactivate instead
            const { error: updateError } = await supabase
                .from("products")
                .update({ is_active: false })
                .eq("id", product.id);

            if (updateError) {
                return { type: 'error', message: "שגיאה בעדכון סטטוס המוצר: " + updateError.message };
            }
            
            return { type: 'deactivated' };
        }

        // 2. Absolute Deletion: No orders found
        if (product.image_url) {
            // Attempt to cleanup storage (fails gracefully inside utility)
            await deleteImageFromStorage(product.image_url);
        }

        const { error: deleteError } = await supabase
            .from("products")
            .delete()
            .eq("id", product.id);

        if (deleteError) {
            return { type: 'error', message: "שגיאה במחיקת המוצר מהמערכת: " + deleteError.message };
        }

        return { type: 'deleted' };
    } catch (err: any) {
        console.error("Error in safeDeleteProduct service:", err);
        return { type: 'error', message: err.message || "אירעה שגיאה בלתי צפויה בתהליך המחיקה" };
    }
}
