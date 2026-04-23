import { Button } from "@/components/ui/button";
import { Edit, Package, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/supabase";

interface MobileProductCardProps {
    product: Product;
    categoryName?: string;
    onDelete: (product: Product) => void;
}

export function MobileProductCard({ product, categoryName, onDelete }: MobileProductCardProps) {
    return (
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-4 space-y-4 animate-in fade-in zoom-in-95 duration-300">
            {/* Header: Image and Basic Info */}
            <div className="flex gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                    {product.image_url ? (
                        <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🍃</div>
                    )}
                    {product.is_on_sale && (
                        <div className="absolute top-1 left-1 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                            מבצע
                        </div>
                    )}
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-black text-slate-800 truncate leading-tight">{product.name}</h3>
                        <Badge variant={product.is_active ? "outline" : "secondary"} className={product.is_active ? "bg-green-50 text-green-700 border-green-100 text-[10px] py-0 px-1.5" : "text-[10px] py-0 px-1.5"}>
                            {product.is_active ? "פעיל" : "כבוי"}
                        </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 font-bold mb-2">{categoryName || "ללא קטגוריה"}</p>
                    
                    <div className="flex items-baseline gap-2">
                        {product.is_on_sale ? (
                            <>
                                <span className="font-black text-[#112a1e] text-lg">₪{product.sale_price}</span>
                                <span className="text-xs text-slate-400 line-through font-bold">₪{product.price}</span>
                            </>
                        ) : (
                            <span className="font-black text-[#112a1e] text-lg">₪{product.price}</span>
                        )}
                        <span className="text-[10px] text-slate-400 font-bold">/ {product.unit_type === 'kg' ? 'ק"ג' : product.unit_type === 'unit' ? 'יח\'' : 'מארז'}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-50">
                <Button asChild variant="outline" className="flex-1 h-11 rounded-xl bg-slate-50 border-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all font-black text-xs gap-2">
                    <Link href={`/admin/products/${product.id}`}>
                        <Edit className="h-4 w-4" />
                        עריכה
                    </Link>
                </Button>
                <Button 
                    variant="outline" 
                    className="h-11 w-11 rounded-xl bg-slate-50 border-slate-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
                    onClick={() => onDelete(product)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
