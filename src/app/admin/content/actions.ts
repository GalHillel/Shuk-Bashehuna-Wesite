'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidateHomepage } from "@/app/actions/revalidate";

// Initialize Admin Client with Service Role Key to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }

)

export async function deleteContentBlock(id: number) {
    try {
        const { error } = await supabaseAdmin
            .from('content_blocks')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting block:', error);
            return { success: false, error: error.message };
        }

        await revalidateHomepage();
        return { success: true };
    } catch (error: any) {
        console.error('Unexpected error deleting block:', error);
        return { success: false, error: error.message };
    }
}
