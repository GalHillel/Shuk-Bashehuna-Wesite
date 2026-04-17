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
        },
        {
            id: "f4",
            type: "faq_item",
            question: "האם ניתן להזמין משלוח לכל אזור?",
            answer: "אנו מבצעים משלוחים לפתח תקווה והסביבה. ניתן לבדוק זמינות משלוח לפי הכתובת בעת ביצוע ההזמנה."
        },
        {
            id: "f5",
            type: "faq_item",
            question: "תוך כמה זמן מגיע המשלוח?",
            answer: "המשלוח מגיע באותו יום או ביום העסקים הבא, בהתאם לשעת ההזמנה. כמו כן, ניתן לתאם את יום ושעת המשלוח לפי סימון באתר."
        },
        {
            id: "f6",
            type: "faq_item",
            question: "האם ניתן לאסוף את ההזמנה מהחנות?",
            answer: "כן, ניתן לבצע הזמנה באתר ולאסוף אותה מהחנות בשעות הפעילות."
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
                        שאלות נפוצות
                    </h1>
                    <div className="w-16 h-1.5 bg-[#112a1e] mx-auto mb-6 rounded-full opacity-20"></div>
                    <p className="text-lg md:text-xl text-[#2c3e1c] font-black max-w-2xl mx-auto px-4 leading-tight opacity-90 animate-in fade-in slide-in-from-bottom-4 delay-200 duration-700">
                        כל מה שרציתם לדעת על הפירות, הירקות והמשלוחים שלנו. <br className="hidden md:block" /> אנחנו כאן לכל שאלה.
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
