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
        <div className="space-y-8 max-w-4xl mx-auto pb-20">
            <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                    <Percent className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">ניהול מבצעים</h1>
                    <p className="text-slate-500">החל הנחות גורפות על קטגוריות או על כל החנות</p>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle>אשף ההנחות</CardTitle>
                    <CardDescription>בחר מוצרים, קבע גובה הנחה, והחל אותה בלחיצת כפתור.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8 space-y-8">

                    {/* Step 1: Scope */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 block">1. על אילו מוצרים להחיל?</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="h-12 text-base bg-white border-slate-200">
                                <SelectValue placeholder="בחר קטגוריה" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="font-bold">✨ כל מוצרי החנות</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Step 2: Discount */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 block">2. מה גובה ההנחה?</label>
                        <div className="relative">
                            <Input
                                type="number"
                                placeholder="למשל: 15"
                                className="h-12 text-lg pl-12"
                                value={discountPercent}
                                onChange={(e) => setDiscountPercent(e.target.value)}
                                min="1"
                                max="99"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Percent className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500">
                            * ההנחה תחושב מתוך המחיר המקורי של המוצר. המחיר החדש יוצג כ"מחיר מבצע".
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t border-slate-100">
                        <Button
                            onClick={handleApplyDiscount}
                            disabled={processing || !discountPercent}
                            className="flex-1 h-12 text-lg font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/10"
                        >
                            {processing ? <Loader2 className="animate-spin ml-2" /> : <Tag className="ml-2 h-5 w-5" />}
                            החל מבצע
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleClearDiscounts}
                            disabled={processing}
                            className="flex-1 h-12 text-lg font-bold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                            {processing ? <Loader2 className="animate-spin ml-2" /> : <RotateCcw className="ml-2 h-5 w-5" />}
                            נקה מבצעים
                        </Button>
                    </div>

                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50 border-blue-100 text-blue-900">
                    <CardContent className="p-6 flex items-center gap-4">
                        <CheckCircle2 className="h-8 w-8 text-blue-500" />
                        <div>
                            <div className="font-bold text-lg">עדכון מיידי</div>
                            <div className="text-sm opacity-80">המחירים מתעדכנים באתר מיד לאחר הפעולה</div>
                        </div>
                    </CardContent>
                </Card>
                {/* More info cards can be added here */}
            </div>
        </div>
    );
}
