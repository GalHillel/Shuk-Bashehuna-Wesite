import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Category, Product } from "@/types/supabase";
import { CategoryPageClient } from "./CategoryPageClient";

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export async function generateStaticParams() {
    const supabase = createClient();
    const { data } = await supabase
        .from("categories")
        .select("id")
        .eq("is_visible", true);

    const categories = data as Category[] | null;

    if (!categories) return [];

    return categories.map((category) => ({
        slug: category.id,
    }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const supabase = createClient();

    let category: Category | null = null;
    let products: Product[] = [];

    // 1. Fetch Category Details
    if (slug === 'specials' || slug === 'sale') {
        category = {
            id: 'specials',
            name: 'מבצעים',
            slug: 'specials',
            image_url: null,
            sort_order: 999,
            is_visible: true,
            created_at: new Date().toISOString()
        } as Category;
    } else {
        const { data } = await supabase
            .from("categories")
            .select("*")
            .eq("id", slug)
            .single();
        category = data;
    }

    if (!category) {
        notFound();
    }

    // 2. Fetch Products
    let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    if (slug === 'specials' || slug === 'sale') {
        query = query.eq("is_on_sale", true);
    } else {
        query = query.eq("category_id", slug);
    }

    const { data: productsData } = await query;
    if (productsData) {
        products = productsData;
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-50/50">
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2 items-center mb-6">
                        <h1 className="text-4xl font-extrabold tracking-tight text-center text-[#052e16] drop-shadow-sm">{category.name}</h1>
                        <p className="text-slate-500 text-center font-medium">
                            {products.length} מוצרים בקטגוריה
                        </p>
                    </div>

                    <CategoryPageClient initialProducts={products} />
                </div>
            </main>
        </div>
    );
}
