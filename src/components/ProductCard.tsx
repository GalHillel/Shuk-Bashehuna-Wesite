"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Plus, Minus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/store/useCart"
import { Product } from "@/types/supabase"
import { useState } from "react"

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart()
    const [quantity, setQuantity] = useState(1)
    const [customWeight, setCustomWeight] = useState("")

    const handleAddToCart = () => {
        const finalQuantity =
            product.unit_type === "kg" && customWeight ? parseFloat(customWeight) : quantity

        if (finalQuantity <= 0) return

        addItem(product, finalQuantity)
        setQuantity(product.unit_type === "kg" ? 1 : 1) // Reset
        setCustomWeight("")
    }

    const increment = () => setQuantity((prev) => prev + 1)
    const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

    return (
        <Card className="overflow-hidden h-full flex flex-col group hover:shadow-lg transition-shadow duration-300 border-none shadow-sm bg-card">
            <div className="relative aspect-square overflow-hidden bg-secondary/10">
                <Link href={`/product/${product.id}`} className="block w-full h-full">
                    <Image
                        src={product.image_url || "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </Link>
                {/* Badges */}
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                    {product.is_on_sale && (
                        <Badge variant="destructive" className="font-bold">מבצע</Badge>
                    )}
                    {/* Example of 'New' badge logic if we had a field for it */}
                    {/* <Badge className="bg-primary text-primary-foreground">חדש</Badge> */}
                </div>
            </div>

            <CardContent className="flex-1 p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {product.unit_type === 'kg' ? 'מחיר לק"ג' : 'מחיר ליחידה'}
                        </p>
                    </div>
                    <div className="text-left">
                        {product.is_on_sale && product.sale_price ? (
                            <div className="flex flex-col items-end">
                                <span className="font-bold text-xl text-red-600">₪{product.sale_price.toFixed(2)}</span>
                                <span className="text-sm text-muted-foreground line-through decoration-red-500/50">₪{product.price.toFixed(2)}</span>
                            </div>
                        ) : (
                            <span className="font-bold text-xl text-primary">₪{product.price.toFixed(2)}</span>
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                {/* Simple Add to Cart logic for the card redesign - keeping it efficient */}
                <div className="w-full flex items-center justify-between gap-2">

                    {product.unit_type === 'kg' ? (
                        // Kg Logic: Simple Input or Buttons? Let's use standard quantity for now to keep UI clean 
                        // but allow a dialog or expanded view for exact weight in future.
                        // For now, defaulting to 1kg increments or 0.5kg toggles is common.
                        <div className="flex items-center border rounded-md overflow-hidden bg-background shadow-sm w-full">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-none hover:bg-secondary"
                                onClick={decrement}
                                disabled={quantity <= 1}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="flex-1 text-center text-sm font-medium">{quantity} ק&quot;ג</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-none hover:bg-secondary"
                                onClick={increment}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                    ) : (
                        // Unit Logic
                        <div className="flex items-center border rounded-md overflow-hidden bg-background shadow-sm w-full">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-none hover:bg-secondary"
                                onClick={decrement}
                                disabled={quantity <= 1}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="flex-1 text-center text-sm font-medium">{quantity} יח&apos;</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-none hover:bg-secondary"
                                onClick={increment}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                    )}

                    <Button size="icon" className="h-9 w-9 shrink-0 shadow-sm" onClick={handleAddToCart}>
                        <ShoppingCart className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
