
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "מדיניות פרטיות | שוק בשכונה",
    description: "מדיניות הפרטיות ואבטחת המידע באתר שוק בשכונה",
};

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-center">מדיניות פרטיות</h1>

            <div className="prose prose-lg max-w-none text-right" dir="rtl">
                <section className="mb-8">
                    <p>
                        אנו ב"שוק בשכונה" מכבדים את פרטיותך ומחויבים להגן על המידע האישי שלך.
                        מסמך זה מפרט את המדיניות שלנו ביחס לאיסוף, שימוש ומסירת מידע אישי.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">1. איסוף מידע</h2>
                    <p>
                        בעת השימוש באתר, אנו עשויים לאסוף מידע אישי כגון: שם מלא, כתובת, מספר טלפון, וכתובת דוא"ל, וזאת לצורך ביצוע הזמנות ואספקתן.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">2. שימוש במידע</h2>
                    <p>
                        המידע שנאסף משמש אותנו לצורך:
                    </p>
                    <ul className="list-disc mr-6">
                        <li>עיבוד וביצוע הזמנות.</li>
                        <li>יצירת קשר במקרה של צורך בעדכון לגבי הזמנה.</li>
                        <li>שיפור חווית המשתמש באתר.</li>
                        <li>שליחת עדכונים ומבצעים (רק במידה ואישרת זאת במפורש).</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">3. עוגיות (Cookies)</h2>
                    <p>
                        האתר משתמש ב"עוגיות" (Cookies) לצורך תפעולו השוטף והתקין, ובכלל זה כדי לאסוף נתונים סטטיסטיים אודות השימוש באתר, לאימות פרטים, וכדי להתאים את האתר להעדפותיך האישיות.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">4. אבטחת מידע ותשלומים</h2>
                    <p>
                        אתר זה עומד בסטנדרטים המחמירים של אבטחת מידע.
                        פרטי כרטיס האשראי אינם נשמרים בשרתי האתר. הסליקה מתבצעת באופן מאובטח ותקני (PCI-DSS) על ידי חברת סליקה חיצונית מאושרת.
                        אנו נוקטים באמצעי אבטחה טכנולוגיים וארגוניים כדי להגן על המידע שלך מפני גישה בלתי מורשית.
                    </p>
                </section>
            </div>
        </div>
    );
}
