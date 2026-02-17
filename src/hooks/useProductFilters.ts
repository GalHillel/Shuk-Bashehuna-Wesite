import { useState, useMemo, useEffect } from 'react';
import { Product } from '@/types/supabase';

export type SortOption = 'price-asc' | 'price-desc' | 'newest';

export interface FilterState {
    minPrice: number;
    maxPrice: number;
    searchQuery: string;
    inStockOnly: boolean;
    sort: SortOption;
}

export function useProductFilters(initialProducts: Product[]) {
    // 1. Calculate Initial Min/Max Prices from data
    const { initialMin, initialMax } = useMemo(() => {
        if (initialProducts.length === 0) return { initialMin: 0, initialMax: 100 };
        const prices = initialProducts.map(p => p.sale_price || p.price);
        return {
            initialMin: Math.floor(Math.min(...prices)),
            initialMax: Math.ceil(Math.max(...prices))
        };
    }, [initialProducts]);

    // 2. State
    const [filters, setFilters] = useState<FilterState>({
        minPrice: 0,
        maxPrice: 1000,
        searchQuery: '',
        inStockOnly: false,
        sort: 'newest'
    });

    // Update state bounds when products change (e.g. category switch)
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            minPrice: initialMin,
            maxPrice: initialMax
        }));
    }, [initialMin, initialMax]);

    // 3. Filter Logic
    const filteredProducts = useMemo(() => {
        let result = [...initialProducts];

        // Search
        if (filters.searchQuery.trim()) {
            const q = filters.searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                (p.description && p.description.toLowerCase().includes(q))
            );
        }

        // Price Range
        result = result.filter(p => {
            const price = p.sale_price || p.price;
            return price >= filters.minPrice && price <= filters.maxPrice;
        });

        // Stock
        if (filters.inStockOnly) {
            result = result.filter(p => p.stock_quantity > 0);
        }

        // Sort
        result.sort((a, b) => {
            const priceA = a.sale_price || a.price;
            const priceB = b.sale_price || b.price;

            switch (filters.sort) {
                case 'price-asc':
                    return priceA - priceB;
                case 'price-desc':
                    return priceB - priceA;
                case 'newest':
                default:
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
        });

        return result;
    }, [initialProducts, filters]);

    // 4. Actions
    const setMinPrice = (val: number) => setFilters(prev => ({ ...prev, minPrice: val }));
    const setMaxPrice = (val: number) => setFilters(prev => ({ ...prev, maxPrice: val }));
    const setSearchQuery = (val: string) => setFilters(prev => ({ ...prev, searchQuery: val }));
    const setInStockOnly = (val: boolean) => setFilters(prev => ({ ...prev, inStockOnly: val }));
    const setSort = (val: SortOption) => setFilters(prev => ({ ...prev, sort: val }));
    const resetFilters = () => setFilters({
        minPrice: initialMin,
        maxPrice: initialMax,
        searchQuery: '',
        inStockOnly: false,
        sort: 'newest'
    });

    return {
        products: filteredProducts,
        totalProducts: initialProducts.length,
        filteredCount: filteredProducts.length,
        filters,
        bounds: { min: initialMin, max: initialMax },
        actions: {
            setMinPrice,
            setMaxPrice,
            setSearchQuery,
            setInStockOnly,
            setSort,
            resetFilters,
            setFilters // Allow bulk updates if needed
        }
    };
}
