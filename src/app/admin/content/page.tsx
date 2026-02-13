"use client";

import { supabase } from "@/lib/supabase/client";
import { ContentBlock } from "@/types/supabase";
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";

const BLOCK_TYPE_LABELS: Record<string, string> = {
    hero_slider: "סליידר ראשי",
    category_grid: "רשת קטגוריות",
    product_carousel: "קרוסלת מוצרים",
    text_banner: "באנר טקסט",
    banners_grid: "רשת באנרים",
};

export default function AdminContentPage() {
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBlocks = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("content_blocks")
            .select("*")
            .order("sort_order", { ascending: true });

        if (error) {
            console.error("שגיאה בטעינת בלוקים:", error);
        }
        if (data) setBlocks(data as ContentBlock[]);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchBlocks();
    }, [fetchBlocks]);

    async function toggleActive(id: number, currentStatus: boolean) {
        await supabase
            .from("content_blocks")
            .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
            .eq("id", id);
        fetchBlocks();
    }

    async function deleteBlock(id: number) {
        if (!confirm("האם אתה בטוח שברצונך למחוק בלוק זה?")) return;
        await supabase.from("content_blocks").delete().eq("id", id);
        fetchBlocks();
    }

    async function moveBlock(id: number, direction: "up" | "down") {
        const index = blocks.findIndex((b) => b.id === id);
        if (index === -1) return;

        const swapIndex = direction === "up" ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= blocks.length) return;

        const currentOrder = blocks[index].sort_order;
        const swapOrder = blocks[swapIndex].sort_order;

        await Promise.all([
            supabase.from("content_blocks").update({ sort_order: swapOrder }).eq("id", blocks[index].id),
            supabase.from("content_blocks").update({ sort_order: currentOrder }).eq("id", blocks[swapIndex].id),
        ]);

        fetchBlocks();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">ניהול תוכן דף הבית</h1>
                    <p className="text-muted-foreground mt-1">ערוך, הוסף והסר בלוקים מדף הבית</p>
                </div>
                <Button asChild>
                    <Link href="/admin/content/new">
                        <Plus className="ml-2 h-4 w-4" />
                        הוסף בלוק חדש
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px] text-right"><GripVertical className="h-4 w-4 text-muted-foreground" /></TableHead>
                            <TableHead className="text-right">סדר</TableHead>
                            <TableHead className="text-right">שם הבלוק</TableHead>
                            <TableHead className="text-right">סוג</TableHead>
                            <TableHead className="text-right">פעיל</TableHead>
                            <TableHead className="text-right">פעולות</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">טוען בלוקים...</TableCell>
                            </TableRow>
                        ) : blocks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">
                                    <div className="text-muted-foreground">
                                        <p className="text-lg font-medium">אין בלוקים עדיין</p>
                                        <p className="text-sm">הוסף בלוק חדש כדי להתחיל לבנות את דף הבית</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            blocks.map((block, index) => (
                                <TableRow key={block.id} className={!block.is_active ? "opacity-50" : ""}>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                disabled={index === 0}
                                                onClick={() => moveBlock(block.id, "up")}
                                            >
                                                <ArrowUp className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                disabled={index === blocks.length - 1}
                                                onClick={() => moveBlock(block.id, "down")}
                                            >
                                                <ArrowDown className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">{block.sort_order}</TableCell>
                                    <TableCell className="font-medium">{block.title || "ללא כותרת"}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {BLOCK_TYPE_LABELS[block.type] || block.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={block.is_active}
                                            onCheckedChange={() => toggleActive(block.id, block.is_active)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/admin/content/${block.id}`}>ערוך</Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => deleteBlock(block.id)}
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
