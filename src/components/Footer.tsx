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
        <footer className="bg-[#112a1e] text-green-100 mt-auto border-t border-[#AADB56] py-16" dir="rtl">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                    
                    {/* Column 1: בואו להכיר */}
                    <div>
                        <h4 className="text-white font-black text-2xl mb-6 tracking-tight relative inline-block">
                            בואו להכיר
                            <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-[#AADB56] rounded-full"></span>
                        </h4>
                        <ul className="space-y-3.5 font-bold text-[#ebf3db]/80">
                            <li><Link href="/about" className="hover:text-[#AADB56] transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#AADB56]/50"></div> אודות</Link></li>
                            <li><Link href="/kosher" className="hover:text-[#AADB56] transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#AADB56]/50"></div> תעודת כשרות</Link></li>
                            <li><Link href="/faq" className="hover:text-[#AADB56] transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#AADB56]/50"></div> שאלות נפוצות</Link></li>
                            <li><Link href="/terms" className="hover:text-[#AADB56] transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#AADB56]/50"></div> תנאי שימוש באתר</Link></li>
                            <li><Link href="/accessibility" className="hover:text-[#AADB56] transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#AADB56]/50"></div> הצהרת נגישות</Link></li>
                        </ul>
                    </div>

                    {/* Column 2: החנות */}
                    <div>
                        <h4 className="text-white font-black text-2xl mb-6 tracking-tight relative inline-block">
                            החנות
                            <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-[#AADB56] rounded-full"></span>
                        </h4>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-3.5 font-bold text-[#ebf3db]/80">
                            <li><Link href="/category/fruits" className="hover:text-[#AADB56] transition-colors">פירות השוק</Link></li>
                            <li><Link href="/category/vegetables" className="hover:text-[#AADB56] transition-colors">ירקות השוק</Link></li>
                            <li><Link href="/category/greens" className="hover:text-[#AADB56] transition-colors">ירוקים וחסות</Link></li>
                            <li><Link href="/category/platters" className="hover:text-[#AADB56] transition-colors">מגשי אירוח</Link></li>
                            <li><Link href="/category/nuts" className="hover:text-[#AADB56] transition-colors">אגוזים ופירות יבשים</Link></li>
                            <li><Link href="/category/juices" className="hover:text-[#AADB56] transition-colors">מיצים טבעיים</Link></li>
                            <li><Link href="/category/pantry" className="hover:text-[#AADB56] transition-colors">המזווה שלנו</Link></li>
                            <li><Link href="/category/dairy" className="hover:text-[#AADB56] transition-colors">מוצרי חלב וביצים</Link></li>
                            <li><Link href="/category/breads" className="hover:text-[#AADB56] transition-colors">לחמים</Link></li>
                            <li><Link href="/category/drinks" className="hover:text-[#AADB56] transition-colors">משקאות ויינות</Link></li>
                            <li><Link href="/category/home" className="hover:text-[#AADB56] transition-colors">לבית ולמטבח</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: שירות לקוחות */}
                    <div>
                        <h4 className="text-white font-black text-2xl mb-6 tracking-tight relative inline-block">
                            שירות לקוחות
                            <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-[#AADB56] rounded-full"></span>
                        </h4>
                        <div className="space-y-5 text-[#ebf3db] font-bold">
                            <div className="flex items-start gap-4">
                                <div className="bg-[#1a4222] p-2.5 rounded-xl border border-[#2c6136]">
                                    <Clock className="w-6 h-6 text-[#AADB56]" />
                                </div>
                                <div className="leading-relaxed mt-1 tracking-wide">
                                    <p>ראשון - חמישי: 7:00 - 20:00</p>
                                    <p>שישי: 7:00 - 16:00</p>
                                </div>
                            </div>
                            
                            {settings.contact_phone && (
                                <div className="flex items-start gap-4 mt-6">
                                    <div className="bg-[#1a4222] p-2.5 rounded-xl border border-[#2c6136]">
                                        <Phone className="w-6 h-6 text-[#AADB56]" />
                                    </div>
                                    <div className="leading-relaxed mt-2 tracking-wide font-black text-xl flex items-center gap-2" dir="ltr">
                                        <a href={`tel:${settings.contact_phone}`} className="hover:text-[#AADB56] transition-colors">{settings.contact_phone}</a>
                                    </div>
                                </div>
                            )}

                            {settings.contact_email && (
                                <div className="flex items-start gap-4 mt-2">
                                    <div className="bg-[#1a4222] p-2.5 rounded-xl border border-[#2c6136]">
                                        <Mail className="w-6 h-6 text-[#AADB56]" />
                                    </div>
                                    <div className="leading-relaxed mt-2 tracking-wide font-bold" dir="ltr">
                                        <a href={`mailto:${settings.contact_email}`} className="hover:text-[#AADB56] transition-colors">{settings.contact_email}</a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
                
                <div className="mt-16 pt-8 border-t border-[#1a4222] flex flex-col md:flex-row justify-between items-center gap-4 text-[#ebf3db]/40 text-sm font-bold tracking-wider">
                    <p>© {new Date().getFullYear()} שוק בשכונה. כל הזכויות שמורות.</p>
                    <div className="flex items-center gap-4">
                       <MapPin className="h-4 w-4" />
                       {settings.contact_address || "ישראל"}
                    </div>
                </div>
            </div>
        </footer>
    );
}
