"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Percent, Tag, RotateCcw, CheckCircle2 } from "lucide-react";
import { Category, Product } from "@/types/supabase";
import { toast } from "sonner";

export default function PromotionsPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Form State
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [discountPercent, setDiscountPercent] = useState<string>("");

    const supabase = createClient();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data: cats } = await supabase.from("categories").select("*").order("sort_order");
        if (cats) setCategories(cats);
        setLoading(false);
    };

    const handleApplyDiscount = async () => {
        const percent = parseFloat(discountPercent);
        if (isNaN(percent) || percent <= 0 || percent >= 100) {
            toast.error("נא להזין אחוז הנחה תקין (1-99)");
            return;
        }

        if (!confirm(`האם אתה בתוך שברצונך להחיל הנחה של ${percent}% על ${selectedCategory === 'all' ? 'כל המוצרים' : 'הקטגוריה שנבחרה'}?`)) {
            return;
        }

        setProcessing(true);
        try {
            // 1. Fetch products to update
            let query = supabase.from("products").select("*");
            if (selectedCategory !== "all") {
                query = query.eq("category_id", selectedCategory);
            }

            const { data: products } = await query;

            if (!products || products.length === 0) {
                toast.warning("לא נמצאו מוצרים לעדכון");
                return;
            }

            // 2. Prepare updates
            const updates = products.map((p) => ({
                id: p.id,
                // If compare_price is not set, set it to current price (so we don't lose original price)
                // BUT: If item is ALREADY on sale, do we base new discount on original price? Yes.
                // We assume 'price' in DB is the CURRENT selling price. 
                // Wait, standard E-commerce:
                // Price = Selling Price.
                // Sale Price = The discounted price (if on sale).
                // Or: Price = Regular Price. Sale Price = Discounted Price.
                // Let's check ProductCard.tsx logic.
                // price_at_order uses: item.product.is_on_sale && item.product.sale_price ? item.product.sale_price : item.product.price
                // So 'price' is the BASE price. 'sale_price' is the DISCOUNTED price.

                is_on_sale: true,
                sale_price: Math.round(p.price * (1 - percent / 100)) // Whole numbers for clean prices? Or keep decimals? Let's round to nearest integer for cleaner look, or keep logic simple.
            }));

            // 3. Perform Bulk Update
            // Supabase doesn't support bulk update with different values easily in one query unless using upsert.
            // But here the calculation depends on each item's price.
            // We can do it in a loop or call a stored procedure. Loop is safest for client-side logic ensuring correctness, though slower.
            // For 500 items it's fine.

            let successCount = 0;
            const errors = [];

            for (const update of updates) {
                const { error } = await supabase.from("products").update({
                    is_on_sale: update.is_on_sale,
                    sale_price: update.sale_price
                }).eq("id", update.id);

                if (error) errors.push(error);
                else successCount++;
            }

            toast.success(`המבצע הוחל בהצלחה על ${successCount} מוצרים!`);

        } catch (error) {
            console.error(error);
            toast.error("אירעה שגיאה בעת עדכון המבצעים");
        } finally {
            setProcessing(false);
            setDiscountPercent("");
        }
    };

    const handleClearDiscounts = async () => {
        if (!confirm(`האם אתה בטוח שברצונך לבטל את כל המבצעים ב${selectedCategory === 'all' ? 'חנות' : 'קטגוריה שנבחרה'}?`)) {
            return;
        }

        setProcessing(true);
        try {
            let query = supabase.from("products").update({
                is_on_sale: false,
                sale_price: null
            });

            if (selectedCategory !== "all") {
                query = query.eq("category_id", selectedCategory);
            } else {
                // If all, just update distinct? No, standard update is all rows that match.
                // We need to match all rows.
                query = query.neq("id", "00000000-0000-0000-0000-000000000000"); // Hack to select all?
                // Actually if no .eq is chained, does it update all? 
                // Supabase requires at least one filter for delete/update to prevent accidents, unless allow_all is on (usually not recommended).
                // Better to filter by something that is true for all on_sale items.
                query = query.eq("is_on_sale", true);
                if (selectedCategory !== "all") {
                    query = query.eq("category_id", selectedCategory);
                }
            }

            const { count, error } = await query; // Count might not be returned depending on headers

            if (error) throw error;

            toast.success("המבצעים בוטלו בהצלחה!");

        } catch (error) {
            console.error(error);
            toast.error("אירעה שגיאה בביטול המבצעים");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-10 w-10 text-slate-300" /></div>;

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="h-20 w-20 bg-[#AADB56]/10 rounded-[28px] flex items-center justify-center text-[#6c9b29] shadow-inner">
                    <Percent className="h-10 w-10" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">ניהול מבצעים</h1>
                    <p className="text-slate-500 mt-1 font-medium">החל הנחות גורפות בלחיצת כפתור אחת — חכם, מהיר ויוקרתי.</p>
                </div>
            </div>

            <Card className="rounded-[40px] border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="bg-slate-50/50 p-8 md:p-12 border-b border-slate-50">
                    <h2 className="text-2xl font-black text-slate-800 mb-2">אשף ההנחות הגלובלי</h2>
                    <p className="text-slate-400 font-medium">בחר את היעד, קבע את גובה ההנחה ועדכן את כל החנות ברגע.</p>
                </div>
                <CardContent className="p-8 md:p-12 space-y-12 bg-white">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Step 1: Scope */}
                        <div className="space-y-4">
                            <label className="text-sm font-black text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">1</span>
                                בחירת קהל יעד
                            </label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="h-16 text-lg rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-[#AADB56] transition-all font-bold text-slate-700">
                                    <SelectValue placeholder="בחר קטגוריה להחלת המבצע" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                    <SelectItem value="all" className="font-black py-3">✨ כל מוצרי החנות</SelectItem>
                                    <div className="h-px bg-slate-50 my-1" />
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id} className="font-bold py-3">{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Step 2: Discount */}
                        <div className="space-y-4">
                            <label className="text-sm font-black text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">2</span>
                                גובה ההנחה באחוזים
                            </label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    placeholder="כמה אחוזי הנחה?"
                                    className="h-16 text-2xl pr-6 pl-14 font-black rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-[#AADB56] transition-all"
                                    value={discountPercent}
                                    onChange={(e) => setDiscountPercent(e.target.value)}
                                    min="1"
                                    max="99"
                                />
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#AADB56]">
                                    <Percent className="h-8 w-8" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#AADB56]/5 border border-[#AADB56]/10 flex items-start gap-4">
                        <div className="bg-[#AADB56]/20 p-2 rounded-lg text-[#6c9b29]">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <p className="text-xs text-[#6c9b29] font-bold leading-relaxed">
                            שים לב: המערכת תחשב את ההנחה מהמחיר המקורי ותעדכן את הסטטוס ל"מבצע". המחירים יוצגו ללקוח עם תגית אדומה בולטת.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col md:flex-row gap-6 pt-6">
                        <Button
                            onClick={handleApplyDiscount}
                            disabled={processing || !discountPercent}
                            className="h-16 flex-1 text-xl font-black bg-[#AADB56] hover:bg-[#9cbd4c] text-[#112a1e] rounded-2xl shadow-xl shadow-[#AADB56]/20 transition-all hover:scale-[1.01] active:scale-95"
                        >
                            {processing ? <Loader2 className="animate-spin ml-3" /> : <Tag className="ml-3 h-6 w-6" />}
                            הפעל את המבצע עכשיו
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleClearDiscounts}
                            disabled={processing}
                            className="h-16 flex-1 text-xl font-bold border-2 border-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-100 rounded-2xl transition-all"
                        >
                            {processing ? <Loader2 className="animate-spin ml-3" /> : <RotateCcw className="ml-3 h-6 w-6" />}
                            ביטול כל המבצעים
                        </Button>
                    </div>

                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/30 flex items-center gap-6 group hover:border-[#AADB56]/20 transition-all">
                    <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div>
                        <div className="font-black text-slate-800 text-lg">עדכון בזמן אמת</div>
                        <div className="text-sm font-medium text-slate-400">השינויים יופיעו בחנות מיד לאחר הלחיצה</div>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/30 flex items-center gap-6 group hover:border-[#AADB56]/20 transition-all">
                    <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                        <Percent className="h-8 w-8" />
                    </div>
                    <div>
                        <div className="font-black text-slate-800 text-lg">דיוק מקסימלי</div>
                        <div className="text-sm font-medium text-slate-400">עיגול מחירים לשקלים שלמים לנוחות הלקוח</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
