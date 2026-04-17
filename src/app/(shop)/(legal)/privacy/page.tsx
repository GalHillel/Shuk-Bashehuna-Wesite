import { ShieldCheck, Database, Key, Cookie } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "מדיניות פרטיות | שוק בשכונה",
    description: "מדיניות הפרטיות של שוק בשכונה.",
};

export default function PrivacyPage() {
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
                        מדיניות פרטיות
                    </h1>
                    <div className="w-16 h-1.5 bg-[#112a1e] mx-auto mb-6 rounded-full opacity-20"></div>
                    <p className="text-lg md:text-xl text-[#2c3e1c] font-black max-w-2xl mx-auto px-4 leading-tight opacity-90 animate-in fade-in slide-in-from-bottom-4 delay-200 duration-700">
                        אנו מכבדים את פרטיותכם ומתחייבים להגן על המידע האישי שלכם.
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
                <div className="max-w-3xl mx-auto space-y-12 text-slate-700 leading-relaxed font-medium">
                    {/* Section 1: Collection */}
                    <section className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-200/60 shadow-sm">
                        <div className="flex items-center gap-4 mb-6 border-r-4 border-[#AADB56] pr-4">
                            <Database className="w-7 h-7 text-[#112a1e]" />
                            <h2 className="text-2xl font-black text-[#112a1e] tracking-tight">1. איסוף מידע</h2>
                        </div>
                        <p className="text-lg mb-6">
                            בעת ביצוע הזמנה באתר, אנו אוספים את הפרטים הבאים אך ורק לצורך ביצוע המשלוח ויצירת קשר:
                        </p>
                        <ul className="space-y-3 pr-4">
                            {[
                                "שם מלא",
                                "כתובת למשלוח (עיר, רחוב, מספר בית/דירה)",
                                "מספר טלפון (קבלת עדכוני משלוח בלבד)",
                                "כתובת דוא\"ל (אם סופקה)"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-lg font-bold text-slate-600">
                                    <div className="w-2 h-2 rounded-full bg-[#AADB56]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 p-6 bg-red-50 rounded-3xl border border-red-100">
                            <p className="font-black text-red-600 text-lg leading-snug">
                                שימו לב: אנו לא אוספים ולא שומרים פרטי כרטיס אשראי.
                                <br />
                                התשלום מתבצע ישירות מול בית העסק, השליח או באפליקציות צד ג&apos; (כגון Bit).
                            </p>
                        </div>
                    </section>

                    {/* Section 2: Usage */}
                    <section className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-200/60 shadow-sm">
                        <div className="flex items-center gap-4 mb-6 border-r-4 border-[#AADB56] pr-4">
                            <Key className="w-7 h-7 text-[#112a1e]" />
                            <h2 className="text-2xl font-black text-[#112a1e] tracking-tight">2. שימוש במידע</h2>
                        </div>
                        <p className="text-lg mb-6">
                            המידע הנאסף משמש אך ורק למטרות הבאות:
                        </p>
                        <ul className="space-y-3 pr-4 mb-6">
                            {[
                                "עיבוד ומשלוח ההזמנה שלכם.",
                                "יצירת קשר במקרה של חוסרים או שינויים בהזמנה.",
                                "שיפור השירות וחווית המשתמש באתר."
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-lg font-bold text-slate-600">
                                    <div className="w-2 h-2 rounded-full bg-[#AADB56]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="text-lg font-bold bg-[#AADB56]/10 p-4 rounded-2xl border border-[#AADB56]/20 inline-block">
                            אנו מתחייבים שלא להעביר את פרטיכם האישיים לצד שלישי, למעט במקרים של דרישה חוקית מרשויות החוק.
                        </p>
                    </section>

                    {/* Section 3: Security */}
                    <section className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-200/60 shadow-sm">
                        <div className="flex items-center gap-4 mb-6 border-r-4 border-[#AADB56] pr-4">
                            <ShieldCheck className="w-7 h-7 text-[#112a1e]" />
                            <h2 className="text-2xl font-black text-[#112a1e] tracking-tight">3. אבטחת מידע</h2>
                        </div>
                        <p className="text-lg">
                            אנו נוקטים באמצעי זהירות מקובלים על מנת לשמור, ככל האפשר, על סודיות המידע.
                            האתר מאובטח בפרוטוקול SSL התקני המבטיח הצפנה מלאה של המידע העובר באתר.
                        </p>
                    </section>

                    {/* Section 4: Cookies */}
                    <section className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-200/60 shadow-sm">
                        <div className="flex items-center gap-4 mb-6 border-r-4 border-[#AADB56] pr-4">
                            <Cookie className="w-7 h-7 text-[#112a1e]" />
                            <h2 className="text-2xl font-black text-[#112a1e] tracking-tight">4. שימוש בעוגיות (Cookies)</h2>
                        </div>
                        <p className="text-lg mb-6">
                            האתר עושה שימוש בקבצי עוגיות (Cookies) לצורך תפעולו השוטף והתקין, ובכלל זה כדי לאסוף נתונים סטטיסטיים אודות השימוש באתר, לאימות פרטים, וכדי להתאים את האתר להעדפותיכם האישיות.
                        </p>
                        <ul className="space-y-3 pr-4 mb-6">
                            {[
                                "שמירת מוצרים בסל הקניות שלכם.",
                                "זיהוי המשתמש בכניסות חוזרות לאתר.",
                                "שיפור מהירות הגלישה והביצועים של האתר.",
                                "ניתוח סטטיסטי אנונימי לשיפור חווית הקנייה."
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-lg font-bold text-slate-600">
                                    <div className="w-2 h-2 rounded-full bg-[#AADB56]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="text-lg">
                            ניתן לחסום או למחוק את העוגיות דרך הגדרות הדפדפן שלכם, אך זכרו כי הדבר עלול לפגום בחלק מהאפשרויות באתר (כמו שמירת הסל).
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
