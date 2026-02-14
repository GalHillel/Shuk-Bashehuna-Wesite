"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Truck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function Footer() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [settings, setSettings] = useState<any>({});

    useEffect(() => {
        async function fetchSettings() {
            const supabase = createClient();
            const { data } = await supabase.from("site_settings").select("*");
            if (data) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const settingsMap = data.reduce((acc, curr) => {
                    acc[curr.key] = curr.value;
                    return acc;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }, {} as any);
                setSettings(settingsMap);
            }
        }
        fetchSettings();
    }, []);

    return (
        <footer className="bg-slate-900 text-slate-300 mt-12" dir="rtl">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white">{settings.site_name || "🥬 שוק בשכונה"}</h3>
                        <p className="text-sm leading-relaxed">
                            {settings.footer_description || "פירות וירקות טריים ישירות מהחקלאי אליכם הביתה. איכות ללא פשרות, טעם שמדבר בעד עצמו."}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white">קישורים מהירים</h4>
                        <nav className="flex flex-col gap-2 text-sm">
                            <Link href="/" className="hover:text-primary transition-colors">דף הבית</Link>
                            <Link href="/about" className="hover:text-primary transition-colors">אודות</Link>
                            <Link href="/category/specials" className="hover:text-primary transition-colors">מבצעים</Link>
                            <Link href="/checkout" className="hover:text-primary transition-colors">עגלת קניות</Link>
                        </nav>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white">צרו קשר</h4>
                        <div className="flex flex-col gap-3 text-sm">
                            {settings.contact_phone && (
                                <a href={`tel:${settings.contact_phone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                                    <Phone className="h-4 w-4 flex-shrink-0" />
                                    {settings.contact_phone}
                                </a>
                            )}
                            {settings.contact_email && (
                                <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                                    <Mail className="h-4 w-4 flex-shrink-0" />
                                    <span dir="ltr">{settings.contact_email}</span>
                                </a>
                            )}
                            {settings.contact_address && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 flex-shrink-0" />
                                    <span>{settings.contact_address}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white">מידע</h4>
                        <div className="flex flex-col gap-3 text-sm">
                            {settings.hours_weekdays && (
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 flex-shrink-0" />
                                    <span>{settings.hours_weekdays}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 flex-shrink-0" />
                                <span>משלוח חינם מעל ₪300</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-8 pt-6 text-center text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} שוק בשכונה. כל הזכויות שמורות.</p>
                </div>
            </div>
        </footer>
    );
}
