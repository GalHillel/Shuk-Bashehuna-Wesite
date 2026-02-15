"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/store/useCart"
import { Product } from "@/types/supabase"

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
        : "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800";

    return (
        <Card className="group h-full flex flex-col overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-3xl">
            {/* Image Container - Square Aspect Ratio */}
            <div className="relative aspect-square w-full overflow-hidden bg-secondary/20">
                <Link href={`/product/${product.id}`} className="block w-full h-full">
                    <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
                    {product.is_on_sale && (
                        <Badge variant="destructive" className="font-bold shadow-sm px-2.5 py-1 text-xs">מבצע</Badge>
                    )}
                </div>

                {/* Floating Add Button (Visible when quantity is 0) */}
                {quantity === 0 && (
                    <Button
                        size="icon"
                        className="absolute bottom-3 right-3 h-10 w-10 rounded-full shadow-lg bg-white hover:bg-white text-primary hover:scale-110 transition-all duration-300 z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-2 md:group-hover:translate-y-0"
                        onClick={handleIncrement}
                    >
                        <Plus className="h-5 w-5 stroke-[3]" />
                    </Button>
                )}
            </div>

            {/* Content Content */}
            <CardContent className="flex-1 p-3.5 flex flex-col gap-1.5">
                <div className="flex-1">
                    <Link href={`/product/${product.id}`} className="block">
                        <h3 className="font-bold text-base leading-tight text-foreground line-clamp-2 min-h-[2.5rem]" title={product.name}>
                            {product.name}
                        </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">
                        {product.unit_type === 'kg' ? 'מחיר לק"ג' : 'מחיר ליחידה'}
                    </p>
                </div>

                <div className="flex items-baseline gap-2 mt-1">
                    {product.is_on_sale && product.sale_price ? (
                        <>
                            <span className="font-bold text-lg text-red-600">₪{product.sale_price.toFixed(2)}</span>
                            <span className="text-sm text-muted-foreground line-through decoration-red-500/50">₪{product.price.toFixed(2)}</span>
                        </>
                    ) : (
                        <span className="font-bold text-lg text-primary">₪{product.price.toFixed(2)}</span>
                    )}
                </div>
            </CardContent>

            {/* Footer / Controls */}
            {quantity > 0 && (
                <CardFooter className="p-3.5 pt-0 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center justify-between w-full bg-secondary/50 rounded-full p-1 h-10">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-white shadow-sm text-destructive hover:text-destructive"
                            onClick={handleDecrement}
                        >
                            {quantity === 1 ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                        </Button>
                        <span className="font-bold text-sm w-8 text-center tabular-nums">
                            {quantity}{product.unit_type === 'kg' ? 'ק"ג' : ''}
                        </span>
                        <Button
                            variant="default" // Primary color
                            size="icon"
                            className="h-8 w-8 rounded-full hover:scale-105 transition-transform shadow-sm"
                            onClick={handleIncrement}
                        >
                            <Plus className="h-4 w-4 text-white" />
                        </Button>
                    </div>
                </CardFooter>
            )}
        </Card>
    )
}
