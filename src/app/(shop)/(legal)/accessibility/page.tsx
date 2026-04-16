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
        <div className="min-h-screen bg-slate-50 py-12" dir="rtl">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#14532d] text-white p-6 md:p-12 text-center">
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{data.title}</h1>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            אנו רואים חשיבות רבה במתן שירות שוויוני לכלל הגולשים ובשיפור הנגישות באתר.
                        </p>
                    </div>

                    <div className="p-6 md:p-12">
                        <PageContentRenderer blocks={data.blocks} />
                    </div>
                </div>
            </div>
        </div>
    );
}
