import { SiteHeader } from "@/components/site-header";
import { Truck, Map, Clock } from "lucide-react";

export default function DeliveryPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 container py-12 max-w-3xl">
                <h1 className="text-4xl font-bold mb-8 text-center text-primary">משלוחים ואזורי חלוקה</h1>

                <div className="space-y-8">
                    <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 flex flex-col items-center text-center">
                        <Truck className="h-12 w-12 text-primary mb-4" />
                        <h2 className="text-2xl font-bold mb-2">עלות דמי משלוח</h2>
                        <p className="text-xl font-bold text-primary">28 ₪ למשלוח</p>
                        <p className="text-muted-foreground mt-2">
                            מינימום הזמנה: 150 ₪
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="border p-6 rounded-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <Map className="h-6 w-6 text-primary" />
                                <h3 className="font-bold text-lg">אזורי חלוקה</h3>
                            </div>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li>תל אביב - יפו</li>
                                <li>רמת גן</li>
                                <li>גבעתיים</li>
                                <li>פתח תקווה</li>
                                <li>ראש העין והסביבה</li>
                                <li>בקעת אונו (קריית אונו, גני תקווה, סביון)</li>
                                <li>ראשון לציון</li>
                                <li>חולון ובת ים</li>
                            </ul>
                        </div>

                        <div className="border p-6 rounded-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="h-6 w-6 text-primary" />
                                <h3 className="font-bold text-lg">זמני חלוקה</h3>
                            </div>
                            <p className="text-muted-foreground mb-4">
                                אנחנו מחלקים משלוחים בימים א׳-ה׳ בין השעות 14:00 ל-22:00.
                                בימי ו׳ וערבי חג בין השעות 08:00 ל-14:00.
                            </p>
                            <p className="font-medium">
                                ניתן לבחור חלון זמן מועדף בעת התשלום בקופה.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
