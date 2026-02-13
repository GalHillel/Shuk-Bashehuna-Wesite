"use client";

import { supabase } from "@/lib/supabase/client";
import { Category } from "@/types/supabase";
import { useEffect, useState, useCallback } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Trash2, Eye, EyeOff, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase
            .from("categories")
            .select("*")
            .order("sort_order", { ascending: true });
        if (data) setCategories(data as Category[]);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    async function toggleVisibility(id: string, currentStatus: boolean) {
        await supabase
            .from("categories")
            .update({ is_visible: !currentStatus })
            .eq("id", id);
        fetchCategories();
    }

    async function deleteCategory(id: string) {
        if (!confirm("האם אתה בטוח שברצונך למחוק קטגוריה זו? כל המוצרים שמשויכים אליה ישארו ללא קטגוריה.")) return;
        await supabase.from("categories").delete().eq("id", id);
        fetchCategories();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">ניהול קטגוריות</h1>
                    <p className="text-muted-foreground mt-1">הוסף, ערוך ומחק קטגוריות מוצרים</p>
                </div>
                <Button asChild>
                    <Link href="/admin/categories/new">
                        <Plus className="ml-2 h-4 w-4" />
                        הוסף קטגוריה
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px] text-right"></TableHead>
                            <TableHead className="text-right">שם הקטגוריה</TableHead>
                            <TableHead className="text-right">סדר תצוגה</TableHead>
                            <TableHead className="text-right">סטטוס</TableHead>
                            <TableHead className="text-right">פעולות</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">טוען קטגוריות...</TableCell>
                            </TableRow>
                        ) : categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">לא נמצאו קטגוריות</TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                                            {category.image_url ? (
                                                <Image src={category.image_url} alt={category.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-lg">🥑</div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{category.sort_order}</TableCell>
                                    <TableCell>
                                        <Badge variant={category.is_visible ? "outline" : "secondary"}>
                                            {category.is_visible ? "פעיל" : "נסתר"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleVisibility(category.id, category.is_visible)}
                                                title={category.is_visible ? "הסתר מהתפריט" : "הצג בתפריט"}
                                            >
                                                {category.is_visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/categories/${category.id}`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => deleteCategory(category.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
