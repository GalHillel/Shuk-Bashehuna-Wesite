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
import { deleteImageFromStorage } from "@/lib/storage-utils";
import { toast } from "sonner";
import { safeDeleteProduct } from "@/lib/product-service";
import { generateSlug } from "@/lib/slug-utils";

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
    image_url: string;
    category_id: string;
    subcategory_id: string;
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
            const { data, error } = await supabase.from("categories").select("*").order("name");
            if (error) {
                console.error("Error fetching categories:", JSON.stringify(error, null, 2));
            } else {
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
            image_url: product?.image_url || "",
            category_id: product?.category_id || "",
            subcategory_id: product?.subcategory_id || "none",
            is_active: product?.is_active ?? true,
        },
    });

    const selectedCategoryId = form.watch("category_id");
    const parentCategories = categories.filter(c => !c.parent_id);
    const availableSubCategories = categories.filter(c => c.parent_id === selectedCategoryId);




    async function onSubmit(values: ProductFormValues) {
        setError("");
        setSubmitting(true);

        const slug = values.slug || generateSlug(values.name);

        const productData = {
            name: values.name,
            slug: slug,
            description: values.description || null,
            price: parseFloat(values.price),
            sale_price: values.sale_price ? parseFloat(values.sale_price) : null,
            is_on_sale: values.is_on_sale,
            unit_type: values.unit_type as "kg" | "unit" | "pack",
            image_url: values.image_url || null,
            category_id: values.category_id || null,
            subcategory_id: values.subcategory_id === "none" ? null : values.subcategory_id,
            is_active: values.is_active,
        };

        let result;

        if (isEditing) {
            // Check if image changed
            if (product.image_url && values.image_url !== product.image_url) {
                await deleteImageFromStorage(product.image_url);
            }

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
            console.error("Supabase error saving product:", result.error);
            if (result.error.code === '23505') {
                setError("קיים כבר מוצר עם שם דומה, אנא שנה את השם מעט");
            } else {
                setError("אירעה שגיאה בשמירת המוצר: " + result.error.message);
            }
            setSubmitting(false);
            return;
        }

        router.push("/admin/products");
        router.refresh();
    }
    async function handleDelete() {
        if (!product || !confirm(`האם אתה בטוח שברצונך למחוק את "${product.name}"?`)) return;

        setSubmitting(true);
        try {
            const result = await safeDeleteProduct(product);

            if (result.type === 'deactivated') {
                toast.error("לא ניתן למחוק מוצר המופיע בהזמנות. המוצר הועבר לסטטוס 'לא פעיל'.", {
                    description: "הסטטוס עודכן בהצלחה",
                });
                router.push("/admin/products");
                router.refresh();
            } else if (result.type === 'deleted') {
                toast.success("המוצר נמחק לצמיתות בהצלחה");
                router.push("/admin/products");
                router.refresh();
            } else if (result.type === 'error') {
                setError(result.message);
                toast.error("שגיאה במחיקה", { description: result.message });
            }
        } catch (err: any) {
            console.error("Error in handleDelete UI:", err);
            setError("אירעה שגיאה בלתי צפויה במחיקה");
            toast.error("שגיאה בלתי צפויה", { description: err.message });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-4 md:p-8 rounded-2xl border shadow-sm max-w-3xl mx-auto pb-24 md:pb-8">
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
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Slug input removed */}
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                                <FormLabel className="text-slate-900 font-bold">קטגוריה ראשית</FormLabel>
                                <Select onValueChange={(val) => { field.onChange(val); form.setValue("subcategory_id", "none"); }} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 rounded-xl">
                                            <SelectValue placeholder="בחר קטגוריה" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {parentCategories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="subcategory_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-900 font-bold">תת-קטגוריה</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={availableSubCategories.length === 0}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 rounded-xl">
                                            <SelectValue placeholder={availableSubCategories.length === 0 ? "אין תתי-קטגוריות" : "ללא תת-קטגוריה"} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">ללא תת-קטגוריה</SelectItem>
                                        {availableSubCategories.map(cat => (
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
                        name="sale_price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-900 font-bold">מחיר מבצע (₪)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        placeholder="השאר ריק אם אין מבצע"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            const val = e.target.value;
                                            if (val && val !== "0") {
                                                form.setValue("is_on_sale", true);
                                            } else {
                                                form.setValue("is_on_sale", false);
                                            }
                                        }}
                                        className="h-12 rounded-xl"
                                        dir="ltr"
                                    />
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
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={(checked) => {
                                            field.onChange(checked);
                                            if (!checked) {
                                                form.setValue("sale_price", "");
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormLabel className="!mt-0 font-bold">מוצר במבצע</FormLabel>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex items-center gap-4 pt-4 border-t md:justify-end fixed bottom-0 left-0 right-0 p-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10 md:static md:shadow-none md:bg-transparent md:border-t md:p-0 md:pt-4">
                    {isEditing && (
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={handleDelete}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-12 px-4 rounded-xl font-bold ml-auto"
                            disabled={submitting}
                        >
                            מחק מוצר
                        </Button>
                    )}
                    <Button variant="outline" type="button" onClick={() => router.back()} className="flex-1 md:flex-none h-12 px-8 rounded-xl font-bold" disabled={submitting}>
                        ביטול
                    </Button>
                    <Button type="submit" className="flex-1 md:flex-none h-12 px-12 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 md:shadow-none transition-all" disabled={submitting}>
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
