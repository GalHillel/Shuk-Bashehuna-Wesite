import { createClient as createClientBase } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use globalThis to survive Next.js HMR (hot module reloading)
// Without this, each HMR cycle creates a new GoTrue client that fights
// over the navigator.locks API → "AbortError: signal is aborted without reason"
const globalKey = '__supabase_client__' as const;

function getSupabaseClient() {
    if (typeof window !== 'undefined') {
        // Browser: store on window to survive HMR
        const win = window as unknown as Record<string, unknown>;
        if (win[globalKey]) {
            return win[globalKey] as ReturnType<typeof createClientBase<Database>>;
        }
        const client = createClientBase<Database>(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
                // Use 'pkce' flow which is more stable with locks
                flowType: 'pkce',
            },
        });
        win[globalKey] = client;
        return client;
    }

    // Server-side: create fresh instance each time (no lock issues on server)
    return createClientBase<Database>(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
}

export const createClient = getSupabaseClient;
export const supabase = getSupabaseClient();
