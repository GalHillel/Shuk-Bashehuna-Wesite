/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
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
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { HeroSliderEditor } from "./editors/HeroSliderEditor";
import { ProductCarouselEditor } from "./editors/ProductCarouselEditor";
import { BannersGridEditor } from "./editors/BannersGridEditor";
import { TextBannerEditor } from "./editors/TextBannerEditor";
import { revalidateHomepage } from "@/app/actions/revalidate";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlockEditor({ defaultValues }: { defaultValues?: any }) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    // Normalize default values if editing existing block
    const initialValues = defaultValues ? {
        ...defaultValues,
        title: defaultValues.title || "",
        data: typeof defaultValues.data === 'string'
            ? JSON.parse(defaultValues.data)
            : (defaultValues.data || {})
    } : {
        type: 'product_carousel',
        title: '',
        sort_order: 10,
        is_active: true,
        data: {}, // Initialize as empty object instead of string JSON
    };

    const form = useForm({
        defaultValues: initialValues,
    });

    const blockType = useWatch({ control: form.control, name: "type" });

    async function onSubmit(values: any) {
        setSubmitting(true);
        // console.log("Submitting values:", values);

        try {
            // Prepare payload
            const payload = {
                type: values.type,
                title: values.title || null,
                sort_order: parseInt(values.sort_order),
                is_active: values.is_active,
                // Data is already an object, no need to parse text
                data: values.data || {},
                updated_at: new Date().toISOString(),
            };

            let result;
            if (defaultValues?.id) {
                // Update
                result = await supabase
                    .from("content_blocks")
                    .update(payload)
                    .eq("id", defaultValues.id);
            } else {
                // Insert
                result = await supabase
                    .from("content_blocks")
                    .insert([payload]);
            }

            if (result.error) {
                throw result.error;
            }

            // Revalidate homepage
            await revalidateHomepage();

            // Redirect back to content list
            router.push("/admin/content");
            router.refresh();
        } catch (error) {
            console.error("Error saving block:", error);
            alert("שגיאה בשמירת הבלוק");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-2xl border shadow-sm max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">סוג בלוק</FormLabel>
                                <Select onValueChange={(val) => {
                                    field.onChange(val);
                                    // Optionally reset data when type changes
                                    // form.setValue("data", {}); 
                                }} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12">
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
                                <FormLabel className="font-bold">סדר תצוגה</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} className="h-12" />
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
                            <FormLabel className="font-bold">כותרת (אופציונלי)</FormLabel>
                            <FormControl>
                                <Input placeholder="למשל: המבצעים שלנו" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="my-8 border-t pt-8">
                    {blockType === 'hero_slider' && <HeroSliderEditor />}
                    {blockType === 'product_carousel' && <ProductCarouselEditor />}
                    {blockType === 'banners_grid' && <BannersGridEditor />}
                    {blockType === 'text_banner' && <TextBannerEditor />}
                    {blockType === 'category_grid' && (
                        <div className="p-6 bg-blue-50 text-blue-800 rounded-xl">
                            <h3 className="font-bold mb-2">גריד קטגוריות</h3>
                            <p>בלוק זה מציג אוטומטית את כל הקטגוריות הפעילות באתר. אין צורך בהגדרות נוספות.</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <Button type="submit" className="h-12 px-12 rounded-xl font-bold text-lg" disabled={submitting}>
                        {submitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                        {defaultValues?.id ? "עדכן בלוק" : "צור בלוק חדש"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
