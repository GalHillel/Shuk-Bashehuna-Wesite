
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "הצהרת נגישות | שוק בשכונה",
    description: "הצהרת נגישות והסדרי נגישות באתר שוק בשכונה",
};

export default function AccessibilityPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-center">הצהרת נגישות</h1>

            <div className="prose prose-lg max-w-none text-right" dir="rtl">
                <section className="mb-8">
                    <p>
                        אנו ב"שוק בשכונה" רואים חשיבות רבה במתן שירות שוויוני לכלל הלקוחות ובשיפור השירות הניתן ללקוחות עם מוגבלות.
                        לשם כך אנו משקיעים משאבים רבים בהנגשת האתר שלנו, במטרה לאפשר למרבית האוכלוסייה לגלוש בו בקלות ובנוחות.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">רמת הנגישות</h2>
                    <p>
                        האתר נבנה בהתאם להוראות נגישות תכנים באינטרנט WCAG 2.1 ברמה AA.
                    </p>
                    <p>
                        אנו משתמשים ברכיב נגישות המאפשר:
                    </p>
                    <ul className="list-disc mr-6">
                        <li>הגדלת גודל הטקסט.</li>
                        <li>שינוי ניגודיות (קונטרסט) גבוהה.</li>
                        <li>ביטול צבעים (גווני אפור).</li>
                        <li>הדגשת קישורים.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">סייגים לנגישות</h2>
                    <p>
                        למרות מאמצנו להנגיש את כלל הדפים באתר, ייתכן ויתגלו חלקים שטרם הונגשו.
                        אנו ממשיכים במאמצים לשפר את הנגישות כחלק ממחויבותנו לאפשר שימוש בו עבור כלל האוכלוסייה.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">פרטי רכז נגישות</h2>
                    <p>
                        במידה ונתקלתם בקושי לגלוש באתר או שיש לכם הערה בנושא, ליצירת קשר ניתן לפנות לרכז הנגישות שלנו:
                    </p>
                    <ul className="list-disc mr-6 mt-2">
                        <li><strong>שם:</strong> [שם רכז נגישות]</li>
                        <li><strong>טלפון:</strong> [מספר טלפון]</li>
                        <li><strong>דוא"ל:</strong> [כתובת דוא"ל]</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
