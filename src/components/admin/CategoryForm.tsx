"use client";

import { useForm } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface CategoryFormValues {
    name: string;
    slug: string;
    image_url: string;
    sort_order: number;
    is_visible: boolean;
}

export function CategoryForm() {
    const router = useRouter();
    const [error, setError] = useState("");

    const form = useForm<CategoryFormValues>({
        defaultValues: {
            name: "",
            slug: "",
            image_url: "",
            sort_order: 0,
            is_visible: true,
        },
    });

    // Auto-generate slug from name
    function generateSlug(name: string) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\u0590-\u05FF\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    }

    async function onSubmit(values: CategoryFormValues) {
        setError("");

        const slug = values.slug || generateSlug(values.name);

        const { error: insertError } = await supabase.from("categories").insert({
            name: values.name,
            slug,
            image_url: values.image_url || null,
            sort_order: Number(values.sort_order),
            is_visible: values.is_visible,
        });

        if (insertError) {
            if (insertError.code === '23505') {
                setError("קטגוריה עם slug זה כבר קיימת במערכת");
            } else {
                setError("אירעה שגיאה בשמירת הקטגוריה: " + insertError.message);
            }
            return;
        }

        router.push("/admin/categories");
        router.refresh();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-2xl border shadow-sm max-w-2xl mx-auto">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        rules={{ required: "שם חובה" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-900 font-bold">שם הקטגוריה</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="למשל: פירות וירקות"
                                        {...field}
                                        className="h-12 rounded-xl"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            if (!form.getValues("slug")) {
                                                form.setValue("slug", generateSlug(e.target.value));
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="slug"
                        rules={{ required: "Slug חובה" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-900 font-bold">מזהה ייחודי (Slug)</FormLabel>
                                <FormControl>
                                    <Input placeholder="fruits-vegetables" {...field} className="h-12 rounded-xl" dir="ltr" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-slate-900 font-bold">תמונת קטגוריה</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    value={field.value}
                                    onChange={field.onChange}
                                    folder="categories"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <FormField
                        control={form.control}
                        name="sort_order"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-900 font-bold">סדר תצוגה</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} className="h-12 rounded-xl" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="is_visible"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-xl border p-4 bg-slate-50">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base font-bold">פעיל באתר</FormLabel>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Button variant="outline" type="button" onClick={() => router.back()} className="h-12 px-8 rounded-xl font-bold">ביטול</Button>
                    <Button type="submit" className="h-12 px-12 rounded-xl font-bold bg-slate-900">שמור קטגוריה</Button>
                </div>
            </form>
        </Form>
    );
}
