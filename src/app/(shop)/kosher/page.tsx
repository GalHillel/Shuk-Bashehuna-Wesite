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
        <div className="flex min-h-screen flex-col bg-[#fcfbe8]" dir="rtl">
            {/* Hero Section */}
            <div className="relative bg-[#112a1e] py-20 text-center border-b-[8px] border-[#AADB56] overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
                <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-lg">כשרות ואיכות</h1>
                    <p className="text-xl md:text-2xl text-[#CFE1A7] font-bold">
                        אנחנו מתחייבים לתוצרת חקלאית בסטנדרט הגבוה ביותר, תחת פיקוח.
                    </p>
                </div>
            </div>

            <main className="flex-1 container mx-auto px-6 py-16 max-w-4xl">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-16">
                    <PageContentRenderer blocks={data.blocks} />
                </div>
            </main>
        </div>
    );
}
