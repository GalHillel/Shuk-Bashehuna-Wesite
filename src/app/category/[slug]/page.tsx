import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/Footer";
import { ProductGridWithFilters } from "@/components/ProductGridWithFilters";
import { createClient } from "@/lib/supabase/client";
import { Category, Product } from "@/types/supabase";

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

    // Explicitly cast to fix inference
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

    // 3. Fetch All Categories for Filtering (if needed)
    let allCategories: Category[] = [];
    if (slug === 'specials' || slug === 'sale') {
        const { data: cats } = await supabase
            .from("categories")
            .select("*")
            .eq("is_visible", true)
            .order("sort_order", { ascending: true });
        if (cats) allCategories = cats;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 container py-8">
                <div className="flex flex-col gap-6">

                    <div className="flex flex-col gap-2 items-center">
                        <h1 className="text-3xl font-bold tracking-tight text-center">{category.name}</h1>
                        <p className="text-muted-foreground text-center">
                            מציג {products.length} מוצרים
                        </p>
                    </div>

                    <ProductGridWithFilters
                        products={products}
                        categories={allCategories}
                        showFilters={slug === 'specials' || slug === 'sale'}
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
}
