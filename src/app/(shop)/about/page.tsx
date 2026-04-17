"use client";

import Image from "next/image";
import { Leaf, Truck, Heart, Phone, Star, Shield, Zap, Coffee, Award, Gift } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AboutPage() {
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
        <div className="flex min-h-screen flex-col bg-[#fcfcfc]" dir="rtl">
            {/* Hero Section */}
            <div
                className="bg-[#AADB56] pt-16 pb-14 text-center relative overflow-hidden"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 2px, transparent 2.5px)',
                    backgroundSize: '24px 24px'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none"></div>
                <div className="relative z-10 container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-black text-[#112a1e] mb-4 tracking-tighter drop-shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
                        הסיפור שלנו
                    </h1>
                    <div className="w-16 h-1.5 bg-[#112a1e] mx-auto mb-6 rounded-full opacity-20"></div>
                    <p className="text-lg md:text-xl text-[#2c3e1c] font-black max-w-2xl mx-auto px-4 leading-tight opacity-90 animate-in fade-in slide-in-from-bottom-4 delay-200 duration-700">
                        מביאים את הטריות של השדה ישירות אל הצלחת שלכם
                    </p>
                </div>
            </div>

            <main
                className="flex-1 container mx-auto px-4 py-16 max-w-4xl bg-[#f9faf6] min-w-full"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.04) 1.5px, transparent 1.5px)',
                    backgroundSize: '24px 24px'
                }}
            >
                <div className="max-w-4xl mx-auto space-y-20">
                    {/* Story Section */}
                    <section className="space-y-8 text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-black text-[#112a1e] tracking-tight">
                            {settings.about_story_title || "חקלאות ישראלית עם נשמה"}
                        </h2>
                        <div className="space-y-6 text-xl md:text-[22px] text-slate-700 font-medium leading-relaxed">
                            <p className="animate-in fade-in duration-700">
                                {settings.about_story_p1 || "״שוק בשכונה״ הוקם מתוך אהבה אמיתית לאדמה ולתוצרת החקלאית הישראלית. אנחנו דור שלישי למשפחת חקלאים, ומביאים אליכם את הסיפור שמאחורי כל עגבנייה ומלפפון."}
                            </p>
                            <p className="animate-in fade-in duration-1000">
                                {settings.about_story_p2 || "החלום שלנו הוא להגיע אליכם הביתה עם המשלוח המושלם – כזה שמרגיש כאילו קטפתם את התוצרת בעצמכם רגע לפני שהגיעה לדלת. אנחנו מתחייבים לטריות, לאיכות ולשירות ללא פשרות."}
                            </p>
                        </div>
                    </section>

                    {/* Values Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {(settings.about_features && Array.isArray(settings.about_features) ? settings.about_features : [
                            {
                                icon: "Leaf",
                                title: "טריות ללא פשרות",
                                desc: "כל המוצרים נקטפים ומגיעים טריים ישירות מהשדה אליכם הביתה בתחזוקה קפדנית.",
                                color: "text-[#3a5223] bg-[#ebf3db] border-[#c4eab3]",
                            },
                            {
                                icon: "Truck",
                                title: "משלוח עד הבית",
                                desc: "שליח ידידותי יביא את ההזמנה ישירות לדלת שלכם, בזמנים שנוחים לכם ביותר.",
                                color: "text-[#3a5223] bg-[#ebf3db] border-[#c4eab3]",
                            },
                        ]).map((item: any, idx: number) => {
                            const iconMap: any = { Leaf, Truck, Heart, Phone, Star, Shield, Zap, Coffee, Award, Gift };
                            const Icon = iconMap[item.icon] || Leaf;

                            return (
                                <div key={idx} className="p-8 md:p-10 rounded-[40px] border border-slate-200/60 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:border-[#AADB56] transition-all duration-500 group">
                                    <div className={`inline-flex p-4 rounded-3xl mb-6 border-2 transform group-hover:scale-110 transition-transform duration-500 ${item.color}`}>
                                        <Icon className="h-8 w-8" strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-2xl font-black mb-4 text-[#112a1e] tracking-tight">{item.title}</h3>
                                    <p className="text-lg text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            );
                        })}
                    </section>

                    {/* Secondary Image + Text */}
                    <section className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
                            <Image
                                src={settings.about_secondary_image || "/placeholder.png"}
                                alt="חקלאות ישראלית"
                                fill
                                className="object-cover hover:scale-110 transition-transform duration-1000"
                            />
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-black text-[#112a1e] tracking-tight">{settings.about_vision_title || "בית לחקלאות ישראלית 🇮🇱"}</h2>
                            <p className="text-lg md:text-xl leading-relaxed text-slate-700 font-medium whitespace-pre-wrap border-r-4 border-[#AADB56] pr-6">
                                {settings.about_vision_text || `אנחנו מעודדים חקלאות כחול-לבן! שוק בשכונה הוקם מתוך אידיאל עקרוני – להעניק לחקלאי הישראלי בית, ולחקלאות הישראלית במה.\n\nכשאתם קונים אצלנו, אתם תומכים ישירות במשקים ובמטעים הנפלאים של ארצנו.`}
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
