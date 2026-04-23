"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Truck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Category } from "@/types/supabase";
import { useEffect, useState } from "react";

export function Footer() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [settings, setSettings] = useState<any>({});
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient();
            
            // Fetch settings
            const { data: settingsData } = await supabase.from("site_settings").select("*");
            if (settingsData) {
                const settingsMap = settingsData.reduce((acc, curr) => {
                    acc[curr.key] = curr.value;
                    return acc;
                }, {} as any);
                setSettings(settingsMap);
            }

            // Fetch parent categories
            const { data: categoriesData } = await supabase
                .from("categories")
                .select("*")
                .is("parent_id", null)
                .eq("is_visible", true)
                .order("sort_order", { ascending: true });
            
            if (categoriesData) {
                setCategories(categoriesData);
            }
        }
        fetchData();
    }, []);

    return (
        <footer
            className="bg-[#112a1e] text-[#ebf3db]/80 mt-auto border-t border-[#AADB56]/20 py-20 relative overflow-hidden"
            dir="rtl"
            style={{
                backgroundImage: 'radial-gradient(circle, rgba(170,219,86,0.04) 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px'
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-[#112a1e] via-transparent to-[#112a1e] pointer-events-none opacity-40"></div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">

                    {/* Column 1: בואו להכיר */}
                    <div>
                        <h4 className="text-[#AADB56] font-black text-2xl mb-8 tracking-tighter relative inline-block">
                            בואו להכיר
                            <span className="absolute -bottom-2 right-0 w-12 h-1.5 bg-[#AADB56] rounded-full opacity-30 shadow-[0_0_10px_rgba(170,219,86,0.2)]"></span>
                        </h4>
                        <ul className="space-y-4 font-bold">
                            {[
                                { label: "אודות", href: "/about" },
                                { label: "תעודת כשרות", href: "/kosher" },
                                { label: "שאלות נפוצות", href: "/faq" },
                                { label: "תנאי שימוש באתר", href: "/terms" },
                                { label: "הצהרת נגישות", href: "/accessibility" }
                            ].map((link, idx) => (
                                <li key={idx}>
                                    <Link href={link.href} className="hover:text-[#AADB56] hover:translate-x-[-6px] transition-all flex items-center gap-2 group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#AADB56]/30 group-hover:bg-[#AADB56] transition-colors"></div>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: החנות */}
                    <div>
                        <h4 className="text-[#AADB56] font-black text-2xl mb-8 tracking-tighter relative inline-block">
                            החנות
                            <span className="absolute -bottom-2 right-0 w-12 h-1.5 bg-[#AADB56] rounded-full opacity-30 shadow-[0_0_10px_rgba(170,219,86,0.2)]"></span>
                        </h4>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-4 font-bold">
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link href={`/category/${cat.id}`} className="hover:text-[#AADB56] transition-colors flex items-center gap-2 group opacity-90 hover:opacity-100">
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: שירות לקוחות */}
                    <div>
                        <h4 className="text-[#AADB56] font-black text-2xl mb-8 tracking-tighter relative inline-block">
                            שירות לקוחות
                            <span className="absolute -bottom-2 right-0 w-12 h-1.5 bg-[#AADB56] rounded-full opacity-30 shadow-[0_0_10px_rgba(170,219,86,0.2)]"></span>
                        </h4>
                        <div className="space-y-6 text-[#ebf3db]/90 font-bold">
                            <div className="flex items-center gap-4">
                                <div className="bg-[#AADB56] p-3 rounded-2xl shadow-[0_10px_20px_rgba(170,219,86,0.1)] border border-white/10 group">
                                    <Clock className="w-6 h-6 text-[#112a1e] animate-pulse" />
                                </div>
                                <div className="leading-tight tracking-tight">
                                    <p className="font-black text-[#AADB56] text-[15px] mb-0.5">שעות פעילות:</p>
                                    <p className="text-[14px]">א&apos;-ה&apos;: 07:00 - 20:00</p>
                                    <p className="text-[14px]">ו&apos;: 07:00 - 16:00</p>
                                </div>
                            </div>

                            {settings.contact_phone && (
                                <div className="flex items-center gap-4">
                                    <div className="bg-[#AADB56] p-3 rounded-2xl shadow-[0_10px_20px_rgba(170,219,86,0.1)] border border-white/10">
                                        <Phone className="w-6 h-6 text-[#112a1e]" />
                                    </div>
                                    <div className="leading-tight">
                                        <p className="font-black text-[#AADB56] text-[15px] mb-0.5">לשיחה איתנו:</p>
                                        <a href={`tel:${settings.contact_phone}`} className="text-xl font-black block text-white hover:text-[#AADB56] transition-colors" dir="ltr">{settings.contact_phone}</a>
                                    </div>
                                </div>
                            )}

                            {settings.contact_email && (
                                <div className="flex items-center gap-4">
                                    <div className="bg-[#AADB56] p-3 rounded-2xl shadow-[0_10px_20px_rgba(170,219,86,0.1)] border border-white/10">
                                        <Mail className="w-6 h-6 text-[#112a1e]" />
                                    </div>
                                    <div className="leading-tight">
                                        <p className="font-black text-[#AADB56] text-[15px] mb-0.5">פנייה במייל:</p>
                                        <a href={`mailto:${settings.contact_email}`} className="text-sm font-black break-all text-white/90 hover:text-[#AADB56] transition-colors">{settings.contact_email}</a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/30 text-xs font-black tracking-widest uppercase">
                    <p>© {new Date().getFullYear()} שוק בשכונה. כל הזכויות שמורות.</p>
                    <div className="flex items-center gap-4 py-2 px-5 bg-white/5 rounded-full border border-white/5 backdrop-blur-md">
                        <MapPin className="h-4 w-4 text-[#AADB56]" />
                        <span className="text-white/60 font-black">{settings.contact_address || "ישראל"}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
