"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";

export function useAuth() {
    // Memoize the client so it doesn't recreate on every render, 
    // though createBrowserClient is cheap.
    const supabase = useMemo(() => createClient(), []);

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    useEffect(() => {
        let mounted = true;

        const getUser = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (mounted) {
                    if (error) {
                        console.error("Auth Error:", error);
                    }
                    setUser(session?.user ?? null);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Unexpected Auth Error:", err);
                if (mounted) setLoading(false);
            }
        };

        getUser();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            if (mounted) {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [supabase]);

    const signIn = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error };
    }, [supabase]);

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        setUser(null);
    }, [supabase]);

    return { user, isAdmin, loading, signIn, signOut };
}
