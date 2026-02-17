import { Building, Scale, Truck, AlertTriangle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "תקנון האתר | שוק בשכונה",
    description: "תקנון האתר, מדיניות משלוחים וביטולים של שוק בשכונה.",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12" dir="rtl">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#14532d] text-white p-4 md:p-12 text-center">
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">תקנון האתר</h1>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            אנא קראו בקפידה את תנאי השימוש באתר. השימוש באתר וביצוע הזמנות בו מהווים הסכמה לתנאים אלו.
                        </p>
                    </div>

                    <div className="p-4 md:p-12 space-y-12 text-slate-700 leading-relaxed">

                        {/* Section 1: Intro */}
                        <section>
                            <div className="flex items-center gap-3 mb-4 text-green-700">
                                <Building className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">1. כללי</h2>
                            </div>
                            <p>
                                אתר "שוק בשכונה" (להלן: "האתר") מופעל על ידי "שוק בשכונה" (ח.פ. [מספר ח.פ]) (להלן: "העסק").
                                האתר משמש כחנות וירטואלית למכירת פירות, ירקות ומוצרי מזון.
                                האמור בתקנון זה בלשון זכר הוא לשם הנוחות בלבד והתקנון מתייחס לבני שני המינים באופן שווה.
                            </p>
                        </section>

                        {/* Section 2: Products & Payment */}
                        <section>
                            <div className="flex items-center gap-3 mb-4 text-green-700">
                                <Scale className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">2. המוצרים והתשלום</h2>
                            </div>
                            <ul className="list-disc list-inside space-y-2">
                                <li>התמונות באתר הן להמחשה בלבד. ייתכנו שינויים קלים בין התמונה לבין המוצר המסופק בפועל (כגון גודל או צבע הירק).</li>
                                <li>
                                    <strong>מודל התשלום:</strong> האתר פועל במודל "הזמן כעת, שלם אחר כך".
                                    התשלום יתבצע בעת קבלת המשלוח או בסמוך לו, באמצעות אפליקציית Bit או במזומן לשליח.
                                </li>
                                <li>
                                    <strong>שקילה:</strong> מחירי המוצרים הנמכרים לפי משקל (ק"ג) הינם מחירים משוערים.
                                    החיוב הסופי ייקבע בהתאם למשקל בפועל בעת הליקוט והשקילה. ייתכן הפרש של עד 15% בין הסכום המשוער באתר לסכום הסופי לתשלום.
                                </li>
                            </ul>
                        </section>

                        {/* Section 3: Delivery */}
                        <section>
                            <div className="flex items-center gap-3 mb-4 text-green-700">
                                <Truck className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">3. משלוחים ואזורי חלוקה</h2>
                            </div>
                            <ul className="list-disc list-inside space-y-2">
                                <li>המשלוחים מתבצעים באזורי החלוקה המוגדרים באתר בלבד. העסק רשאי לשנות את אזורי החלוקה מעת לעת.</li>
                                <li><strong>מינימום הזמנה:</strong> ייתכן וקיים סכום מינימלי להזמנה, כפי שיפורסם באתר.</li>
                                <li><strong>מועדי אספקה:</strong> העסק יעשה מאמץ לספק את ההזמנה בחלון הזמן שנבחר ע"י הלקוח. ייתכנו עיכובים עקב עומס, מזג אוויר או כוח עליון.</li>
                                <li>במידה והלקוח לא יהיה בבית, ניתן להשאיר את המשלוח ליד הדלת (בתיאום מראש). העסק לא יהיה אחראי לטריות הסחורה מרגע השארתה.</li>
                            </ul>
                        </section>

                        {/* Section 4: Cancellation & Returns (CRITICAL) */}
                        <section className="bg-red-50 p-6 rounded-2xl border border-red-100">
                            <div className="flex items-center gap-3 mb-4 text-red-700">
                                <AlertTriangle className="w-6 h-6" />
                                <h2 className="text-2xl font-bold">4. ביטול עסקה והחזרות</h2>
                            </div>
                            <div className="space-y-4 font-medium text-slate-800">
                                <p>
                                    בהתאם להוראות חוק הגנת הצרכן, התשמ"א-1981:
                                </p>
                                <p className="font-bold">
                                    זכות הביטול אינה חלה על "טובין פסידים".
                                </p>
                                <p>
                                    הואיל והמוצרים הנמכרים באתר הינם מוצרי מזון טריים (פירות וירקות), אשר מטבעם מתקלקלים או מתכלים במהירות,
                                    <strong> לא ניתן לבטל עסקה או להחזיר מוצרים לאחר שנשלחו ללקוח.</strong>
                                </p>
                                <p>
                                    עם זאת, במידה והתקבל מוצר פגום או רקוב בצורה חריגה, יש ליצור קשר עם החנות תוך 24 שעות מקבלת המשלוח,
                                    בצירוף תמונה. העסק יבחן את המקרה ויזכה את הלקוח בהתאם לשיקול דעתו הבלעדי.
                                </p>
                            </div>
                        </section>

                        {/* Section 5: Footer Info */}
                        <section className="border-t pt-8 text-sm text-slate-500">
                            <h3 className="font-bold text-slate-700 mb-2">פרטי התקשרות:</h3>
                            <p>טלפון: 0548604554</p>
                            <p>כתובת: עין גנים 96, פתח תקווה</p>
                            <p>אימייל: [כתובת אימייל]</p>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
