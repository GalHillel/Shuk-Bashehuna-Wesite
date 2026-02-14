"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function SessionDebugger() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false);
            console.log("Client Session:", data.session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            console.log("Auth Change:", _event, session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (process.env.NODE_ENV === "production") return null;

    return (
        <div className="fixed bottom-4 left-4 z-50 p-4 bg-black/80 text-white text-xs rounded-lg max-w-sm overflow-auto max-h-48" dir="ltr">
            <h3 className="font-bold mb-2">Session Debugger</h3>
            {loading ? (
                <p>Loading session...</p>
            ) : (
                <pre>{JSON.stringify(session ? {
                    user: session.user.email,
                    exp: session.expires_at,
                    role: session.user.role
                } : "No Session", null, 2)}</pre>
            )}
        </div>
    );
}
