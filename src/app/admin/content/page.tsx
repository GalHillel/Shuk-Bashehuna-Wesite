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

import { revalidateHomepage } from "@/app/actions/revalidate";
import { toast } from "sonner";
import { deleteContentBlock } from "./actions";

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

        await revalidateHomepage();
        fetchBlocks();
        toast.success("סטטוס עודכן בהצלחה");
    }

    async function deleteBlock(e: React.MouseEvent, id: number) {
        e.stopPropagation(); // Stop row click

        if (!confirm("האם אתה בטוח שברצונך למחוק בלוק זה?")) return;

        const result = await deleteContentBlock(id);

        if (result.success) {
            toast.success("הבלוק נמחק בהצלחה");
            fetchBlocks(); // Refresh list
        } else {
            toast.error("שגיאה במחיקת הבלוק: " + result.error);
        }
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

        await revalidateHomepage();
        fetchBlocks();
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">עיצוב דף הבית</h1>
                    <p className="text-slate-500 mt-1 font-medium">נהל את סדר הבלוקים והתוכן המופיע בעמוד הראשי</p>
                </div>
                <Button asChild className="bg-[#AADB56] hover:bg-[#9cbd4c] text-[#112a1e] font-black px-8 py-6 rounded-2xl shadow-lg shadow-[#AADB56]/20 transition-all hover:scale-[1.02] active:scale-95">
                    <Link href="/admin/content/new">
                        <Plus className="ml-2 h-5 w-5" />
                        הוסף בלוק חדש
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div>
                        <h2 className="text-xl font-black text-slate-800">סידור הבלוקים</h2>
                        <p className="text-sm text-slate-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px] md:max-w-none">השתמש בחיצים כדי לשנות את סדר הופעת הבלוקים באתר</p>
                    </div>
                </div>
                <Table dir="rtl">
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-50">
                            <TableHead className="w-[100px] text-right py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider pr-8">סדר</TableHead>
                            <TableHead className="text-right py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider">שם הבלוק</TableHead>
                            <TableHead className="text-right py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider">סוג הבלוק</TableHead>
                            <TableHead className="text-right py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider">סטטוס</TableHead>
                            <TableHead className="text-left py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider pl-8">פעולות</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={6} className="text-center h-64 font-bold text-slate-400">טוען בלוקים...</TableCell></TableRow>
                        ) : blocks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-64 font-bold text-slate-400">
                                    <p className="text-lg font-black italic">אין עדיין בלוקים מעוצבים.</p>
                                    <p className="text-sm font-medium">זה הזמן להתחיל לבנות!</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            blocks.map((block, index) => (
                                <TableRow key={block.id} className={`hover:bg-slate-50/50 transition-colors border-slate-50 group ${!block.is_active ? "opacity-40" : ""}`}>
                                    <TableCell className="pr-8">
                                        <div className="flex items-center gap-3">
                                            <div className="font-black text-lg text-slate-300 w-6">
                                                {index + 1}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-lg hover:bg-[#AADB56]/20 hover:text-[#6c9b29]"
                                                    disabled={index === 0}
                                                    onClick={() => moveBlock(block.id, "up")}
                                                >
                                                    <ArrowUp className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-lg hover:bg-[#AADB56]/20 hover:text-[#6c9b29]"
                                                    disabled={index === blocks.length - 1}
                                                    onClick={() => moveBlock(block.id, "down")}
                                                >
                                                    <ArrowDown className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-black text-slate-800">
                                        {block.title || "בלוק ללא כותרת"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-bold text-slate-500 border-slate-100 bg-slate-50/50">
                                            {BLOCK_TYPE_LABELS[block.type] || block.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                             <Switch
                                                checked={block.is_active}
                                                onCheckedChange={() => toggleActive(block.id, block.is_active)}
                                                className="data-[state=checked]:bg-[#AADB56]"
                                            />
                                            <span className={`text-[11px] font-black uppercase ${block.is_active ? 'text-[#6c9b29]' : 'text-slate-400'}`}>
                                                {block.is_active ? 'פעיל' : 'מוסתר'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="pl-8">
                                        <div className="flex gap-2 justify-end opacity-40 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" className="h-10 px-6 rounded-xl font-bold bg-blue-50/50 text-blue-600 hover:bg-blue-100" asChild>
                                                <Link href={`/admin/content/${block.id}`}>ערוך</Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                onClick={(e) => deleteBlock(e, block.id)}
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            
            <p className="text-[11px] text-slate-400 text-center font-medium">✨ טיפ: תוכל לכבות בלוקים באופן זמני מבלי למחוק אותם.</p>
        </div>
    );
}
