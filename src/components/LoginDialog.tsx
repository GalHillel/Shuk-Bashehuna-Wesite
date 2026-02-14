"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";

interface LoginDialogProps {
    open: boolean;
    onClose: () => void;
}

export function LoginDialog({ open, onClose }: LoginDialogProps) {
    const { signIn } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { error: signInError } = await signIn(email, password);

        if (signInError) {
            if (signInError.message.includes("Invalid login")) {
                setError("אימייל או סיסמה שגויים");
            } else if (signInError.message.includes("rate")) {
                setError("יותר מדי ניסיונות, נסה שוב בעוד דקה");
            } else {
                setError("שגיאה בהתחברות: " + signInError.message);
            }
            setLoading(false);
            return;
        }

        // Refresh the router to update server components and middleware with the new session
        router.refresh();

        // Check if admin (Sync with Admin Layout Logic)
        let isAdmin = false;
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";

        // 1. Check Env Var
        if (email.toLowerCase() === adminEmail.toLowerCase()) {
            isAdmin = true;
        }

        // 2. Check DB Profile (if not already admin from env)
        if (!isAdmin) {
            // We need to get the user to get the ID, but we just signed in. 
            // We can check the session from the signIn result if returned, but useAuth just returns error.
            // We'll rely on a quick fetch.
            const { data: { user } } = await import("@/lib/supabase/client").then(m => m.supabase.auth.getUser());
            if (user) {
                const { data: profile } = await import("@/lib/supabase/client").then(m => m.supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('id', user.id)
                    .single());
                if (profile?.is_admin) {
                    isAdmin = true;
                }
            }
        }

        if (isAdmin) {
            router.push("/admin");
        } else {
            // If not admin, just close the dialog (user is now logged in)
            onClose();
        }

        setLoading(false);
        // If we found they are admin, we pushed. 
        // We can close the dialog now or let it close on navigation. 
        // Closing it makes it feel snappier.
        if (isAdmin) {
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" dir="rtl">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute left-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl text-white">🏪</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">התחברות</h2>
                    <p className="text-gray-500 text-sm mt-1">שוק בשכונה — פאנל ניהול</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">אימייל</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="h-12 rounded-xl text-base"
                            dir="ltr"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">סיסמה</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="h-12 rounded-xl text-base"
                            dir="ltr"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl text-base font-bold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                            "התחבר"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
