import { ShieldCheck, Database, Key } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "מדיניות פרטיות | שוק בשכונה",
    description: "מדיניות הפרטיות של שוק בשכונה.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12" dir="rtl">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="container max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border overflow-hidden my-8">
                    {/* Header */}
                    <div className="bg-[#14532d] text-white p-4 md:p-12 text-center">
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">מדיניות פרטיות</h1>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            אנו מכבדים את פרטיותכם ומתחייבים להגן על המידע האישי שלכם.
                        </p>
                    </div>

                    <div className="p-4 md:p-12 space-y-12 text-slate-700 leading-relaxed">

                        {/* Section 1: Collection */}
                        <section>
                            <div className="flex items-center gap-3 mb-4 text-green-700">
                                <Database className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">1. איסוף מידע</h2>
                            </div>
                            <p>
                                בעת ביצוע הזמנה באתר, אנו אוספים את הפרטים הבאים אך ורק לצורך ביצוע המשלוח ויצירת קשר:
                            </p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>שם מלא</li>
                                <li>כתובת למשלוח (עיר, רחוב, מספר בית/דירה)</li>
                                <li>מספר טלפון (קבלת עדכוני משלוח בלבד)</li>
                                <li>כתובת דוא"ל (אם סופקה)</li>
                            </ul>
                            <p className="mt-4 font-bold text-red-600">
                                שימו לב: אנו לא אוספים ולא שומרים פרטי כרטיס אשראי.
                                התשלום מתבצע ישירות מול בית העסק, השליח או באפליקציות צד ג' (כגון Bit).
                            </p>
                        </section>

                        {/* Section 2: Usage */}
                        <section>
                            <div className="flex items-center gap-3 mb-4 text-green-700">
                                <Key className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">2. שימוש במידע</h2>
                            </div>
                            <p>
                                המידע הנאסף משמש אך ורק למטרות הבאות:
                            </p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>עיבוד ומשלוח ההזמנה שלכם.</li>
                                <li>יצירת קשר במקרה של חוסרים או שינויים בהזמנה.</li>
                                <li>שיפור השירות וחווית המשתמש באתר.</li>
                            </ul>
                            <p className="mt-4">
                                אנו מתחייבים שלא להעביר את פרטיכם האישיים לצד שלישי, למעט במקרים של דרישה חוקית מרשויות החוק.
                            </p>
                        </section>

                        {/* Section 3: Security */}
                        <section>
                            <div className="flex items-center gap-3 mb-4 text-green-700">
                                <ShieldCheck className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">3. אבטחת מידע</h2>
                            </div>
                            <p>
                                אנו נוקטים באמצעי זהירות מקובלים על מנת לשמור, ככל האפשר, על סודיות המידע.
                                האתר מאובטח בפרוטוקול SSL התקני.
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
