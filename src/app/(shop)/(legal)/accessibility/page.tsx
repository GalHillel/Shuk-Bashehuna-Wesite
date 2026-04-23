"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { PageContentRenderer } from "@/components/cms/PageContentRenderer";
import { PageData } from "@/types/cms";

const DEFAULT_ACCESSIBILITY: PageData = {
    title: "הצהרת נגישות",
    blocks: [
        { id: "a1", type: "heading", level: 2, content: "רמת הנגישות" },
        { id: "a2", type: "paragraph", content: "אנו רואים חשיבות רבה במתן שירות שוויוני לכלל הגולשים ובשיפור הנגישות באתר.\nאתר זה נבנה בהתאם להוראות נגישות תכנים באינטרנט WCAG 2.1 ברמה AA." },
        { id: "a3", type: "alert", variant: "info", content: "למרות מאמצנו להנגיש את כלל הדפים באתר, ייתכן ויתגלו חלקים שטרם הונגשו במלואם. אם נתקלתם בבעיה, נשמח שתפנו אלינו." }
    ]
};

export default function AccessibilityPage() {
    const [data, setData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAccessibilityData() {
            try {
                const { data: resData } = await supabase
                    .from("site_settings")
                    .select("value")
                    .eq("key", "page_accessibility")
                    .single();

                if (resData && resData.value) {
                    setData(resData.value as unknown as PageData);
                } else {
                    setData(DEFAULT_ACCESSIBILITY);
                }
            } catch (err) {
                console.error("Error fetching Accessibility data:", err);
                setData(DEFAULT_ACCESSIBILITY);
            } finally {
                setLoading(false);
            }
        }
        fetchAccessibilityData();
    }, []);

    if (loading || !data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
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
                        {data.title}
                    </h1>
                    <div className="w-16 h-1.5 bg-[#112a1e] mx-auto mb-6 rounded-full opacity-20"></div>
                    <p className="text-lg md:text-xl text-[#2c3e1c] font-black max-w-2xl mx-auto px-4 leading-tight opacity-90 animate-in fade-in slide-in-from-bottom-4 delay-200 duration-700">
                        אנו רואים חשיבות רבה במתן שירות שוויוני לכלל הגולשים ובשיפור הנגישות באתר עבור כולם.
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
