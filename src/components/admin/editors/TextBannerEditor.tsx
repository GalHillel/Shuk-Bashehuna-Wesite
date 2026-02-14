"use client";

import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function TextBannerEditor() {
    const { control } = useFormContext();

    return (
        <div className="space-y-6 border p-6 rounded-xl bg-slate-50">
            <h3 className="font-bold text-lg">הגדרות באנר טקסט</h3>

            <FormField
                control={control}
                name="data.text"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>תוכן הבאנר</FormLabel>
                        <FormControl>
                            <Input {...field} value={field.value || ""} placeholder="למשל: משלוח חינם בקנייה מעל 250 ₪" className="bg-white" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="data.bg_color"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>צבע רקע</FormLabel>
                        <div className="flex gap-2">
                            <FormControl>
                                <Input
                                    type="color"
                                    {...field}
                                    value={field.value || "#000000"}
                                    className="w-12 h-12 p-1 bg-white cursor-pointer"
                                />
                            </FormControl>
                            <Input
                                {...field}
                                value={field.value || ""}
                                placeholder="#f0fdf4"
                                className="flex-1 bg-white font-mono"
                                dir="ltr"
                            />
                        </div>
                        <FormDescription>
                            בחר צבע רקע לבאנר
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
