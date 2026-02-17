import { Accessibility, User, Phone, Mail } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "הצהרת נגישות | שוק בשכונה",
    description: "הצהרת הנגישות של שוק בשכונה.",
};

export default function AccessibilityPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12" dir="rtl">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#14532d] text-white p-4 md:p-12 text-center">
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">הצהרת נגישות</h1>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            אנו רואים חשיבות רבה במתן שירות שוויוני לכלל הגולשים ובשיפור הנגישות באתר.
                        </p>
                    </div>

                    <div className="p-4 md:p-12 space-y-12 text-slate-700 leading-relaxed">

                        {/* Section 1: Standard */}
                        <section>
                            <div className="flex items-center gap-3 mb-4 text-green-700">
                                <Accessibility className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">רמת הנגישות</h2>
                            </div>
                            <p>
                                אתר זה נבנה בהתאם להוראות נגישות תכנים באינטרנט WCAG 2.1 ברמה AA.
                                האתר הותאם לתצוגה במרבית הדפדפנים הנפוצים ולשימוש בטלפון הנייד.
                            </p>
                            <ul className="list-disc list-inside mt-4 space-y-2">
                                <li>האתר כולל תוסף נגישות (בדופן שמאל) המאפשר התאמת גודל טקסט, ניגודיות ועוד.</li>
                                <li>ניתן לנווט באתר באמצעות המקלדת (Tab, Shift+Tab, Enter).</li>
                                <li>התמונות באתר כוללות תיאור אלטרנטיבי (Alt Text).</li>
                            </ul>
                        </section>

                        {/* Section 2: Limitations */}
                        <section>
                            <p className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                                למרות מאמצנו להנגיש את כלל הדפים באתר, ייתכן ויתגלו חלקים שטרם הונגשו במלואם.
                                אם נתקלתם בבעיה בנושא נגישות, נשמח שתפנו אלינו כדי שנוכל לתקן ולשפר.
                            </p>
                        </section>

                        {/* Section 3: Coordinator - Removed as requested */}

                    </div>
                </div>
            </div>
        </div>
    );
}
