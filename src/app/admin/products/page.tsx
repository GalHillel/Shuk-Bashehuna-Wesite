/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { supabase } from "@/lib/supabase/client";
import { Product, Category } from "@/types/supabase";
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
import { Plus, Trash2, Edit, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { deleteImageFromStorage } from "@/lib/storage-utils";
import { toast } from "sonner";
import { safeDeleteProduct } from "@/lib/product-service";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const fetchProducts = useCallback(async () => {
        let query = supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });

        if (categoryFilter !== 'all') {
            query = query.eq('category_id', categoryFilter);
        }

        if (searchTerm) {
            query = query.ilike('name', `%${searchTerm}%`);
        }

        const { data } = await query;
        if (data) setProducts(data);
        setLoading(false);
    }, [categoryFilter, searchTerm]);

    useEffect(() => {
        const fetchCats = async () => {
            const { data } = await supabase.from("categories").select("*").order("name");
            if (data) setCategories(data);
        };
        fetchCats();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchProducts]);

    async function deleteProduct(product: Product) {
        if (!confirm(`האם אתה בטוח שברצונך למחוק את "${product.name}"?`)) return;

        setLoading(true);
        try {
            const result = await safeDeleteProduct(product);

            if (result.type === 'deactivated') {
                toast.error("לא ניתן למחוק מוצר המופיע בהזמנות. המוצר הועבר לסטטוס 'לא פעיל'.", {
                    description: "הסטטוס עודכן בהצלחה",
                });
                await fetchProducts();
            } else if (result.type === 'deleted') {
                toast.success("המוצר נמחק לצמיתות בהצלחה");
                await fetchProducts();
            } else if (result.type === 'error') {
                toast.error("אירעה שגיאה בביצוע הפעולה", {
                    description: result.message,
                });
            }
        } catch (err: any) {
            console.error("Error in deleteProduct UI:", err);
            toast.error("אירעה שגיאה בלתי צפויה", {
                description: err.message,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">ניהול מוצרים</h1>
                    <p className="text-slate-500 mt-1 font-medium">נהל את מלאי המוצרים, המחירים והמבצעים שלך</p>
                </div>
                <Button asChild className="bg-[#AADB56] hover:bg-[#9cbd4c] text-[#112a1e] font-black px-8 py-6 rounded-2xl shadow-lg shadow-[#AADB56]/20 transition-all hover:scale-[1.02] active:scale-95">
                    <Link href="/admin/products/new">
                        <Plus className="ml-2 h-5 w-5" />
                        הוסף מוצר חדש
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-6 rounded-[28px] shadow-sm border border-slate-100">
                <div className="relative flex-1 w-full">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder="חפש מוצר לפי שם..."
                        className="pr-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-[#AADB56] transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-auto">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full md:w-[220px] h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold text-slate-700">
                            <SelectValue placeholder="סינון לפי קטגוריה" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                            <SelectItem value="all" className="font-bold">כל הקטגוריות</SelectItem>
                            {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id} className="font-medium">{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <Table dir="rtl">
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="w-[80px] text-right py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider"></TableHead>
                            <TableHead className="text-right py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider">שם המוצר</TableHead>
                            <TableHead className="text-right py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider">מחיר</TableHead>
                            <TableHead className="text-right py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider">יחידה</TableHead>
                            <TableHead className="text-right py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider">קטגוריה</TableHead>
                            <TableHead className="text-right py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider">סטטוס</TableHead>
                            <TableHead className="text-left py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider pl-8">פעולות</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={8} className="text-center h-64 font-bold text-slate-400">טוען נתונים...</TableCell></TableRow>
                        ) : products.length === 0 ? (
                            <TableRow><TableCell colSpan={8} className="text-center h-64 font-bold text-slate-400">לא נמצאו מוצרים תואמים</TableCell></TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors border-slate-50 group">
                                    <TableCell className="py-4">
                                        <Link href={`/admin/products/${product.id}`} className="block relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group-hover:shadow-md transition-all">
                                            {product.image_url ? (
                                                <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-slate-300">🍃</div>
                                            )}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="font-black text-slate-800">
                                        {product.name}
                                        {product.is_on_sale && (
                                            <Badge className="mr-2 bg-red-50 text-red-600 border-red-100 hover:bg-red-50 font-black text-[10px]">מבצע</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {product.is_on_sale ? (
                                            <div className="flex flex-col">
                                                <span className="font-black text-red-600 text-base">₪{product.sale_price}</span>
                                                <span className="text-[10px] text-slate-400 line-through">₪{product.price}</span>
                                            </div>
                                        ) : (
                                            <span className="font-black text-slate-700 text-base">₪{product.price}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-500 text-sm">
                                        {product.unit_type === 'kg' ? 'ק"ג' : product.unit_type === 'unit' ? 'יחידה' : 'מארז'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-medium text-slate-500 border-slate-100">
                                            {categories.find(c => c.id === product.category_id)?.name || 'ללא'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={product.is_active ? "outline" : "secondary"} className={product.is_active ? "border-[#AADB56] text-[#6c9b29] font-black" : "font-bold"}>
                                            {product.is_active ? "פעיל" : "לא פעיל"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="pl-8">
                                        <div className="flex gap-1 justify-end opacity-40 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" asChild className="h-10 w-10 text-blue-500 hover:bg-blue-50">
                                                <Link href={`/admin/products/${product.id}`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => deleteProduct(product)}>
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
            
            <p className="text-[11px] text-slate-400 text-center font-medium">✨ טיפ: מוצרים במבצע יופיעו אוטומטית עם תווית אדומה באתר ובעמוד המבצעים.</p>
        </div>
    );
}
