"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { useState, useEffect } from "react";
import { Category, Product } from "@/types/supabase";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface ProductFormProps {
    product?: Product;
}

interface ProductFormValues {
    name: string;
    slug: string;
    description: string;
    price: string;
    sale_price: string;
    is_on_sale: boolean;
    unit_type: string;
    stock_quantity: string;
    image_url: string;
    category_id: string;
    is_active: boolean;
}

export function ProductForm({ product }: ProductFormProps) {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const isEditing = !!product;

    useEffect(() => {
        const fetchCats = async () => {
            console.log("Fetching categories...");
            const { data, error } = await supabase.from("categories").select("*").order("name");
            if (error) {
                console.error("Error fetching categories:", JSON.stringify(error, null, 2));
                // toast.error("Failed to load categories");
            } else {
                console.log("Categories loaded:", data);
                if (data) setCategories(data as Category[]);
            }
        };
        fetchCats();
    }, []);

    const form = useForm<ProductFormValues>({
        defaultValues: {
            name: product?.name || "",
            slug: product?.slug || "",
            description: product?.description || "",
            price: product?.price?.toString() || "0",
            sale_price: product?.sale_price?.toString() || "",
            is_on_sale: product?.is_on_sale || false,
            unit_type: product?.unit_type || "kg",
            stock_quantity: product?.stock_quantity?.toString() || "100",
            image_url: product?.image_url || "",
            category_id: product?.category_id || "",
            is_active: product?.is_active ?? true,
        },
    });

    function generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\u0590-\u05FF\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    }

    async function onSubmit(values: ProductFormValues) {
        setError("");
        setSubmitting(true);

        const productData = {
            name: values.name,
            slug: values.slug || generateSlug(values.name),
            description: values.description || null,
            price: parseFloat(values.price),
            sale_price: values.sale_price ? parseFloat(values.sale_price) : null,
            is_on_sale: values.is_on_sale,
            unit_type: values.unit_type as "kg" | "unit" | "pack",
            stock_quantity: parseInt(values.stock_quantity, 10),
            image_url: values.image_url || null,
            category_id: values.category_id || null,
            is_active: values.is_active,
        };

        let result;

        if (isEditing) {
            result = await supabase
                .from("products")
                .update(productData)
                .eq("id", product.id);
        } else {
            result = await supabase
                .from("products")
                .insert([productData]);
        }

        if (result.error) {
            setError("אירעה שגיאה בשמירת המוצר: " + result.error.message);
            setSubmitting(false);
            return;
        }

        router.push("/admin/products");
        router.refresh();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-2xl border shadow-sm max-w-3xl mx-auto">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        rules={{ required: "שם מוצר חובה" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-900 font-bold">שם המוצר</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="למשל: תפוח עץ מוזהב"
                                        {...field}
                                        className="h-12 rounded-xl"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            if (!isEditing && !form.getValues("slug")) {
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
                                    <Input placeholder="golden-apple" {...field} className="h-12 rounded-xl" dir="ltr" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-slate-900 font-bold">תיאור מוצר (אופציונלי)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="תאר את המוצר..." {...field} className="rounded-xl min-h-[100px]" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-slate-900 font-bold">תמונת מוצר</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    value={field.value}
                                    onChange={field.onChange}
                                    folder="products"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="price"
                        rules={{ required: "מחיר חובה" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-900 font-bold">מחיר (₪)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.1" {...field} className="h-12 rounded-xl" dir="ltr" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="unit_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-900 font-bold">יחידת מידה</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 rounded-xl">
                                            <SelectValue placeholder="בחר יחידה" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="kg">קילוגרם (ק&quot;ג)</SelectItem>
                                        <SelectItem value="unit">יחידה</SelectItem>
                                        <SelectItem value="pack">מארז</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category_id"
                        rules={{ required: "קטגוריה חובה" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-900 font-bold">קטגוריה</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 rounded-xl">
                                            <SelectValue placeholder="בחר קטגוריה" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="stock_quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-900 font-bold">כמות במלאי</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} className="h-12 rounded-xl" dir="ltr" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sale_price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-900 font-bold">מחיר מבצע (₪)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.1" placeholder="השאר ריק אם אין מבצע" {...field} className="h-12 rounded-xl" dir="ltr" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex items-center gap-8 p-4 bg-slate-50 rounded-xl">
                    <FormField
                        control={form.control}
                        name="is_active"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-3">
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel className="!mt-0 font-bold">מוצר פעיל</FormLabel>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="is_on_sale"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-3">
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel className="!mt-0 font-bold">מוצר במבצע</FormLabel>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button variant="outline" type="button" onClick={() => router.back()} className="h-12 px-8 rounded-xl font-bold">
                        ביטול
                    </Button>
                    <Button type="submit" className="h-12 px-12 rounded-xl font-bold bg-slate-900" disabled={submitting}>
                        {submitting ? (
                            <>
                                <Loader2 className="animate-spin ml-2 h-4 w-4" />
                                שומר...
                            </>
                        ) : (
                            isEditing ? "עדכן מוצר" : "שמור מוצר"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
