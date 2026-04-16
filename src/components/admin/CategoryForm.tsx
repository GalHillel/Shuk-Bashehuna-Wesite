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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { deleteImageFromStorage } from "@/lib/storage-utils";
import { generateSlug } from "@/lib/slug-utils";

import { Category } from "@/types/supabase";

interface CategoryFormValues {
    name: string;
    slug: string;
    parent_id: string;
    image_url: string;
    sort_order: number;
    is_visible: boolean;
}

interface CategoryFormProps {
    defaultValues?: Category;
}

export function CategoryForm({ defaultValues }: CategoryFormProps) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [parentCategories, setParentCategories] = useState<Category[]>([]);
    const isEditing = !!defaultValues;

    const form = useForm<CategoryFormValues>({
        defaultValues: {
            name: defaultValues?.name || "",
            slug: (defaultValues as any)?.slug || "", 
            parent_id: defaultValues?.parent_id || "none",
            image_url: defaultValues?.image_url || "",
            sort_order: defaultValues?.sort_order || 0,
            is_visible: defaultValues?.is_visible ?? true,
        },
    });



    // Fetch eligible parent categories
    useEffect(() => {
        const fetchParents = async () => {
            let query = supabase.from("categories").select("*").is("parent_id", null);
            if (isEditing && (defaultValues as any)?.id) {
                 query = query.neq("id", (defaultValues as any).id);
            }
            const { data } = await query;
            if (data) setParentCategories(data as Category[]);
        };
        fetchParents();
    }, [isEditing, defaultValues]);

    // Auto-fetch max sort_order for new categories
    useEffect(() => {
        if (!isEditing) {
            const fetchMaxOrder = async () => {
                const { data } = await supabase
                    .from("categories")
                    .select("sort_order")
                    .order("sort_order", { ascending: false })
                    .limit(1);

                if (data && data.length > 0) {
                    form.setValue("sort_order", (data[0].sort_order || 0) + 10);
                } else {
                    form.setValue("sort_order", 10);
                }
            };
            fetchMaxOrder();
        }
    }, [isEditing, form]);

    async function onSubmit(values: CategoryFormValues) {
        setError("");

        const slug = values.slug || generateSlug(values.name);

        const payload = {
            name: values.name,
            slug: slug,
            parent_id: values.parent_id === "none" ? null : values.parent_id,
            image_url: values.image_url || null,
            sort_order: Number(values.sort_order),
            is_visible: values.is_visible,
        };

        let result;

        if (isEditing) {
            // Check if image changed
            if (defaultValues.image_url && values.image_url !== defaultValues.image_url) {
                await deleteImageFromStorage(defaultValues.image_url);
            }

            result = await supabase
                .from("categories")
                .update(payload)
                .eq("id", defaultValues.id);
        } else {
            // Insert WITHOUT setting 'id' manually - let Postgres generate the UUID
            result = await supabase.from("categories").insert(payload);
        }

        if (result.error) {
            if (result.error.code === '23505') {
                setError("קיים כבר קטגוריה עם שם דומה, אנא שנה את השם מעט");
            } else {
                setError("אירעה שגיאה בשמירת הקטגוריה: " + result.error.message);
            }
            return;
        }

        router.push("/admin/categories");
        router.refresh();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-4 md:p-8 rounded-2xl border shadow-sm max-w-2xl mx-auto pb-24 md:pb-8">
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
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="parent_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-900 font-bold">קטגוריית אב (תת-קטגוריה)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 rounded-xl">
                                            <SelectValue placeholder="ללא (קטגוריה ראשית)" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">ללא (קטגוריה ראשית)</SelectItem>
                                        {parentCategories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                <p className="text-xs text-muted-foreground mt-1">בחירת קטגוריית אב תהפוך קטגוריה זו לתת-קטגוריה.</p>
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
                            <p className="text-xs text-muted-foreground mt-2 font-medium">✨ מומלץ להעלות תמונה אנכית (לדוגמה: פוסטר) במידות 400x500 פיקסלים. התמונה תוצג בפאנל הצדדי בתפריט הראשי.</p>
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

                <div className="flex items-center gap-4 pt-4 border-t md:justify-end fixed bottom-0 left-0 right-0 p-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10 md:static md:shadow-none md:bg-transparent md:border-t md:p-0 md:pt-4">
                    <Button variant="outline" type="button" onClick={() => router.back()} className="flex-1 md:flex-none h-12 px-8 rounded-xl font-bold">ביטול</Button>
                    <Button type="submit" className="flex-1 md:flex-none h-12 px-12 rounded-xl font-bold bg-slate-900 shadow-lg shadow-slate-900/20 md:shadow-none">שמור קטגוריה</Button>
                </div>
            </form>
        </Form>
    );
}
