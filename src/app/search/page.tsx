import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/Footer";
import { ProductGridWithFilters } from "@/components/ProductGridWithFilters";
import { createClient } from "@/lib/supabase/client";
import { Product, Category } from "@/types/supabase";

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
    }>;
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const query = q || "";
    const supabase = createClient();

    let products: Product[] = [];
    let allCategories: Category[] = [];

    if (query.length >= 2) {
        // 1. Fetch Matching Products
        const { data } = await supabase
            .from("products")
            .select("*")
            .ilike("name", `%${query}%`)
            .eq("is_active", true);

        if (data) products = data;
    }

    // 2. Fetch All Categories for Filtering
    const { data: cats } = await supabase
        .from("categories")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });

    if (cats) allCategories = cats;


    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 container py-8">
                <div className="flex flex-col gap-6">

                    <div className="flex flex-col gap-2 items-center">
                        <h1 className="text-3xl font-bold tracking-tight text-center">תוצאות חיפוש: "{query}"</h1>
                        <p className="text-muted-foreground text-center">
                            נמצאו {products.length} מוצרים
                        </p>
                    </div>

                    <ProductGridWithFilters
                        products={products}
                        categories={allCategories}
                        showFilters={true}
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
}
