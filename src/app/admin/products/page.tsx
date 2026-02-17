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
        if (!confirm("האם אתה בטוח שברצונך למחוק מוצר זה?")) return;

        if (product.image_url) {
            await deleteImageFromStorage(product.image_url);
        }

        await supabase.from("products").delete().eq("id", product.id);
        fetchProducts();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">ניהול מוצרים</h1>
                <Button asChild>
                    <Link href="/admin/products/new">
                        <Plus className="ml-2 h-4 w-4" />
                        הוסף מוצר
                    </Link>
                </Button>
            </div>

            <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm border">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="חפש מוצר..."
                        className="pr-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="סינון לפי קטגוריה" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">כל הקטגוריות</SelectItem>
                        {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-4">
                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">טוען מוצרים...</div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">לא נמצאו מוצרים</div>
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className="bg-white p-4 rounded-xl border shadow-sm flex gap-4">
                                <Link href={`/admin/products/${product.id}`} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                                    {product.image_url ? (
                                        <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">אין תמונה</div>
                                    )}
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold truncate">{product.name}</h3>
                                        <Badge variant={product.is_active ? "outline" : "secondary"} className="text-[10px] whitespace-nowrap">
                                            {product.is_active ? "פעיל" : "לא פעיל"}
                                        </Badge>
                                    </div>
                                    <div className="mt-1 flex items-baseline gap-2">
                                        {product.is_on_sale ? (
                                            <>
                                                <span className="font-bold text-red-600">₪{product.sale_price}</span>
                                                <span className="text-xs text-muted-foreground line-through">₪{product.price}</span>
                                            </>
                                        ) : (
                                            <span className="font-bold">₪{product.price}</span>
                                        )}
                                        <span className="text-xs text-muted-foreground">/ {product.unit_type === 'kg' ? 'ק"ג' : 'יח\''}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        מלאי: {product.stock_quantity} | {categories.find(c => c.id === product.category_id)?.name}
                                    </div>
                                    <div className="flex justify-end gap-2 mt-3">
                                        <Button variant="outline" size="sm" asChild className="h-8">
                                            <Link href={`/admin/products/${product.id}`}>
                                                <Edit className="h-3.5 w-3.5 ml-1.5" />
                                                ערוך
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop View */}
                <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60px] text-right"></TableHead>
                                <TableHead className="text-right">שם המוצר</TableHead>
                                <TableHead className="text-right">מחיר</TableHead>
                                <TableHead className="text-right">יחידה</TableHead>
                                <TableHead className="text-right">מלאי</TableHead>
                                <TableHead className="text-right">קטגוריה</TableHead>
                                <TableHead className="text-right">סטטוס</TableHead>
                                <TableHead className="text-right">פעולות</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={8} className="text-center h-24">טוען מוצרים...</TableCell></TableRow>
                            ) : products.length === 0 ? (
                                <TableRow><TableCell colSpan={8} className="text-center h-24">לא נמצאו מוצרים</TableCell></TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <Link href={`/admin/products/${product.id}`} className="block relative w-10 h-10 rounded-md overflow-hidden bg-slate-100 hover:ring-2 hover:ring-green-500 transition-all cursor-pointer">
                                                {product.image_url ? (
                                                    <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">אין</div>
                                                )}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {product.name}
                                            {product.is_on_sale && <Badge variant="destructive" className="mr-2 text-[10px]">מבצע</Badge>}
                                        </TableCell>
                                        <TableCell>
                                            {product.is_on_sale ? (
                                                <div>
                                                    <span className="font-bold text-red-600">₪{product.sale_price}</span>
                                                    <span className="text-xs text-muted-foreground line-through mr-1">₪{product.price}</span>
                                                </div>
                                            ) : (
                                                <span>₪{product.price}</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{product.unit_type === 'kg' ? 'ק&quot;ג' : product.unit_type === 'unit' ? 'יחידה' : 'מארז'}</TableCell>
                                        <TableCell>{product.stock_quantity}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {categories.find(c => c.id === product.category_id)?.name || product.category_id}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={product.is_active ? "outline" : "secondary"}>
                                                {product.is_active ? "פעיל" : "לא פעיל"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/products/${product.id}`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => deleteProduct(product)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
