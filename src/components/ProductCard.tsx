"use client"

import Image from "next/image"
import { useState } from "react"
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
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);

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

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPos({ x, y });
    };

    const imageSrc = (product.image_url && product.image_url.trim().length > 0)
        ? product.image_url
        : "/placeholder.png"

    const isNew = new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    // Standardized Quantity Selector Component (Horizontal Pill)
    const QuantitySelector = ({ className }: { className?: string }) => (
        <div 
            className={cn(
                "flex items-center bg-[#AADB56] rounded-full transition-all duration-300 ease-in-out overflow-hidden shadow-lg border border-white/20",
                quantity === 0 ? "w-10 h-10 px-0" : "w-28 md:w-32 h-10 px-1",
                className
            )}
            onClick={(e) => e.stopPropagation()}
        >
            {quantity > 0 && (
                <button 
                    onClick={handleDecrement}
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 transition-colors text-[#112a1e] shrink-0"
                >
                    {quantity <= step ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" strokeWidth={3} />}
                </button>
            )}
            
            <span className={cn(
                "flex-1 text-center font-black text-[#112a1e] transition-opacity duration-300 text-[15px]",
                quantity === 0 ? "opacity-0 w-0" : "opacity-100"
            )}>
                {quantity % 1 === 0 ? quantity : quantity.toFixed(1)}
            </span>

            <button 
                onClick={handleIncrement}
                className={cn(
                    "flex items-center justify-center rounded-full transition-all text-[#112a1e] shrink-0",
                    quantity === 0 ? "w-10 h-10 hover:bg-[#96ce3f]" : "w-8 h-8 hover:bg-black/5"
                )}
            >
                <Plus className={cn("transition-transform duration-300", quantity === 0 ? "w-5 h-5" : "w-4 h-4")} strokeWidth={3} />
            </button>
        </div>
    );

    return (
        <Dialog>
            <div className="flex flex-col group relative h-full w-full select-none" dir="rtl">
                
                {/* Image Container */}
                <div className="relative aspect-square w-full rounded-[32px] bg-white border border-slate-100/60 group-hover:border-[#AADB56]/30 transition-all duration-500 overflow-hidden flex items-center justify-center p-6">
                    <DialogTrigger asChild>
                         <div className="absolute inset-0 cursor-pointer z-10"></div>
                    </DialogTrigger>
                    
                    {/* Badges - Glassmorphism style */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 pointer-events-none">
                        {product.is_on_sale && (
                            <span className="bg-[#f0d421]/90 backdrop-blur-md text-slate-900 font-black shadow-sm px-3 py-1 text-[11px] md:text-[12px] rounded-2xl border border-white/20">
                                מבצע
                            </span>
                        )}
                        {isNew && !product.is_on_sale && (
                            <span className="bg-[#c4dbfd]/90 backdrop-blur-md text-[#121b4a] font-black shadow-sm px-3 py-1 text-[11px] md:text-[12px] rounded-2xl border border-white/20">
                                חדש
                            </span>
                        )}
                    </div>
                
                    <div className="relative w-[90%] h-[90%] pointer-events-none z-0">
                        <Image 
                            src={imageSrc} 
                            alt={product.name} 
                            fill 
                            className="object-contain transition-all duration-700 group-hover:scale-110" 
                            sizes="(max-width: 1200px) 25vw, 15vw" 
                        />
                    </div>

                    {/* Quick Add Pill - Horizontal Expansion */}
                    <div className="absolute bottom-4 left-4 z-30">
                        <QuantitySelector />
                    </div>
                </div>

                {/* Info Container */}
                <div className="mt-4 px-2 text-right">
                    <DialogTrigger asChild>
                         <h3 className="font-black text-[#113123] text-[16px] md:text-[18px] leading-tight mb-1 cursor-pointer hover:text-[#AADB56] transition-colors line-clamp-1">{product.name}</h3>
                    </DialogTrigger>
                    
                    <div className="flex items-baseline gap-1.5 mb-1">
                        {product.is_on_sale && product.sale_price ? (
                            <>
                                <span className="text-xl font-black text-[#1b3626]">₪{product.sale_price.toFixed(2)}</span>
                                <span className="text-slate-400 text-[13px] font-bold line-through">₪{product.price.toFixed(2)}</span>
                            </>
                        ) : (
                            <span className="text-xl font-black text-[#1b3626]">₪{product.price.toFixed(2)}</span>
                        )}
                        <span className="text-slate-500 font-bold text-[14px]">/ {product.unit_type === 'kg' ? 'ק"ג' : 'יח\''}</span>
                    </div>

                    <div className="text-slate-400 text-[13px] font-bold leading-tight line-clamp-1 opacity-80">
                        {product.description || "טרי ואיכותי מהשדה"}
                    </div>
                </div>
            </div>

            {/* Premium Quick View Modal - No Shadows Flat Look */}
            <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden bg-white rounded-[40px] border border-slate-200 [&>button]:left-6 [&>button]:right-auto [&>button]:top-6 [&>button]:z-[110] [&>button]:text-[#1b3626] [&>button]:bg-white [&>button]:rounded-full [&>button]:w-10 [&>button]:h-10 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:hover:bg-slate-100 [&>button]:border [&>button]:border-slate-200 z-[100]" dir="rtl">
                <DialogTitle className="sr-only">{product.name}</DialogTitle>
                <DialogDescription className="sr-only">{product.description || product.name}</DialogDescription>

                <div className="flex flex-col md:flex-row w-full h-full max-h-[95vh]">
                    {/* Visual Section - Right (RTL Flow) */}
                    <div 
                        className="w-full md:w-[48%] relative bg-white flex items-center justify-center p-12 md:p-20 order-1 border-b md:border-b-0 md:border-l border-slate-100 overflow-hidden cursor-zoom-in"
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsZooming(true)}
                        onMouseLeave={() => setIsZooming(false)}
                    >
                        {/* Modal Badges */}
                        <div className="absolute top-4 right-4 md:top-10 md:right-10 flex flex-col gap-3 z-50">
                             {isNew && !product.is_on_sale && <span className="bg-[#c4dbfd] text-[#121b4a] px-5 py-2 rounded-2xl font-black text-[12px] md:text-[14px]">חדש</span>}
                             {product.is_on_sale && <span className="bg-[#f0d421] text-slate-800 px-5 py-2 rounded-2xl font-black text-[12px] md:text-[14px]">מבצע</span>}
                        </div>

                        <div className="relative w-full h-full aspect-square md:aspect-auto md:h-[400px]">
                            <Image 
                                src={imageSrc} 
                                alt={product.name} 
                                fill 
                                className={cn(
                                    "object-contain transition-transform duration-200 ease-out pointer-events-none",
                                    isZooming ? "scale-[2.2]" : "scale-100"
                                )}
                                style={isZooming ? {
                                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                                } : undefined}
                            />
                        </div>
                    </div>

                    {/* Content Section - Left (RTL Flow) */}
                    <div className="w-full md:w-[52%] flex flex-col p-10 md:p-14 justify-center items-start text-right bg-white order-2 h-full">
                        <div className="w-full mb-8">
                            <h2 className="text-[40px] md:text-[52px] font-black text-[#1b3626] leading-[1.05] tracking-tight mb-4">{product.name}</h2>
                            <div className="w-20 h-2 bg-[#AADB56] rounded-full opacity-60"></div>
                        </div>
                        
                        <div className="flex items-baseline gap-3 font-black text-[#1b3626] mb-8">
                             {product.is_on_sale && product.sale_price ? (
                                 <>
                                    <span className="text-4xl">₪{product.sale_price.toFixed(2)}</span>
                                    <span className="text-slate-300 line-through text-2xl">₪{product.price.toFixed(2)}</span>
                                 </>
                             ) : (
                                 <span className="text-4xl">₪{product.price.toFixed(2)}</span>
                             )}
                             <span className="text-2xl text-slate-400">/ {product.unit_type === 'kg' ? 'לק"ג' : 'ליחידה'}</span>
                        </div>

                        <div className="prose prose-slate mb-12">
                             <p className="text-xl text-slate-600 font-bold leading-relaxed border-r-4 border-[#AADB56] pr-6 py-2">
                                {product.description || "התוצרת שלנו נבחרת מדי בוקר בקפידה רבה. אנחנו מתחייבים לאיכות המקסימלית, לטריות מושלמת ולטעם של פעם – בדיוק כמו בשוק, רק אצלכם בבית."}
                             </p>
                        </div>

                        <div className="w-full mt-auto space-y-4">
                            {quantity === 0 ? (
                                <Button 
                                    className="w-full h-[72px] bg-[#AADB56] hover:bg-[#96ce3f] text-[#112a1e] text-[22px] font-black rounded-[24px] transition-all active:scale-[0.97] border-b-4 border-black/10" 
                                    onClick={handleIncrement}
                                >
                                    הוספה לעגלה
                                </Button>
                            ) : (
                                <div className="w-full h-[72px] flex items-center justify-between bg-primary rounded-[24px] overflow-hidden text-white px-2 border-b-4 border-black/10">
                                    <button className="h-full px-8 flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95" onClick={handleIncrement}>
                                        <Plus className="h-8 w-8" strokeWidth={3} />
                                    </button>
                                    <span className="font-black text-[28px] flex-1 text-center pt-1">{quantity}</span>
                                    <button className="h-full px-8 flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95" onClick={handleDecrement}>
                                        {quantity <= step ? <Trash2 className="h-6 w-6" /> : <Minus className="h-8 w-8" strokeWidth={3} />}
                                    </button>
                                </div>
                            )}
                            <p className="text-center text-slate-400 font-bold text-sm">
                                {product.unit_type === 'kg' ? '* המשקל הסופי עשוי להשתנות מעט' : '* המחיר כולל מע"מ'}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
