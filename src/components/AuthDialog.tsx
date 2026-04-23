"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X, User, Mail, Lock, Phone, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase/client";
import { registerUser } from "@/app/actions/profile";

interface AuthDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
    const { signIn } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [marketingOptIn, setMarketingOptIn] = useState(true);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"login" | "register">("login");

    const [isSuccess, setIsSuccess] = useState(false);

    if (!open) return null;

    async function handleLogin(e: React.FormEvent) {
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

        router.refresh();
        onOpenChange(false);
        setLoading(false);
    }

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        // 1. Create User and Profile via Server Action (bypasses email rate limits)
        const result = await registerUser({
            email,
            password,
            full_name: fullName,
            phone: phone,
            marketing_opt_in: marketingOptIn,
        });

        if (!result.success) {
            setError("שגיאה בהרשמה: " + result.error);
            setLoading(false);
            return;
        }

        // 2. Automatically log them in
        const { error: loginError } = await signIn(email, password);
        
        if (loginError) {
            console.error("Auto-login error:", loginError);
            // We don't block success, just ask them to login manually
        }

        setLoading(false);
        setIsSuccess(true);
        router.refresh();

        // Close after 3 seconds
        setTimeout(() => {
            onOpenChange(false);
            setIsSuccess(false);
            setActiveTab("login");
        }, 3000);
    }

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir="rtl">
                <div className="absolute inset-0 bg-[#1b3626]/40 backdrop-blur-md" />
                <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden p-10 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-[#AADB56] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-lime-100 animate-bounce">
                        <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={3} />
                    </div>
                    <h2 className="text-3xl font-black text-[#1b3626] mb-4">ברוכים הבאים למשפחה!</h2>
                    <p className="text-slate-500 font-bold text-lg mb-2">נרשמת בהצלחה לשוק בשכונה.</p>
                    <p className="text-[#AADB56] font-black italic">התוצרת הטרייה ביותר כבר בדרך אליכם...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir="rtl">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#1b3626]/40 backdrop-blur-md" onClick={() => onOpenChange(false)} />

            {/* Dialog */}
            <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute left-6 top-6 text-slate-400 hover:text-slate-600 transition-colors z-10 p-2 hover:bg-slate-50 rounded-full"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="p-8 pt-10">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#AADB56] to-[#6c9b29] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-lime-100">
                            <span className="text-3xl text-white">🌿</span>
                        </div>
                        <h2 className="text-3xl font-black text-[#1b3626] tracking-tighter">
                            {activeTab === "login" ? "ברוכים השבים" : "הצטרפו אלינו"}
                        </h2>
                        <p className="text-slate-500 font-bold text-sm mt-1">
                            {activeTab === "login" ? "התחברו לחשבון שלכם בשוק בשכונה" : "הרשמו כדי להנות ממבצעים ומהתוצרת הטובה ביותר"}
                        </p>
                    </div>

                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 h-14 bg-slate-50 p-1 rounded-[24px] mb-8">
                            <TabsTrigger value="login" className="rounded-[20px] font-black text-sm data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-[#1b3626]">התחברות</TabsTrigger>
                            <TabsTrigger value="register" className="rounded-[20px] font-black text-sm data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-[#1b3626]">הרשמה</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-5">
                                {error && ( activeTab === "login" && 
                                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm text-center font-bold">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label className="text-slate-600 font-bold text-xs uppercase tracking-wider pr-1">אימייל</Label>
                                    <div className="relative">
                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="h-14 rounded-2xl pr-12 text-base font-bold bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#AADB56]/20 transition-all"
                                            dir="ltr"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-600 font-bold text-xs uppercase tracking-wider pr-1">סיסמה</Label>
                                    <div className="relative">
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="h-14 rounded-2xl pr-12 text-base font-bold bg-slate-50 border-slate-100 focus:bg-white focus:ring-2 focus:ring-[#AADB56]/20 transition-all"
                                            dir="ltr"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-16 rounded-2xl text-lg font-black bg-[#AADB56] hover:bg-[#1b3626] text-[#1b3626] hover:text-white shadow-xl shadow-lime-100 transition-all duration-300"
                                >
                                    {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "התחברות"}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="register">
                            <form onSubmit={handleRegister} className="space-y-4">
                                {error && ( activeTab === "register" && 
                                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm text-center font-bold">
                                        {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-600 font-bold text-xs uppercase tracking-wider pr-1">שם מלא</Label>
                                        <div className="relative">
                                            <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                            <Input
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="ישראל ישראלי"
                                                className="h-14 rounded-2xl pr-12 text-base font-bold bg-slate-50 border-slate-100"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-600 font-bold text-xs uppercase tracking-wider pr-1">טלפון</Label>
                                        <div className="relative">
                                            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                            <Input
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="050-0000000"
                                                className="h-14 rounded-2xl pr-12 text-base font-bold bg-slate-50 border-slate-100"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-600 font-bold text-xs uppercase tracking-wider pr-1">אימייל</Label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="h-14 rounded-2xl text-base font-bold bg-slate-50 border-slate-100"
                                        dir="ltr"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-600 font-bold text-xs uppercase tracking-wider pr-1">סיסמה</Label>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="לפחות 6 תווים"
                                        className="h-14 rounded-2xl text-base font-bold bg-slate-50 border-slate-100"
                                        dir="ltr"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-2">
                                    <Checkbox
                                        id="marketing"
                                        checked={marketingOptIn}
                                        onCheckedChange={(checked) => setMarketingOptIn(checked as boolean)}
                                        className="data-[state=checked]:bg-[#AADB56] data-[state=checked]:border-[#AADB56] mt-1"
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <label
                                            htmlFor="marketing"
                                            className="text-sm font-bold text-[#1b3626] leading-none cursor-pointer"
                                        >
                                            אני מאשר קבלת תוכן שיווקי ומבצעים
                                        </label>
                                        <p className="text-xs text-slate-400 font-medium">
                                            קבלו עדכונים על מוצרים טריים וקופונים בלעדיים.
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-16 rounded-2xl text-lg font-black bg-[#1b3626] text-white hover:bg-[#2c533c] shadow-xl transition-all duration-300"
                                >
                                    {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "הרשמה למשפחת השוק"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>

                    <div className="mt-8 text-center">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                            שוק בשכונה • תוצרת ישראלית טרייה
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
