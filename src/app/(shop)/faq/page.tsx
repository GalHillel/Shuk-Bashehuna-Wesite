"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { PageContentRenderer } from "@/components/cms/PageContentRenderer";
import { PageData } from "@/types/cms";

const DEFAULT_FAQS: PageData = {
    title: "שאלות נפוצות",
    blocks: [
        {
            id: "f1",
            type: "faq_item",
            question: "איך שומרים על טריות המשלוח?",
            answer: "כל ההזמנות נלקטות בקפידה ביום המשלוח עצמו, ממש לפני היציאה להפצה. אנחנו משתמשים ברכבים ממוזגים ושומרים על שרשרת קירור כדי שהתוצרת תגיע אליכם טרייה ורעננה."
        },
        {
            id: "f2",
            type: "faq_item",
            question: "מה קורה במידה ויש חוסר במוצר שהזמנתי?",
            answer: "במידה ויש חוסר במוצר מסוים, נציג מטעמנו ייצור איתכם קשר טלפוני לפני סגירת ההזמנה כדי להציע תחליף הולם או לזכות אתכם."
        },
        {
            id: "f3",
            type: "faq_item",
            question: "האם יש מינימום הזמנה?",
            answer: "כן, מינימום הזמנה באתר הוא 150 ₪."
        }
    ]
};

export default function FAQPage() {
    const [data, setData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFAQData() {
            try {
                const { data: resData } = await supabase
                    .from("site_settings")
                    .select("value")
                    .eq("key", "page_faq")
                    .single();

                if (resData && resData.value) {
                    const value = resData.value as any;
                    // Migration handle: If it's pure array, wrap it in page structure
                    if (Array.isArray(value)) {
                        setData({
                            title: "שאלות נפוצות",
                            blocks: value.map((f: any, idx: number) => ({
                                id: `m${idx}`,
                                type: 'faq_item',
                                question: f.question,
                                answer: f.answer
                            }))
                        });
                    } else {
                        setData(value as PageData);
                    }
                } else {
                    setData(DEFAULT_FAQS);
                }
            } catch (err) {
                console.error("Error fetching FAQ data:", err);
                setData(DEFAULT_FAQS);
            } finally {
                setLoading(false);
            }
        }
        fetchFAQData();
    }, []);

    if (loading || !data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#fcfcfc]">
                <Loader2 className="w-10 h-10 text-[#AADB56] animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#fcfcfc]" dir="rtl">
            {/* Hero Section */}
            <div className="bg-[#ebf3db] py-16 text-center border-b border-[#d8e8c1]">
                <h1 className="text-4xl md:text-5xl font-black text-[#112a1e] mb-4 tracking-tight drop-shadow-sm">שאלות נפוצות</h1>
                <p className="text-lg md:text-xl text-[#2c3e1c] font-bold max-w-2xl mx-auto px-4">
                    כל התשובות לשאלות שלכם, במקום אחד. לא מצאתם? תשאירו לנו הודעה.
                </p>
            </div>

            <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl">
                <PageContentRenderer blocks={data.blocks} />
            </main>
        </div>
    );
}
