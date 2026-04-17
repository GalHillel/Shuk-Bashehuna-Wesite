"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { PageContentRenderer } from "@/components/cms/PageContentRenderer";
import { PageData } from "@/types/cms";

const DEFAULT_KOSHER_BLOCKS: PageData = {
    title: "כשרות",
    blocks: [
        { 
            id: "1", 
            type: "heading", 
            level: 2, 
            content: "כשרות והשגחה קפדנית" 
        },
        { 
            id: "2", 
            type: "paragraph", 
            content: "כלל המוצרים, הפירות והירקות שלנו תחת השגחה קפדנית. התוצרת נקייה מחשש טבל ושביעית ומופרשות תרומות ומעשרות כדין בפיקוח תמידי של משגיח.\n\nאנו מתחייבים להביא אליכם את התוצרת האיכותית ביותר בכפוף לסטנדרטים המחמירים של הכשרות, למען קהל לקוחותינו." 
        },
        { 
            id: "3", 
            type: "image", 
            url: "/placeholder.png", 
            caption: "תעודת כשרות" 
        }
    ]
};

export default function KosherPage() {
    const [data, setData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchKosherData() {
            try {
                const { data: resData } = await supabase
                    .from("site_settings")
                    .select("value")
                    .eq("key", "page_kosher")
                    .single();

                if (resData && resData.value) {
                    const value = resData.value as any;
                    // Migration handle (old format -> new format)
                    if (!value.blocks) {
                        setData({
                            title: "כשרות",
                            blocks: [
                                { id: "m1", type: "heading", level: 2, content: value.title || "כשרות והשגחה" },
                                { id: "m2", type: "paragraph", content: value.text || "" },
                                { id: "m3", type: "image", url: value.certificate_url || "/placeholder.png", caption: "תעודת כשרות" }
                            ]
                        });
                    } else {
                        setData(value as PageData);
                    }
                } else {
                    setData(DEFAULT_KOSHER_BLOCKS);
                }
            } catch (err) {
                console.error("Error fetching Kosher data:", err);
                setData(DEFAULT_KOSHER_BLOCKS);
            } finally {
                setLoading(false);
            }
        }
        fetchKosherData();
    }, []);

    if (loading || !data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#fcfcfc]">
                <Loader2 className="w-12 h-12 text-[#AADB56] animate-spin" />
            </div>
        );
    }

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
                        כשרות ואיכות
                    </h1>
                    <div className="w-16 h-1.5 bg-[#112a1e] mx-auto mb-6 rounded-full opacity-20"></div>
                    <p className="text-lg md:text-xl text-[#2c3e1c] font-black max-w-2xl mx-auto px-4 leading-tight opacity-90 animate-in fade-in slide-in-from-bottom-4 delay-200 duration-700">
                        אנחנו מתחייבים לתוצרת חקלאית בסטנדרט הגבוה ביותר, תחת פיקוח הדוק.
                    </p>
                </div>
            </div>

            <main 
                className="flex-1 container mx-auto px-4 py-16 max-w-3xl bg-[#f9faf6] min-w-full"
                style={{ 
                    backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.04) 1.5px, transparent 1.5px)', 
                    backgroundSize: '24px 24px' 
                }}
            >
                <div className="max-w-3xl mx-auto">
                    <PageContentRenderer blocks={data.blocks} />
                </div>
            </main>
        </div>
    );
}
