import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Database } from '@/types/supabase';

export type Product = Database['public']['Tables']['products']['Row'];

export interface CartItem {
    product: Product;
    quantity: number; // For units: 1, 2, 3... For Kg: 0.5, 1.0, 1.2...
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product, quantity: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;

    // Computed (helper)
    itemsCount: () => number;
    totalPriceEstimated: () => number;
}

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product, quantity) => {
                set((state) => {
                    const existingItem = state.items.find((item) => item.product.id === product.id);

                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.product.id === product.id
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            ),
                        };
                    }

                    return {
                        items: [...state.items, { product, quantity }],
                    };
                });
            },

            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.product.id !== productId),
                }));
            },

            updateQuantity: (productId, quantity) => {
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            items: state.items.filter((item) => item.product.id !== productId),
                        };
                    }
                    return {
                        items: state.items.map((item) =>
                            item.product.id === productId ? { ...item, quantity } : item
                        ),
                    };
                });
            },

            clearCart: () => set({ items: [] }),

            itemsCount: () => {
                return get().items.reduce((acc, item) => acc + item.quantity, 0);
            },

            totalPriceEstimated: () => {
                return get().items.reduce((total, item) => {
                    const price = item.product.sale_price || item.product.price;
                    return total + price * item.quantity;
                }, 0);
            },
        }),
        {
            name: 'shuk-online-cart',
        }
    )
);
