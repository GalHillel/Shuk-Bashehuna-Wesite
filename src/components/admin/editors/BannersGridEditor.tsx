"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Trash2, Plus } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Card, CardContent } from "@/components/ui/card";



import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Category } from "@/types/supabase";

export function BannersGridEditor() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "data.banners",
    });

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from("categories").select("*").eq("is_visible", true).order("name");
            if (data) setCategories(data as Category[]);
        };
        fetchCategories();
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-base font-bold text-slate-900">באנרים (Banners)</label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ image_url: "", title: "", link: "" })}
                >
                    <Plus className="h-4 w-4 ml-2" />
                    הוסף באנר
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field, index) => (
                    <Card key={field.id} className="relative group">
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 left-2 z-10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => remove(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <CardContent className="p-4 space-y-4">
                            <span className="absolute top-2 right-2 bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded">#{index + 1}</span>

                            <FormField
                                control={control}
                                name={`data.banners.${index}.image_url`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>תמונה</FormLabel>
                                        <FormControl>
                                            <ImageUpload
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                                bucket="banners"
                                                folder="banners"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name={`data.banners.${index}.title`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>כותרת</FormLabel>
                                        <FormControl>
                                            <Input {...field} value={field.value || ""} placeholder="כותרת הבאנר" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name={`data.banners.${index}.link`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>קישור</FormLabel>
                                        <Select onValueChange={(val) => field.onChange(val)} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-white">
                                                    <SelectValue placeholder="בחר יעד לקישור" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>דפים במערכת</SelectLabel>
                                                    <SelectItem value="/">דף הבית</SelectItem>
                                                    <SelectItem value="/about">אודות</SelectItem>
                                                    <SelectItem value="/category/specials">מבצעים</SelectItem>
                                                </SelectGroup>
                                                <SelectGroup>
                                                    <SelectLabel>קטגוריות</SelectLabel>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={`/category/${cat.id}`}>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {fields.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-xl text-slate-400">
                    אין באנרים. לחץ על &quot;הוסף באנר&quot; כדי להתחיל.
                </div>
            )}
        </div>
    );
}

