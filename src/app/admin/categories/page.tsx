"use client";

import React from "react";

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
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MobileCategoryItem } from "@/components/admin/MobileCategoryItem";

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

// ─── Generic Sortable Item ───
function SortableItem({ 
    id, 
    children, 
    className,
    as: Component = "div" 
}: { 
    id: string; 
    children: (props: { attributes: any; listeners: any; isDragging: boolean }) => React.ReactNode; 
    className?: string;
    as?: any;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
        position: 'relative' as const,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Component ref={setNodeRef} style={style} className={className || ""}>
            {children({ attributes, listeners, isDragging })}
        </Component>
    );
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Don't trigger on tiny taps
            },
        }),
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
    
    const getSubCategoriesFor = useCallback((parentId: string) => {
        return categories.filter(c => c.parent_id === parentId).sort((a, b) => a.sort_order - b.sort_order);
    }, [categories]);

    // Build a lookup: id -> category for quick access
    const categoryMap = useMemo(() => {
        const map = new Map<string, Category>();
        categories.forEach(c => map.set(c.id, c));
        return map;
    }, [categories]);

    // All sortable IDs (parents + all subcategories)
    const allSortableIds = useMemo(() => {
        const ids: string[] = [];
        parents.forEach(p => {
            ids.push(p.id);
            getSubCategoriesFor(p.id).forEach(s => ids.push(s.id));
        });
        return ids;
    }, [parents, getSubCategoriesFor]);

    // ─── Unified drag end handler ───
    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeItem = categoryMap.get(active.id as string);
        const overItem = categoryMap.get(over.id as string);
        if (!activeItem || !overItem) return;

        // Case 1: Dragging a parent category
        if (!activeItem.parent_id && !overItem.parent_id) {
            const oldIndex = parents.findIndex(p => p.id === active.id);
            const newIndex = parents.findIndex(p => p.id === over.id);
            
            const newParents = arrayMove(parents, oldIndex, newIndex);
            const updatedItems = newParents.map((p, idx) => ({
                ...p,
                sort_order: (idx + 1) * 10,
            }));

            const subs = categories.filter(c => c.parent_id);
            setCategories([...updatedItems, ...subs]);

            try {
                await Promise.all(updatedItems.map(p =>
                    supabase.from("categories").update({ sort_order: p.sort_order }).eq("id", p.id)
                ));
                toast.success("סדר הקטגוריות עודכן בהצלחה");
            } catch {
                toast.error("אירעה שגיאה בעדכון הסדר");
                fetchCategories();
            }
            return;
        }

        // Case 2: Dragging a subcategory within the same parent
        if (activeItem.parent_id && overItem.parent_id && activeItem.parent_id === overItem.parent_id) {
            const parentId = activeItem.parent_id;
            const subs = getSubCategoriesFor(parentId);
            const oldIndex = subs.findIndex(s => s.id === active.id);
            const newIndex = subs.findIndex(s => s.id === over.id);
            
            const newSubs = arrayMove(subs, oldIndex, newIndex);
            const updatedSubs = newSubs.map((s, idx) => ({
                ...s,
                sort_order: (idx + 1) * 10,
            }));

            const otherCategories = categories.filter(c => c.parent_id !== parentId);
            setCategories([...otherCategories, ...updatedSubs]);

            try {
                await Promise.all(updatedSubs.map(s =>
                    supabase.from("categories").update({ sort_order: s.sort_order }).eq("id", s.id)
                ));
                toast.success("סדר תתי-הקטגוריות עודכן בהצלחה");
            } catch {
                toast.error("אירעה שגיאה בעדכון הסדר");
                fetchCategories();
            }
            return;
        }

        // Otherwise: cross-type drag (parent<->sub) — ignore
    }

    async function toggleVisibility(id: string, currentStatus: boolean) {
        await supabase.from("categories").update({ is_visible: !currentStatus }).eq("id", id);
        fetchCategories();
    }

    async function deleteCategory(category: Category) {
        if (!confirm("האם אתה בטוח שברצונך למחוק קטגוריה זו? כל המוצרים שמשויכים אליה ישארו ללא קטגוריה.")) return;
        if (category.image_url) await deleteImageFromStorage(category.image_url);
        await supabase.from("categories").delete().eq("id", category.id);
        fetchCategories();
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <AdminHeader 
                title="ניהול קטגוריות" 
                description="הוסף, ערוך ושנה את סדר התצוגה בגרירה — הכל בממשק אחד חכם."
            >
                <Button asChild className="bg-[#AADB56] hover:bg-[#112a1e] text-[#112a1e] hover:text-white font-black h-14 w-full md:w-auto px-8 rounded-2xl shadow-lg transition-all">
                    <Link href="/admin/categories/new">
                        <Plus className="ml-2 h-5 w-5" />
                        הוסף קטגוריה
                    </Link>
                </Button>
            </AdminHeader>

            <div className="space-y-4">
            <div className="space-y-6">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    {/* Mobile View */}
                    <div className="md:hidden bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                        {loading ? (
                            <div className="p-20 text-center font-bold text-slate-400">טוען...</div>
                        ) : parents.length === 0 ? (
                            <div className="p-20 text-center font-bold text-slate-400">אין קטגוריות</div>
                        ) : (
                            <SortableContext items={allSortableIds} strategy={verticalListSortingStrategy}>
                                {parents.map(category => {
                                    const subs = getSubCategoriesFor(category.id);
                                    return (
                                        <div key={category.id}>
                                            <SortableItem id={category.id}>
                                                {(props) => (
                                                    <MobileCategoryItem 
                                                        category={category} 
                                                        onToggleVisibility={toggleVisibility} 
                                                        onDelete={deleteCategory}
                                                        {...props}
                                                    />
                                                )}
                                            </SortableItem>
                                            {subs.map(sub => (
                                                <SortableItem key={sub.id} id={sub.id}>
                                                    {(props) => (
                                                        <MobileCategoryItem 
                                                            category={sub} 
                                                            isSub 
                                                            onToggleVisibility={toggleVisibility} 
                                                            onDelete={deleteCategory}
                                                            {...props}
                                                        />
                                                    )}
                                                </SortableItem>
                                            ))}
                                        </div>
                                    );
                                })}
                            </SortableContext>
                        )}
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block bg-white rounded-[32px] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
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
                                        items={allSortableIds}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {parents.map((category) => {
                                            const subs = getSubCategoriesFor(category.id);
                                            return (
                                                <React.Fragment key={category.id}>
                                                    {/* Parent Row */}
                                                    <SortableItem id={category.id} as={TableRow} className="bg-white">
                                                        {({ attributes, listeners }) => (
                                                            <>
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
                                                                    {subs.length > 0 && (
                                                                        <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                                                                            {subs.length} תת-קטגוריות
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
                                                                        <Button variant="ghost" size="icon" onClick={() => toggleVisibility(category.id, category.is_visible)} className="h-9 w-9">
                                                                            {category.is_visible ? <EyeOff className="h-4 w-4 text-slate-500" /> : <Eye className="h-4 w-4 text-[#AADB56]" />}
                                                                        </Button>
                                                                        <Button variant="ghost" size="icon" asChild className="h-9 w-9">
                                                                            <Link href={`/admin/categories/${category.id}`}>
                                                                                <Edit className="h-4 w-4 text-blue-500" />
                                                                            </Link>
                                                                        </Button>
                                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => deleteCategory(category)}>
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </>
                                                        )}
                                                    </SortableItem>

                                                    {/* Subcategory Rows */}
                                                    {subs.map(sub => (
                                                        <SortableItem key={sub.id} id={sub.id} as={TableRow} className="bg-slate-50/30 border-r-4 border-[#AADB56]/30">
                                                            {({ attributes, listeners }) => (
                                                                <>
                                                                    <TableCell className="w-[50px]">
                                                                        <button
                                                                            {...attributes}
                                                                            {...listeners}
                                                                            className="p-1.5 cursor-grab active:cursor-grabbing hover:bg-slate-100 rounded-lg transition-colors mr-4"
                                                                            title="גרור לשינוי סדר"
                                                                        >
                                                                            <GripVertical className="h-3.5 w-3.5 text-slate-300" />
                                                                        </button>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-white border mr-4">
                                                                            {sub.image_url ? (
                                                                                <Image src={sub.image_url} alt={sub.name} fill className="object-cover" />
                                                                            ) : (
                                                                                <div className="w-full h-full flex items-center justify-center text-xs opacity-50">🍃</div>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-slate-500 text-sm font-bold">{sub.name}</TableCell>
                                                                    <TableCell className="text-xs text-slate-300 font-mono">{sub.sort_order}</TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="outline" className="text-[10px] scale-90 origin-right opacity-60">תת-קטגוריה</Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex gap-1 justify-end opacity-60 hover:opacity-100 transition-opacity">
                                                                            <Button variant="ghost" size="icon" asChild className="h-7 w-7">
                                                                                <Link href={`/admin/categories/${sub.id}`}>
                                                                                    <Edit className="h-3 w-3" />
                                                                                </Link>
                                                                            </Button>
                                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => deleteCategory(sub)}>
                                                                                <Trash2 className="h-3 w-3" />
                                                                            </Button>
                                                                        </div>
                                                                    </TableCell>
                                                                </>
                                                            )}
                                                        </SortableItem>
                                                    ))}
                                                </React.Fragment>
                                            );
                                        })}
                                    </SortableContext>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </DndContext>
            </div>
                
                <p className="text-[11px] text-slate-400 text-center font-medium">💡 טיפ: ניתן לגרור קטגוריות ראשיות ותת-קטגוריות באמצעות האייקון בצד ימין לשינוי סדר התצוגה באתר.</p>
            </div>
        </div>
    );
}
