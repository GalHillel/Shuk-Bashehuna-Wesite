"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock Data Types
type OrderItem = {
    id: string;
    product_name: string;
    category: 'heavy' | 'light' | 'fragile'; // Simplification for sorting
    ordered_quantity: number;
    unit_type: 'kg' | 'unit';
    price_per_unit: number;
    actual_quantity: number | null;
    image_url?: string;
};

const MOCK_ORDER_ITEMS: OrderItem[] = [
    { id: "1", product_name: "תפוחי אדמה", category: "heavy", ordered_quantity: 3, unit_type: "kg", price_per_unit: 4.90, actual_quantity: null },
    { id: "2", product_name: "בצל יבש", category: "heavy", ordered_quantity: 2, unit_type: "kg", price_per_unit: 3.90, actual_quantity: null },
    { id: "3", product_name: "מלפפון", category: "light", ordered_quantity: 1.5, unit_type: "kg", price_per_unit: 5.90, actual_quantity: null },
    { id: "4", product_name: "עגבנייה", category: "light", ordered_quantity: 1, unit_type: "kg", price_per_unit: 6.90, actual_quantity: null },
    { id: "5", product_name: "חסה", category: "fragile", ordered_quantity: 2, unit_type: "unit", price_per_unit: 12.90, actual_quantity: null },
    { id: "6", product_name: "ביצים L", category: "fragile", ordered_quantity: 1, unit_type: "unit", price_per_unit: 25.00, actual_quantity: null },
];

export default function PickerPage() {
    const [items, setItems] = useState<OrderItem[]>(MOCK_ORDER_ITEMS);

    // Sort items: Heavy -> Light -> Fragile
    const sortedItems = [...items].sort((a, b) => {
        const order = { heavy: 1, light: 2, fragile: 3 };
        return order[a.category] - order[b.category];
    });

    const handleWeightChange = (id: string, weight: string) => {
        const value = parseFloat(weight);
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, actual_quantity: isNaN(value) ? null : value } : item
        ));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => {
            const qty = item.actual_quantity !== null ? item.actual_quantity : item.ordered_quantity;
            return sum + (qty * item.price_per_unit);
        }, 0);
    };

    return (
        <div className="container max-w-2xl py-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/"><ArrowRight className="h-6 w-6" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">ליקוט הזמנה #12345</h1>
                    <p className="text-muted-foreground">לקוח: ישראל ישראלי</p>
                </div>
            </div>

            <div className="space-y-4">
                {sortedItems.map((item) => {
                    const isWeighed = item.actual_quantity !== null;
                    // Price calculation logic moved to total calculation or used inline if needed

                    return (
                        <Card key={item.id} className={`transition-colors ${isWeighed ? 'bg-green-50/50 border-green-200' : ''}`}>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="h-12 w-12 bg-secondary rounded-md flex items-center justify-center font-bold text-lg text-secondary-foreground/50">
                                    {item.product_name.charAt(0)}
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{item.product_name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Badge variant="outline">{item.category === 'heavy' ? 'כבד' : item.category === 'fragile' ? 'שביר' : 'רגיל'}</Badge>
                                        <span>הוזמן: {item.ordered_quantity} {item.unit_type === 'kg' ? 'ק״ג' : 'יח׳'}</span>
                                    </div>
                                </div>

                                <div className="text-left min-w-[100px]">
                                    {item.unit_type === 'kg' ? (
                                        <div className="flex flex-col gap-1 items-end">
                                            <label className="text-xs text-muted-foreground">משקל בפועל</label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    step="0.05"
                                                    className="w-20 h-9 text-center font-bold"
                                                    placeholder={item.ordered_quantity.toString()}
                                                    value={item.actual_quantity ?? ''}
                                                    onChange={(e) => handleWeightChange(item.id, e.target.value)}
                                                />
                                                <span className="text-sm">ק״ג</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-1 items-end">
                                            <label className="text-xs text-muted-foreground">כמות</label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    className="w-16 h-9 text-center font-bold"
                                                    value={item.actual_quantity ?? item.ordered_quantity}
                                                    onChange={(e) => handleWeightChange(item.id, e.target.value)}
                                                />
                                                <span className="text-sm">יח׳</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card className="sticky bottom-4 border-t shadow-lg bg-background">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">סה״כ לתשלום</p>
                        <p className="text-2xl font-bold text-primary">₪{calculateTotal().toFixed(2)}</p>
                    </div>
                    <Button size="lg" className="gap-2">
                        <Check className="h-5 w-5" />
                        סיים ליקוט
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
