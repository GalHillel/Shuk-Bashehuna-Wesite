import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { Leaf, Truck, Heart, Phone } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative h-64 md:h-80 overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80"
                        alt="שוק בשכונה - פירות וירקות טריים"
                        fill
                        className="object-cover brightness-50"
                        priority
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
                            🥬 שוק בשכונה
                        </h1>
                    </div>
                </section>

                <div className="container max-w-4xl py-12 space-y-12">
                    {/* Story */}
                    <section className="space-y-4 text-lg leading-relaxed">
                        <h2 className="text-3xl font-bold text-primary">הסיפור שלנו</h2>
                        <p>
                            ״שוק בשכונה״ הוקם מתוך אהבה אמיתית לאדמה ולתוצרת החקלאית הישראלית.
                            אנחנו דור שלישי למשפחת חקלאים, ומביאים אליכם את הסיפור שמאחורי כל עגבנייה ומלפפון.
                        </p>
                        <p>
                            החלום שלנו הוא להגיע אליכם הביתה עם המשלוח המושלם – כזה שמרגיש כאילו קטפתם את התוצרת בעצמכם רגע לפני שהגיעה לדלת.
                            אנחנו מתחייבים לטריות, לאיכות ולשירות ללא פשרות.
                        </p>
                    </section>

                    {/* Values Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                icon: Leaf,
                                title: "טריות ללא פשרות",
                                desc: "כל המוצרים נקטפים ומגיעים טריים ישירות מהשדה אליכם הביתה",
                                color: "text-green-600 bg-green-50",
                            },
                            {
                                icon: Truck,
                                title: "משלוח עד הבית",
                                desc: "שליח ידידותי יביא את ההזמנה ישירות לדלת שלכם, בשעה שנוחה לכם",
                                color: "text-blue-600 bg-blue-50",
                            },
                            {
                                icon: Heart,
                                title: "תמיכה בחקלאות ישראלית",
                                desc: "כשאתם קונים אצלנו, אתם תומכים ישירות במשקים ובמטעים הנפלאים של ארצנו",
                                color: "text-red-600 bg-red-50",
                            },
                            {
                                icon: Phone,
                                title: "שירות לקוחות מעולה",
                                desc: "צוות שירות הלקוחות שלנו זמין מ-7:00 ועד 22:00 לכל שאלה ובקשה",
                                color: "text-purple-600 bg-purple-50",
                            },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} className="p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                                    <div className={`inline-flex p-3 rounded-lg mb-4 ${item.color}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.desc}</p>
                                </div>
                            );
                        })}
                    </section>

                    {/* Image + Text */}
                    <section className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="relative h-64 rounded-xl overflow-hidden shadow-md">
                            <Image
                                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=80"
                                alt="חקלאות ישראלית"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">בית לחקלאות ישראלית 🇮🇱</h2>
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                אנחנו מעודדים חקלאות כחול-לבן! שוק בשכונה הוקם מתוך אידיאל עקרוני –
                                להעניק לחקלאי הישראלי בית, ולחקלאות הישראלית במה.
                            </p>
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                כשאתם קונים אצלנו, אתם תומכים ישירות במשקים ובמטעים הנפלאים של ארצנו.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
