import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, EyeOff, GripVertical, ChevronRight, FolderTree } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types/supabase";
import { cn } from "@/lib/utils";

interface MobileCategoryItemProps {
    category: Category;
    isSub?: boolean;
    onToggleVisibility: (id: string, currentStatus: boolean) => void;
    onDelete: (category: Category) => void;
    dragHandleProps?: any;
    listeners?: any;
    attributes?: any;
}

export function MobileCategoryItem({ 
    category, 
    isSub, 
    onToggleVisibility, 
    onDelete,
    listeners,
    attributes
}: MobileCategoryItemProps) {
    return (
        <div className={cn(
            "bg-white border-b border-slate-50 last:border-0 p-4 animate-in fade-in slide-in-from-right-2 duration-300",
            isSub && "bg-slate-50/50 pr-12 border-right-4 border-[#AADB56]/20"
        )}>
            <div className="flex items-center gap-4">
                {/* Drag Handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="p-2 -mr-2 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-400 touch-none"
                >
                    <GripVertical className="h-5 w-5" />
                </button>

                {/* Image */}
                <div className={cn(
                    "relative overflow-hidden bg-slate-100 border shadow-sm shrink-0",
                    isSub ? "w-8 h-8 rounded-lg" : "w-12 h-12 rounded-xl"
                )}>
                    {category.image_url ? (
                        <Image src={category.image_url} alt={category.name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">{isSub ? '🍃' : '🥑'}</div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className={cn(
                        "font-black text-slate-800 truncate leading-tight",
                        isSub ? "text-sm" : "text-base"
                    )}>
                        {category.name}
                    </h3>
                    {!isSub && (
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                            סדר: {category.sort_order}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onToggleVisibility(category.id, category.is_visible)}
                        className="h-10 w-10 text-slate-400"
                    >
                        {category.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 opacity-30" />}
                    </Button>
                    <Button variant="ghost" size="icon" asChild className="h-10 w-10 text-blue-500">
                        <Link href={`/admin/categories/${category.id}`}>
                            <Edit className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 text-red-300 hover:text-red-500" 
                        onClick={() => onDelete(category)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
