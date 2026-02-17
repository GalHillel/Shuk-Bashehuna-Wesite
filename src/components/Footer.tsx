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
        // Super Compact Footer V3 (Max 3 Lines)
        <footer className="bg-[#14532d] text-green-100 mt-auto border-t border-green-800 text-xs" dir="rtl">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">

                    {/* Line 1 (Desktop Left): Contact Only */}
                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 w-full md:w-auto">
                        {/* Contact (Inline) */}
                        <div className="flex items-center gap-4">
                            {settings.contact_phone && (
                                <a href={`tel:${settings.contact_phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                                    <Phone className="h-3.5 w-3.5 text-green-300" />
                                    <span>{settings.contact_phone}</span>
                                </a>
                            )}
                            {settings.contact_email && (
                                <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                                    <Mail className="h-3.5 w-3.5 text-green-300" />
                                    <span dir="ltr">{settings.contact_email}</span>
                                </a>
                            )}
                            {settings.contact_address && (
                                <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                                    <MapPin className="h-3.5 w-3.5 text-green-300" />
                                    <span>{settings.contact_address}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Line 1 (Desktop Right): Legal & Copyright */}
                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 w-full md:w-auto mt-2 md:mt-0">
                        <nav className="flex items-center gap-3 md:gap-4">
                            <Link href="/terms" className="hover:text-white transition-colors">תקנון</Link>
                            <Link href="/privacy" className="hover:text-white transition-colors">פרטיות</Link>
                            <Link href="/accessibility" className="hover:text-white transition-colors">נגישות</Link>
                        </nav>

                        <div className="hidden md:block w-px h-4 bg-green-700"></div>

                        <p className="text-green-200/60">
                            © {new Date().getFullYear()} שוק בשכונה
                        </p>
                    </div>

                </div>
            </div>
        </footer>
    );
}
