"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Trash2, Plus } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Category } from "@/types/supabase";

export function HeroSliderEditor() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "data.slides",
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
                <label className="text-base font-bold text-slate-900">שקופיות (Slides)</label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ image_url: "", title: "", subtitle: "", button_text: "", link: "" })}
                >
                    <Plus className="h-4 w-4 ml-2" />
                    הוסף שקופית
                </Button>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-2">
                {fields.map((field, index) => (
                    <AccordionItem key={field.id} value={field.id} className="border rounded-lg bg-slate-50 px-4">
                        <AccordionTrigger className="hover:no-underline py-2">
                            <div className="flex items-center gap-2 w-full">
                                <span className="font-bold text-sm text-slate-500">#{index + 1}</span>
                                <span className="font-medium">
                                    {control._formValues?.data?.slides?.[index]?.title || "שקופית חדשה"}
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 pb-4 space-y-4">
                            <FormField
                                control={control}
                                name={`data.slides.${index}.image_url`}
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={control}
                                    name={`data.slides.${index}.title`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>כותרת ראשית</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value || ""} placeholder="כותרת גדולה..." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name={`data.slides.${index}.subtitle`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>כותרת משנה</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value || ""} placeholder="תיאור קצר..." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={control}
                                    name={`data.slides.${index}.button_text`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>טקסט כפתור</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value || ""} placeholder="למשל: הזמן עכשיו" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name={`data.slides.${index}.link`}
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
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => remove(index)}
                                >
                                    <Trash2 className="h-4 w-4 ml-2" />
                                    הסר שקופית
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            {fields.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-xl text-slate-400">
                    אין שקופיות. לחץ על &quot;הוסף שקופית&quot; כדי להתחיל.
                </div>
            )}
        </div>
    );
}
