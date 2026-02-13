"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/useCart";
import { Product } from "@/types/supabase";

interface ProductActionsProps {
    product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);

    const increment = () => setQuantity((prev) => prev + 1);
    const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = () => {
        addItem(product, quantity);
        setQuantity(1); // Reset
    };

    return (
        <div className="flex flex-col gap-4 w-full md:w-auto">
            <p className="text-sm text-muted-foreground mb-1">
                כמות ({product.unit_type === 'kg' ? 'ק"ג' : 'יחידות'})
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <div className="flex items-center border rounded-md overflow-hidden bg-background shadow-sm w-full sm:w-40 h-12">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-full w-12 rounded-none hover:bg-secondary"
                        onClick={decrement}
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="flex-1 text-center text-lg font-medium">{quantity}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-full w-12 rounded-none hover:bg-secondary"
                        onClick={increment}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <Button
                    size="lg"
                    className="h-12 text-lg px-8 shadow-sm flex-1 sm:flex-initial gap-2"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart className="h-5 w-5" />
                    הוסף לסל
                </Button>
            </div>
        </div>
    );
}
