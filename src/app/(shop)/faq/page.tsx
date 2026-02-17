import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
    {
        question: "איך שומרים על טריות המשלוח?",
        answer: "כל ההזמנות נלקטות בקפידה ביום המשלוח עצמו, ממש לפני היציאה להפצה. אנחנו משתמשים ברכבים ממוזגים ושומרים על שרשרת קירור כדי שהתוצרת תגיע אליכם טרייה ורעננה."
    },
    {
        question: "מה קורה במידה ויש חוסר במוצר שהזמנתי?",
        answer: "במידה ויש חוסר במוצר מסוים, נציג מטעמנו ייצור איתכם קשר טלפוני לפני סגירת ההזמנה כדי להציע תחליף הולם או לזכות אתכם."
    },
    {
        question: "האם יש מינימום הזמנה?",
        answer: "כן, מינימום הזמנה באתר הוא 150 ₪."
    },
    {
        question: "מהי עלות המשלוח?",
        answer: "עלות המשלוח היא 28 ₪ לכל האזורים."
    },
    {
        question: "איך מתבצע התשלום?",
        answer: "התשלום מתבצע בכרטיס אשראי בלבד. החיוב הסופי מתבצע רק לאחר השקילה והליקוט בפועל, כך שתשלמו בדיוק על מה שקיבלתם."
    },
    {
        question: "מה לעשות אם לא הייתי מרוצה ממוצר מסוים?",
        answer: "אנחנו לוקחים אחריות מלאה על התוצרת שלנו! אם קיבלתם מוצר שאינו לשביעות רצונכם, צרו איתנו קשר דרך האתר או בטלפון תוך 24 שעות מקבלת המשלוח, ונשמח לפצות אתכם."
    }
];

export default function FAQPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1 container py-12 max-w-3xl">
                <h1 className="text-4xl font-bold mb-8 text-center text-primary">שאלות נפוצות</h1>

                <Accordion type="single" collapsible className="w-full">
                    {FAQS.map((faq, idx) => (
                        <AccordionItem key={idx} value={`item-${idx}`}>
                            <AccordionTrigger className="text-lg text-right">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </main>
        </div>
    );
}
