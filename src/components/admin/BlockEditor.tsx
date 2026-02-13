/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockEditor({ defaultValues }: { defaultValues?: any }) {
    const form = useForm({
        defaultValues: defaultValues || {
            type: 'product_carousel',
            title: '',
            sort_order: 0,
            is_active: true,
            data_json: '{}',
        },
    });

    function onSubmit(values: any) {
        console.log(values);
        // Submit logic here
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-xl border">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>סוג בלוק</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="בחר סוג בלוק" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="hero_slider">באנר ראשי (סליידר)</SelectItem>
                                        <SelectItem value="category_grid">גריד קטגוריות</SelectItem>
                                        <SelectItem value="product_carousel">קרוסלת מוצרים</SelectItem>
                                        <SelectItem value="text_banner">באנר טקסט</SelectItem>
                                        <SelectItem value="banners_grid">גריד באנרים</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sort_order"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>סדר תצוגה</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>כותרת (אופציונלי)</FormLabel>
                            <FormControl>
                                <Input placeholder="למשל: המבצעים שלנו" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="data_json"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>נתונים (JSON)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder='{"items": [...]}'
                                    className="font-mono h-40"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                הנתונים הגולמיים עבור הבלוק בפורמט JSON
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">שמור שינויים</Button>
            </form>
        </Form>
    );
}
