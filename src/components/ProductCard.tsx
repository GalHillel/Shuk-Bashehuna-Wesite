"use client"

import Image from "next/image"
import { Plus, Minus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { useCart } from "@/store/useCart"
import { Product } from "@/types/supabase"
import { cn } from "@/lib/utils"

interface ProductCardProps {
    product: Product
}

const UNIT_LABELS: Record<string, string> = {
    kg: 'ק"ג',
    unit: "יח'",
    pack: "מארז",
};

export function ProductCard({ product }: ProductCardProps) {
    const { items, addItem, removeItem, updateQuantity } = useCart()

    const cartItem = items.find(item => item.product.id === product.id)
    const quantity = cartItem ? cartItem.quantity : 0
    const step = product.unit_type === "kg" ? 0.5 : 1

    const handleIncrement = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        addItem(product, step)
    }

    const handleDecrement = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (quantity > step) {
            updateQuantity(product.id, quantity - step)
        } else {
            removeItem(product.id)
        }
    }

    const imageSrc = (product.image_url && product.image_url.trim().length > 0)
        ? product.image_url
        : "/placeholder.png"

    const isNew = new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const pricePer100g = product.unit_type === "kg" ? (product.price / 10).toFixed(2) : null

    return (
        <Dialog>
            {/* Desktop View */}
            <div className="hidden md:flex flex-col group relative z-0 h-full w-full">
                
                {/* Image Box */}
                <div className="relative aspect-[1.05] w-full rounded-[24px] bg-white border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] group-hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.06)] group-hover:border-slate-200 transition-all duration-300 overflow-hidden flex items-center justify-center p-6 bg-gradient-to-b from-white to-slate-50/30">
                    <DialogTrigger asChild>
                         <div className="absolute inset-0 cursor-pointer z-0"></div>
                    </DialogTrigger>
                    
                    {/* Top Right Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                        {product.is_on_sale && (
                            <span className="bg-[#f0d421] text-slate-800 font-extrabold shadow-sm px-2.5 py-0.5 text-[11px] rounded-full">
                                מבצע
                            </span>
                        )}
                        {isNew && !product.is_on_sale && (
                            <span className="bg-[#c4dbfd] text-[#121b4a] font-extrabold shadow-sm px-2.5 py-0.5 text-[11px] rounded-full">
                                חדש
                            </span>
                        )}
                    </div>
                
                    <div className="relative w-[85%] h-[85%] pointer-events-none z-0">
                        <Image src={imageSrc} alt={product.name} fill className="object-contain transition-transform duration-500 group-hover:scale-[1.08] mix-blend-multiply" sizes="(max-width: 1200px) 20vw, 15vw" />
                    </div>

                    {/* Hover State: Counter Options */}
                    <div className="absolute bottom-3 right-3 left-[3.5rem] flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                        <div className="flex items-center gap-2 pointer-events-auto bg-white/90 backdrop-blur-[2px] rounded-full p-1 shadow-sm border border-slate-100">
                            <button onClick={handleIncrement} className="w-8 h-8 rounded-full bg-[#1b3626] text-white flex items-center justify-center hover:bg-black transition-colors shadow-sm active:scale-95">
                                <Plus className="w-4 h-4" strokeWidth={2.5}/>
                            </button>
                            {quantity > 0 && (
                                <>
                                    <span className="font-extrabold text-[#112a1e] text-[15px] min-w-[20px] text-center">{quantity}</span>
                                    <button onClick={handleDecrement} className="w-8 h-8 rounded-full bg-[#f4f4f4] text-[#1b3626] flex items-center justify-center hover:bg-[#e6e6e6] transition-colors shadow-sm active:scale-95">
                                        <Minus className="w-4 h-4" strokeWidth={2.5}/>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area Below Box */}
                <div className="pt-3 px-1.5 text-right flex flex-col justify-start z-10 flex-1 relative bg-transparent" dir="rtl">
                    <DialogTrigger asChild>
                         <div className="absolute inset-0 cursor-pointer z-0"></div>
                    </DialogTrigger>
                    
                    <h3 className="font-extrabold text-[#113123] text-[16px] leading-tight pointer-events-none mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                    
                    <div className="flex flex-wrap justify-start items-baseline gap-1 font-bold text-[#1b3626] pointer-events-none mb-0.5">
                        {product.is_on_sale && product.sale_price ? (
                            <>
                                <span className="text-[15px]">₪{product.sale_price.toFixed(2)}</span>
                                <span className="text-slate-400 text-[12px] line-through ml-1">₪{product.price.toFixed(2)}</span>
                            </>
                        ) : (
                            <span className="text-[15px]">₪{product.price.toFixed(2)}</span>
                        )}
                        <span className="text-slate-500 font-medium text-[13px]">/ {product.unit_type === 'kg' ? 'לק"ג' : 'ליח\''}</span>
                    </div>

                    <div className="text-slate-400 text-[12px] font-medium leading-snug line-clamp-1 pointer-events-none">
                        {product.description || "מוצר איכותי וטרי"}
                    </div>
                </div>
            </div>

            {/* Mobile View */}
            <div className="flex md:hidden flex-col group relative z-0 h-full w-full bg-transparent overflow-visible" dir="rtl">
                
                {/* Image Box (Mobile) */}
                <div className="relative aspect-square w-full rounded-[20px] bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden flex items-center justify-center p-4">
                    <DialogTrigger asChild>
                         <div className="absolute inset-0 cursor-pointer z-0"></div>
                    </DialogTrigger>
                    
                    {/* Top Right Badges (Mobile) */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 z-10 pointer-events-none">
                        {product.is_on_sale && (
                            <span className="bg-[#f0d421] text-slate-800 font-black px-2 py-0.5 text-[9px] rounded-full shadow-sm">
                                מבצע
                            </span>
                        )}
                        {isNew && !product.is_on_sale && (
                            <span className="bg-[#c4dbfd] text-[#121b4a] font-black px-2 py-0.5 text-[9px] rounded-full shadow-sm">
                                חדש
                            </span>
                        )}
                    </div>
                
                    <div className="relative w-full h-full pointer-events-none z-0">
                        <Image src={imageSrc} alt={product.name} fill className="object-contain" sizes="40vw" />
                    </div>

                    {/* Mobile Quick Add Button */}
                    <div className="absolute bottom-2 left-2 z-20">
                        {quantity === 0 ? (
                            <button 
                                onClick={handleIncrement}
                                className="w-9 h-9 rounded-full bg-[#1b3626] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
                            >
                                <Plus className="w-5 h-5" strokeWidth={3} />
                            </button>
                        ) : (
                            <div className="flex flex-col items-center bg-white rounded-full border border-slate-200 shadow-lg overflow-hidden">
                                <button onClick={handleIncrement} className="w-8 h-8 flex items-center justify-center text-[#1b3626] active:bg-slate-50 border-b border-slate-100">
                                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                                </button>
                                <span className="text-[13px] font-black py-1 text-[#1b3626]">{quantity}</span>
                                <button onClick={handleDecrement} className="w-8 h-8 flex items-center justify-center text-slate-400 active:bg-slate-50 border-t border-slate-100">
                                    <Minus className="w-4 h-4" strokeWidth={2.5} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Area (Mobile) */}
                <div className="pt-2 px-1 text-right flex flex-col justify-start relative">
                    <DialogTrigger asChild>
                         <div className="absolute inset-0 cursor-pointer z-0"></div>
                    </DialogTrigger>
                    
                    <h3 className="font-extrabold text-[#113123] text-[14px] leading-tight mb-0.5 line-clamp-1">{product.name}</h3>
                    
                    <div className="flex items-baseline gap-1 font-bold text-[#1b3626]">
                        {product.is_on_sale && product.sale_price ? (
                            <>
                                <span className="text-[15px]">₪{product.sale_price.toFixed(2)}</span>
                                <span className="text-slate-400 text-[10px] line-through">₪{product.price.toFixed(2)}</span>
                            </>
                        ) : (
                            <span className="text-[15px]">₪{product.price.toFixed(2)}</span>
                        )}
                        <span className="text-slate-500 font-medium text-[11px]">/ {product.unit_type === 'kg' ? 'ק"ג' : 'יח\''}</span>
                    </div>

                    <div className="text-slate-400 text-[10px] font-medium leading-tight line-clamp-1 mt-0.5">
                        {product.description || "טרי ואיכותי"}
                    </div>
                </div>
            </div>

            {/* Quick View Modal */}
            <DialogContent className="sm:max-w-[880px] p-0 overflow-hidden bg-white rounded-[24px] border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] [&>button]:right-6 [&>button]:top-6 [&>button]:text-[#1b3626] [&>button]:bg-white [&>button]:shadow-sm [&>button]:rounded-full [&>button]:p-2.5 [&>button]:hover:bg-[#f4f4f4] [&>button]:border [&>button]:border-slate-100 z-[100]" dir="rtl">
                <DialogTitle className="sr-only">{product.name}</DialogTitle>
                <DialogDescription className="sr-only">{product.description || product.name}</DialogDescription>

                <div className="flex flex-col md:flex-row w-full h-full max-h-[90vh]">
                    {/* Content Section (Left visual flow) */}
                    <div className="w-full md:w-[55%] flex flex-col p-8 md:p-12 justify-center items-start text-right bg-white order-2 h-full overflow-y-auto">
                        <h2 className="text-[38px] md:text-[46px] font-black text-[#1b3626] leading-[1.1] mb-5 tracking-tight">{product.name}</h2>
                        
                        <div className="flex items-baseline gap-2 font-bold text-[#1b3626] mb-6">
                             {product.is_on_sale && product.sale_price ? (
                                 <>
                                    <span className="text-3xl tracking-tight">₪{product.sale_price.toFixed(2)}</span>
                                    <span className="text-slate-400 line-through ml-1 text-lg">₪{product.price.toFixed(2)}</span>
                                 </>
                             ) : (
                                 <span className="text-3xl tracking-tight">₪{product.price.toFixed(2)}</span>
                             )}
                             <span className="text-xl">/</span>
                             <span className="text-xl">{product.unit_type === 'kg' ? 'לק"ג' : 'ליח\''}</span>
                        </div>

                        {pricePer100g && (
                            <div className="text-[#1b3626] mb-4 text-[14px] font-extrabold">
                                {pricePer100g}₪ ל- 100 גר'
                            </div>
                        )}

                        <div className="bg-[#d7f59d] border border-[#c6eb81] text-[#1b3626] text-[15px] font-extrabold leading-[1.6] mb-12 max-w-[95%] p-4 rounded-xl shadow-sm">
                             {product.description || "מתוקות בלחי נגמרת ומרקם מושלם. תוספת מושלמת לעגלה שלך, נבחר בקפידה כדי להבטיח את האיכות המקסימלית ביותר והטעם העשיר ביותר."}
                        </div>

                        <div className="w-full mt-auto">
                            {quantity === 0 ? (
                                <Button className="w-[85%] h-[64px] bg-[#AADB56] hover:bg-[#96ce3f] text-[#112a1e] text-[20px] font-black rounded-full transition-transform active:scale-[0.98] shadow-sm transform-gpu" onClick={handleIncrement}>
                                    הוספה לעגלה
                                </Button>
                            ) : (
                                <div className="w-[85%] h-[64px] flex items-center justify-between bg-primary rounded-full shadow-sm overflow-hidden text-white transition-all px-2.5">
                                    <button className="h-full w-16 flex items-center justify-center hover:scale-110 transition-transform active:scale-95" onClick={handleIncrement}>
                                        <Plus className="h-6 w-6" strokeWidth={3} />
                                    </button>
                                    <span className="font-black text-[24px] flex-1 text-center select-none pt-0.5">{quantity}</span>
                                    <button className="h-full w-16 flex items-center justify-center hover:scale-110 transition-transform active:scale-95" onClick={handleDecrement}>
                                        {quantity === 1 ? <Trash2 className="h-5 w-5" strokeWidth={2.5} /> : <Minus className="h-6 w-6" strokeWidth={3} />}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Image Section (Right visual flow) */}
                    <div className="w-full md:w-[45%] relative bg-white flex items-center justify-center p-12 min-h-[300px] md:min-h-[500px] order-1 border-b md:border-b-0 md:border-l border-slate-100">
                         {isNew && !product.is_on_sale && <span className="absolute top-8 left-8 bg-[#c4dbfd] text-[#121b4a] px-4 py-1.5 rounded-xl font-extrabold text-[14px]">חדש</span>}
                         {product.is_on_sale && <span className="absolute top-8 left-8 bg-[#f0d421] text-slate-800 px-4 py-1.5 rounded-xl font-extrabold text-[14px]">מבצע</span>}
                         <div className="relative w-full h-full max-h-[350px]">
                            <Image src={imageSrc} alt={product.name} fill className="object-contain p-4 drop-shadow-sm hover:scale-105 transition-transform duration-500" />
                         </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
