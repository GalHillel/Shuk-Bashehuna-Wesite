"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function DebugPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [categories, setCategories] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const supabase = createClient();

            // 1. Fetch Categories
            const { data: cats } = await supabase.from('categories').select('*');
            setCategories(cats || []);

            // 2. Fetch Products
            const { data: prods } = await supabase.from('products').select('*');
            setProducts(prods || []);

            setLoading(false);
        }
        loadData();
    }, []);

    if (loading) return <div className="p-8">Loading debug data...</div>;

    return (
        <div className="p-8 dir-ltr font-mono text-sm">
            <h1 className="text-2xl font-bold mb-4">Debug Data</h1>

            <div className="grid grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-bold mb-2">Categories ({categories.length})</h2>
                    <pre className="bg-slate-100 p-4 rounded overflow-auto max-h-[500px]">
                        {JSON.stringify(categories, null, 2)}
                    </pre>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-2">Products ({products.length})</h2>
                    <pre className="bg-slate-100 p-4 rounded overflow-auto max-h-[500px]">
                        {JSON.stringify(products, null, 2)}
                    </pre>

                    <div className="mt-4">
                        <h3 className="font-bold">Products per Category ID:</h3>
                        <ul className="list-disc pl-5">
                            {categories.map(cat => {
                                const count = products.filter(p => p.category_id === cat.id).length;
                                return (
                                    <li key={cat.id} className={count === 0 ? "text-red-500 font-bold" : "text-green-600"}>
                                        {cat.name} ({cat.id}): {count} products
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
