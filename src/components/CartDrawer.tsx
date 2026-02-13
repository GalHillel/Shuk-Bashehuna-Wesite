"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/useCart";
import Image from "next/image";
import Link from "next/link";

const UNIT_LABELS: Record<string, string> = {
    kg: 'ק"ג',
    unit: "יח'",
    pack: "מארז",
};

export function CartDrawer() {
    const { items, removeItem, updateQuantity, totalPriceEstimated } = useCart();
    const total = totalPriceEstimated();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {items.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {items.length}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                    <SheetTitle className="text-xl flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                        סל הקניות שלך
                    </SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
                        <ShoppingCart className="h-16 w-16 opacity-30" />
                        <div className="text-center">
                            <p className="text-lg font-medium">הסל ריק</p>
                            <p className="text-sm">הוסיפו מוצרים מהחנות</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 my-4">
                            <div className="space-y-4 pl-1">
                                {items.map((item) => (
                                    <div key={item.product.id} className="flex gap-3 p-3 bg-secondary/20 rounded-xl">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                                            {item.product.image_url ? (
                                                <Image
                                                    src={item.product.image_url}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl">🥕</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                                            <p className="text-xs text-muted-foreground">
                                                ₪{(item.product.is_on_sale && item.product.sale_price
                                                    ? item.product.sale_price
                                                    : item.product.price
                                                ).toFixed(2)} / {UNIT_LABELS[item.product.unit_type] || "יח'"}
                                            </p>

                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="flex items-center border rounded-md overflow-hidden bg-background h-8">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none"
                                                        onClick={() => updateQuantity(item.product.id, Math.max(0.5, item.quantity - (item.product.unit_type === "kg" ? 0.5 : 1)))}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="px-2 text-sm font-medium min-w-[32px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none"
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + (item.product.unit_type === "kg" ? 0.5 : 1))}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>

                                                <span className="text-sm font-bold text-primary mr-auto">
                                                    ₪{((item.product.is_on_sale && item.product.sale_price
                                                        ? item.product.sale_price
                                                        : item.product.price
                                                    ) * item.quantity).toFixed(2)}
                                                </span>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => removeItem(item.product.id)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <SheetFooter className="flex-col gap-3 border-t pt-4">
                            <div className="flex items-center justify-between w-full text-lg">
                                <span className="font-medium">סה&quot;כ משוער:</span>
                                <span className="font-bold text-xl text-primary">₪{total.toFixed(2)}</span>
                            </div>
                            <Button asChild size="lg" className="w-full h-12 text-lg font-bold rounded-xl">
                                <Link href="/checkout">לתשלום</Link>
                            </Button>
                        </SheetFooter>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
