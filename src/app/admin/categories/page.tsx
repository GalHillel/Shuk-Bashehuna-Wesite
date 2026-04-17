"use client";

import { supabase } from "@/lib/supabase/client";
import { Category } from "@/types/supabase";
import { useEffect, useState, useCallback, useMemo } from "react";
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
import { Plus, Trash2, Eye, EyeOff, Edit, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { deleteImageFromStorage } from "@/lib/storage-utils";
import { toast } from "sonner";

// DnD Kit Imports
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableRowProps {
    category: Category;
    subcategories: Category[];
    onToggleVisibility: (id: string, currentStatus: boolean) => void;
    onDelete: (category: Category) => void;
}

function SortableCategoryRow({ category, subcategories, onToggleVisibility, onDelete }: SortableRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: category.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
        position: 'relative' as const,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <>
            <TableRow 
                ref={setNodeRef} 
                style={style} 
                className={isDragging ? "bg-slate-50 shadow-inner" : "bg-white"}
            >
                <TableCell className="w-[50px]">
                    <button
                        {...attributes}
                        {...listeners}
                        className="p-2 cursor-grab active:cursor-grabbing hover:bg-slate-100 rounded-lg transition-colors"
                        title="גרור לשינוי סדר"
                    >
                        <GripVertical className="h-4 w-4 text-slate-400" />
                    </button>
                </TableCell>
                <TableCell>
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 border shadow-sm">
                        {category.image_url ? (
                            <Image src={category.image_url} alt={category.name} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">🥑</div>
                        )}
                    </div>
                </TableCell>
                <TableCell className="font-black text-slate-800 text-base">
                    {category.name}
                    {subcategories.length > 0 && (
                        <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                            {subcategories.length} תת-קטגוריות
                        </span>
                    )}
                </TableCell>
                <TableCell className="text-sm font-mono text-slate-400">{category.sort_order}</TableCell>
                <TableCell>
                    <Badge variant={category.is_visible ? "outline" : "secondary"} className={category.is_visible ? "border-[#AADB56] text-[#6c9b29]" : ""}>
                        {category.is_visible ? "פעיל" : "נסתר"}
                    </Badge>
                </TableCell>
                <TableCell>
                    <div className="flex gap-1 justify-end">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onToggleVisibility(category.id, category.is_visible)}
                            className="h-9 w-9"
                        >
                            {category.is_visible ? <EyeOff className="h-4 w-4 text-slate-500" /> : <Eye className="h-4 w-4 text-[#AADB56]" />}
                        </Button>
                        <Button variant="ghost" size="icon" asChild className="h-9 w-9">
                            <Link href={`/admin/categories/${category.id}`}>
                                <Edit className="h-4 w-4 text-blue-500" />
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-red-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => onDelete(category)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
            
            {/* Display subcategories immediately below the parent in a nested style (non-sortable for now as per request) */}
            {subcategories.map(sub => (
                <TableRow key={sub.id} className="bg-slate-50/30 border-r-4 border-slate-100">
                    <TableCell></TableCell>
                    <TableCell>
                        <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-white border mr-4">
                            {sub.image_url ? (
                                <Image src={sub.image_url} alt={sub.name} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs opacity-50">🍃</div>
                            )}
                        </div>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm font-bold">
                        {sub.name}
                    </TableCell>
                    <TableCell className="text-xs text-slate-300 font-mono">{sub.sort_order}</TableCell>
                    <TableCell>
                         <Badge variant="outline" className="text-[10px] scale-90 origin-right opacity-60">
                            תת-קטגוריה
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex gap-1 justify-end opacity-60 hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" asChild className="h-7 w-7">
                                <Link href={`/admin/categories/${sub.id}`}>
                                    <Edit className="h-3 w-3" />
                                </Link>
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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

    const parents = useMemo(() => categories.filter(c => !c.parent_id), [categories]);
    const subCategories = useMemo(() => categories.filter(c => c.parent_id), [categories]);

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = parents.findIndex((p) => p.id === active.id);
            const newIndex = parents.findIndex((p) => p.id === over.id);
            
            const newParents = arrayMove(parents, oldIndex, newIndex);
            
            // Re-map the sort orders locally
            const updatedItems = newParents.map((p, idx) => ({
                ...p,
                sort_order: (idx + 1) * 10
            }));

            // Optimistic update
            setCategories([
                ...updatedItems,
                ...subCategories
            ]);

            // Sync with Supabase (Batch update)
            try {
                const updates = updatedItems.map(p => 
                    supabase
                        .from("categories")
                        .update({ sort_order: p.sort_order })
                        .eq("id", p.id)
                );
                
                await Promise.all(updates);
                toast.success("סדר הקטגוריות עודכן בהצלחה");
            } catch (err) {
                toast.error("אירעה שגיאה בעדכון הסדר");
                fetchCategories(); // Revert to server state
            }
        }
    }

    async function toggleVisibility(id: string, currentStatus: boolean) {
        await supabase
            .from("categories")
            .update({ is_visible: !currentStatus })
            .eq("id", id);
        fetchCategories();
    }

    async function deleteCategory(category: Category) {
        if (!confirm("האם אתה בטוח שברצונך למחוק קטגוריה זו? כל המוצרים שמשויכים אליה ישארו ללא קטגוריה.")) return;

        if (category.image_url) {
            await deleteImageFromStorage(category.image_url);
        }

        await supabase.from("categories").delete().eq("id", category.id);
        fetchCategories();
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">ניהול קטגוריות</h1>
                    <p className="text-slate-500 mt-1 font-medium">הוסף, ערוך ושנה את סדר התצוגה בגרירה — הכל בממשק אחד חכם.</p>
                </div>
                <Button asChild className="bg-[#AADB56] hover:bg-[#9cbd4c] text-[#112a1e] font-black px-8 py-6 rounded-2xl shadow-lg shadow-[#AADB56]/20 transition-all hover:scale-[1.02] active:scale-95">
                    <Link href="/admin/categories/new">
                        <Plus className="ml-2 h-5 w-5" />
                        הוסף קטגוריה חדשה
                    </Link>
                </Button>
            </div>

            <div className="space-y-4">
                {/* Desktop View with DnD */}
                <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                    <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <Table dir="rtl">
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="hover:bg-transparent border-slate-100">
                                    <TableHead className="w-[80px] text-right py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider pr-8"></TableHead>
                                    <TableHead className="w-[80px] text-right py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider"></TableHead>
                                    <TableHead className="text-right py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider">שם הקטגוריה</TableHead>
                                    <TableHead className="text-right py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider">סדר</TableHead>
                                    <TableHead className="text-right py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider">סטטוס</TableHead>
                                    <TableHead className="text-left py-6 font-black text-slate-400 uppercase text-[11px] tracking-wider pl-8">פעולות</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-64 font-bold text-slate-400">טוען נתונים...</TableCell>
                                    </TableRow>
                                ) : parents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-64 font-bold text-slate-400">לא נמצאו קטגוריות במערכת</TableCell>
                                    </TableRow>
                                ) : (
                                    <SortableContext 
                                        items={parents.map(p => p.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {parents.map((category) => (
                                            <SortableCategoryRow
                                                key={category.id}
                                                category={category}
                                                subcategories={subCategories.filter(s => s.parent_id === category.id)}
                                                onToggleVisibility={toggleVisibility}
                                                onDelete={deleteCategory}
                                            />
                                        ))}
                                    </SortableContext>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>
                
                <p className="text-[11px] text-slate-400 text-center font-medium">💡 טיפ: ניתן לגרור קטגוריות ראשיות באמצעות האייקון בצד ימין לשינוי סדר התצוגה באתר.</p>
            </div>
        </div>
    );
}
