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
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative h-64 md:h-80 overflow-hidden">
                    <Image
                        src={settings.about_hero_image || "/placeholder.png"}
                        alt={settings.site_name || "שוק בשכונה - פירות וירקות טריים"}
                        fill
                        className="object-cover brightness-50"
                        priority
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
                            {settings.site_name ? `🥬 ${settings.site_name}` : "🥬 שוק בשכונה"}
                        </h1>
                    </div>
                </section>

                <div className="container max-w-4xl py-12 space-y-12 mx-auto">
                    {/* Story */}
                    <section className="space-y-4 text-lg leading-relaxed text-center">
                        <h2 className="text-3xl font-bold text-primary">{settings.about_story_title || "הסיפור שלנו"}</h2>
                        <p className="max-w-3xl mx-auto">
                            {settings.about_story_p1 || "״שוק בשכונה״ הוקם מתוך אהבה אמיתית לאדמה ולתוצרת החקלאית הישראלית. אנחנו דור שלישי למשפחת חקלאים, ומביאים אליכם את הסיפור שמאחורי כל עגבנייה ומלפפון."}
                        </p>
                        <p className="max-w-3xl mx-auto">
                            {settings.about_story_p2 || "החלום שלנו הוא להגיע אליכם הביתה עם המשלוח המושלם – כזה שמרגיש כאילו קטפתם את התוצרת בעצמכם רגע לפני שהגיעה לדלת. אנחנו מתחייבים לטריות, לאיכות ולשירות ללא פשרות."}
                        </p>
                    </section>

                    {/* Values Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(settings.about_features && Array.isArray(settings.about_features) ? settings.about_features : [
                            {
                                icon: "Leaf",
                                title: "טריות ללא פשרות",
                                desc: "כל המוצרים נקטפים ומגיעים טריים ישירות מהשדה אליכם הביתה",
                                color: "text-green-600 bg-green-50",
                            },
                            {
                                icon: "Truck",
                                title: "משלוח עד הבית",
                                desc: "שליח ידידותי יביא את ההזמנה ישירות לדלת שלכם, בשעה שנוחה לכם",
                                color: "text-blue-600 bg-blue-50",
                            },
                        ]).map((item: any, idx: number) => {
                            // Map string icon name to Lucide component
                            const iconMap: any = { Leaf, Truck, Heart, Phone, Star, Shield, Zap, Coffee, Award, Gift };
                            const Icon = iconMap[item.icon] || Leaf;

                            return (
                                <div key={idx} className="p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                                    <div className={`inline-flex p-3 rounded-lg mb-4 ${item.color}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.desc}</p>
                                </div>
                            );
                        })}
                    </section>

                    {/* Image + Text */}
                    <section className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="relative h-64 rounded-xl overflow-hidden shadow-md">
                            <Image
                                src={settings.about_secondary_image || "/placeholder.png"}
                                alt="חקלאות ישראלית"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">{settings.about_vision_title || "בית לחקלאות ישראלית 🇮🇱"}</h2>
                            <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                                {settings.about_vision_text || `אנחנו מעודדים חקלאות כחול-לבן! שוק בשכונה הוקם מתוך אידיאל עקרוני – להעניק לחקלאי הישראלי בית, ולחקלאות הישראלית במה.\n\nכשאתם קונים אצלנו, אתם תומכים ישירות במשקים ובמטעים הנפלאים של ארצנו.`}
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
