"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Store } from "lucide-react";
import { SessionDebugger } from "@/components/SessionDebugger";

function LoginForm() {
    const { signIn } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Get return URL from query params if exists, default to /admin
    const returnUrl = searchParams.get("returnUrl") || "/admin";

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

        // Success - redirect
        router.refresh(); // Refresh server components

        // Use a small timeout to allow the cookie to propagate if needed, though refresh should handle it.
        // We'll trust next/navigation for now but ensure we default correctly.
        const targetUrl = returnUrl || "/admin";
        console.log("Redirecting to:", targetUrl);
        router.push(targetUrl);
    }

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-green-500/20 shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                    <Store className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">ברוכים הבאים</h1>
                <p className="text-gray-500">התחברו לפאנל הניהול של שוק בשכונה</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center font-medium animate-in fade-in slide-in-from-top-2">
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
                        placeholder="mail@example.com"
                        className="h-12 rounded-xl text-base bg-gray-50 border-gray-200 focus:bg-white transition-colors"
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
                        className="h-12 rounded-xl text-base bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        dir="ltr"
                        required
                    />
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl text-base font-bold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    {loading ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                        "התחבר למערכת"
                    )}
                </Button>
            </form>

            <div className="mt-8 text-center">
                <Link href="/" className="text-sm text-gray-400 hover:text-green-600 transition-colors">
                    חזרה לדף הבית
                </Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4" dir="rtl">
            <Suspense fallback={<Loader2 className="h-10 w-10 animate-spin text-green-600" />}>
                <LoginForm />
                <SessionDebugger />
            </Suspense>
        </div>
    );
}
