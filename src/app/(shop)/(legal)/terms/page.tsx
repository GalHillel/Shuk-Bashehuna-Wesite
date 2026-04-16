"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { PageContentRenderer } from "@/components/cms/PageContentRenderer";
import { PageData } from "@/types/cms";

const DEFAULT_TERMS: PageData = {
    title: "תקנון האתר",
    blocks: [
        { id: "t1", type: "heading", level: 2, content: "1. כללי" },
        { id: "t2", type: "paragraph", content: "אתר 'שוק בשכונה' מופעל על ידי 'שוק בשכונה'. האתר משמש כחנות וירטואלית למכירת פירות, ירקות ומוצרי מזון." },
        { id: "t3", type: "heading", level: 2, content: "2. המוצרים והתשלום" },
        { id: "t4", type: "paragraph", content: "התמונות באתר הן להמחשה בלבד. ייתכנו שינויים קלים בין התמונה לבין המוצר המסופק בפועל.\nהתשלום יתבצע בעת קבלת המשלוח או בסמוך לו." },
        { id: "t5", type: "alert", variant: "danger", content: "זכות הביטול אינה חלה על טובין פסידים. לא ניתן לבטל עסקה או להחזיר מוצרי מזון טריים לאחר שנשלחו." }
    ]
};

export default function TermsPage() {
    const [data, setData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTermsData() {
            try {
                const { data: resData } = await supabase
                    .from("site_settings")
                    .select("value")
                    .eq("key", "page_terms")
                    .single();

                if (resData && resData.value) {
                    setData(resData.value as unknown as PageData);
                } else {
                    setData(DEFAULT_TERMS);
                }
            } catch (err) {
                console.error("Error fetching Terms data:", err);
                setData(DEFAULT_TERMS);
            } finally {
                setLoading(false);
            }
        }
        fetchTermsData();
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
                            אנא קראו בקפידה את תנאי השימוש באתר. השימוש באתר וביצוע הזמנות בו מהווים הסכמה לתנאים אלו.
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
