"use client";

import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Category } from "@/types/supabase";

export function ProductCarouselEditor() {
    const { control } = useFormContext();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from("categories").select("*").eq("is_visible", true).order("name");
            if (data) setCategories(data as Category[]);
        };
        fetchCategories();
    }, []);

    return (
        <div className="space-y-6 border p-6 rounded-xl bg-slate-50">
            <h3 className="font-bold text-lg">הגדרות קרוסלה</h3>

            <FormField
                control={control}
                name="data.category_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>קטגוריה להצגה</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="בחר קטגוריה" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="specials">מבצעים</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormDescription>
                            המוצרים שיוצגו בקרוסלה ילקחו מהקטגוריה הנבחרת.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="data.limit"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>מספר מוצרים מקסימלי</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : "")}
                                className="bg-white"
                            />
                        </FormControl>
                        <FormDescription>
                            כמה מוצרים להציג בקרוסלה (מומלץ: 10)
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
