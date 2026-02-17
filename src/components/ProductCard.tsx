"use client"

import Image from "next/image"
import Link from "next/link"
import { Plus, Minus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/store/useCart"
import { Product } from "@/types/supabase"
import { cn } from "@/lib/utils"

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const { items, addItem, removeItem, updateQuantity } = useCart()

    // Check if item is in cart and get its quantity
    const cartItem = items.find(item => item.product.id === product.id)
    const quantity = cartItem ? cartItem.quantity : 0

    const handleIncrement = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        addItem(product, 1) // Add 1 unit/kg
    }

    const handleDecrement = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (quantity > 1) {
            updateQuantity(product.id, quantity - 1)
        } else {
            removeItem(product.id)
        }
    }

    const imageSrc = (product.image_url && product.image_url.trim().length > 0)
        ? product.image_url
        : "/placeholder.png";

    // "New" Logic (Example: created in last 7 days)
    const isNew = new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return (
        <Card className="group h-full flex flex-col overflow-visible border-none bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative z-0 hover:z-10">
            {/* Image Container - 4/3 Aspect Ratio */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-slate-50">
                <Link href={`/product/${product.id}`} className="block w-full h-full">
                    <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
                    {product.is_on_sale && (
                        <Badge variant="destructive" className="font-bold shadow-sm px-2 py-0.5 text-[10px] md:text-xs rounded-lg animate-in fade-in zoom-in duration-300">
                            מבצע
                        </Badge>
                    )}
                    {isNew && !product.is_on_sale && (
                        <Badge className="bg-green-600 hover:bg-green-700 font-bold shadow-sm px-2 py-0.5 text-[10px] md:text-xs rounded-lg animate-in fade-in zoom-in duration-300 delay-75">
                            חדש
                        </Badge>
                    )}
                </div>

                {/* Floating Add Button (Visible when quantity is 0) */}
                {quantity === 0 && (
                    <Button
                        size="icon"
                        className={cn(
                            "absolute bottom-2 left-2 h-9 w-9 rounded-full shadow-lg",
                            "bg-gradient-to-br from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white",
                            "transition-all duration-300 hover:scale-110 active:scale-95 group-hover:bottom-3"
                        )}
                        onClick={handleIncrement}
                        aria-label="הוסף לסל"
                    >
                        <Plus className="h-5 w-5 stroke-[2.5]" />
                    </Button>
                )}
            </div>

            {/* Content */}
            <CardContent className="flex-1 p-2.5 flex flex-col gap-1">
                <div className="flex-1 min-h-[2.5rem]">
                    <Link href={`/product/${product.id}`} className="block group-hover:text-green-800 transition-colors">
                        <h3 className="font-medium text-sm leading-tight text-slate-800 line-clamp-2" title={product.name}>
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="flex items-end justify-between mt-1">
                    <div className="flex flex-col leading-none">
                        {product.is_on_sale && product.sale_price ? (
                            <>
                                <span className="font-bold text-lg text-red-600">₪{product.sale_price.toFixed(2)}</span>
                                <span className="text-xs text-slate-400 line-through">₪{product.price.toFixed(2)}</span>
                            </>
                        ) : (
                            <span className="font-bold text-lg text-slate-900">₪{product.price.toFixed(2)}</span>
                        )}
                        <span className="text-[10px] text-slate-400 font-medium">
                            {product.unit_type === 'kg' ? 'לק"ג' : "ליח'"}
                        </span>
                    </div>

                    {/* Controls when quantity > 0 */}
                    {quantity > 0 && (
                        <div className="flex items-center bg-white border border-green-100 rounded-full shadow-sm p-0.5 animate-in fade-in zoom-in duration-200">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full text-red-500 hover:bg-slate-50 hover:text-red-600"
                                onClick={handleDecrement}
                            >
                                {quantity === 1 ? <Trash2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                            </Button>
                            <span className="font-bold text-sm w-5 text-center leading-none text-slate-900">
                                {quantity}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full text-green-700 hover:bg-green-50"
                                onClick={handleIncrement}
                            >
                                <Plus className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
