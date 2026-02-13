import { SiteHeader } from "@/components/site-header";
import { MapPin, Phone, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BRANCHES = [
    { name: "ראש העין - שכונה C", address: "מרכז מסחרי שכונה C, ראש העין", status: "בקרוב" },
    { name: "אור יהודה - Outlet", address: "מתחם העסקים החדש, אור יהודה", status: "חדש!" },
    { name: "ראשון לציון", address: "רוטשילד 45, ראשון לציון", status: "פתוח" },
    { name: "כפר סבא - Outlet", address: "ויצמן 120, כפר סבא", status: "פתוח" },
    { name: "באר יעקב", address: "קניון באר יעקב", status: "פתוח" },
    { name: "רמת אפעל", address: "אלוף שדה 10, רמת גן", status: "פתוח" },
    { name: "סביון", address: "המרכז המסחרי סביון", status: "פתוח" },
    { name: "קריית אונו", address: "קניון קריית אונו", status: "פתוח" },
    { name: "שרונה מרקט ת״א", address: "שרונה מרקט, תל אביב", status: "פתוח" },
    { name: "גבעתיים", address: "ויצמן 20, גבעתיים", status: "פתוח" },
    { name: "גבעת שמואל", address: "קניון הגבעה, גבעת שמואל", status: "פתוח" },
];

export default function BranchesPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 container py-12">
                <h1 className="text-4xl font-bold mb-4 text-center text-primary">הסניפים שלנו</h1>
                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                    לרשת &quot;שוק אונליין&quot; סניפים יפהפיים ברחבי הארץ, כולל סניפי אאוטלט ייחודים עם תוצרת חקלאית טרייה, איכותית וטעימה.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {BRANCHES.map((branch, idx) => (
                        <Card key={idx} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    {branch.name}
                                    {branch.status !== "פתוח" && (
                                        <span className={`text-xs px-2 py-1 rounded-full ${branch.status === 'חדש!' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {branch.status}
                                        </span>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>{branch.address}</span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    <span>03-1234567</span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>א׳-ה׳: 08:00-22:00, ו׳: 08:00-14:00</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
