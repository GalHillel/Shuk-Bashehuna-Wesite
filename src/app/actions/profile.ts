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

export async function registerUser(userData: {
    email: string;
    password: string;
    full_name: string;
    phone: string;
    marketing_opt_in: boolean;
}) {
    try {
        // 1. Create User in Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: userData.email,
            password: userData.password,
            email_confirm: true, // Automatically confirm email to avoid rate limits
            user_metadata: { full_name: userData.full_name }
        });

        if (authError) {
            console.error("Auth Creation Error:", authError);
            return { success: false, error: authError.message };
        }

        if (authData.user) {
            // 2. Create Profile
            const { error: profileError } = await supabaseAdmin
                .from("profiles")
                .upsert({
                    id: authData.user.id,
                    full_name: userData.full_name,
                    phone: userData.phone,
                    marketing_opt_in: userData.marketing_opt_in,
                    is_admin: false,
                });

            if (profileError) {
                console.error("Profile Sync Error:", profileError);
                return { success: false, error: profileError.message };
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error("Server Action Exception:", error);
        return { success: false, error: error.message };
    }
}
