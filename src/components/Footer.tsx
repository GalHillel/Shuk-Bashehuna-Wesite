import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Truck } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 mt-12">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white">🥬 שוק בשכונה</h3>
                        <p className="text-sm leading-relaxed">
                            פירות וירקות טריים ישירות מהחקלאי אליכם הביתה.
                            איכות ללא פשרות, טעם שמדבר בעד עצמו.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white">קישורים מהירים</h4>
                        <nav className="flex flex-col gap-2 text-sm">
                            <Link href="/" className="hover:text-primary transition-colors">דף הבית</Link>
                            <Link href="/about" className="hover:text-primary transition-colors">אודות</Link>
                            <Link href="/category/specials" className="hover:text-primary transition-colors">מבצעים</Link>
                            <Link href="/checkout" className="hover:text-primary transition-colors">עגלת קניות</Link>
                        </nav>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white">צרו קשר</h4>
                        <div className="flex flex-col gap-3 text-sm">
                            <a href="tel:03-1234567" className="flex items-center gap-2 hover:text-primary transition-colors">
                                <Phone className="h-4 w-4 flex-shrink-0" />
                                03-1234567
                            </a>
                            <a href="mailto:hello@shuk-bashehuna.co.il" className="flex items-center gap-2 hover:text-primary transition-colors" dir="ltr">
                                <Mail className="h-4 w-4 flex-shrink-0" />
                                hello@shuk-bashehuna.co.il
                            </a>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 flex-shrink-0" />
                                <span>רחוב השוק 1, תל אביב</span>
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white">מידע</h4>
                        <div className="flex flex-col gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 flex-shrink-0" />
                                <span>א-ה: 07:00–21:00 | ו: 07:00–14:00</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 flex-shrink-0" />
                                <span>משלוח חינם מעל ₪300</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-8 pt-6 text-center text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} שוק בשכונה. כל הזכויות שמורות.</p>
                </div>
            </div>
        </footer>
    );
}
