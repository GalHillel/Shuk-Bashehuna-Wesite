import { SearchPageClient } from "./SearchPageClient";
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
        <div className="flex min-h-screen flex-col bg-transparent overflow-x-hidden">
            {/* Hero Section */}
            <div 
                className="bg-[#AADB56] pt-10 pb-8 text-center relative overflow-hidden"
                style={{ 
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 2px, transparent 2.5px)', 
                    backgroundSize: '24px 24px' 
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none"></div>
                <div className="relative z-10 container mx-auto px-4">
                    <h2 className="text-lg font-black text-[#112a1e]/50 mb-1 uppercase tracking-tight">
                        תוצאות עבור
                    </h2>
                    <h1 className="text-3xl md:text-5xl font-black text-[#112a1e] mb-2 tracking-tighter drop-shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
                        &quot;{query}&quot;
                    </h1>
                    <div className="w-12 h-1 bg-[#112a1e] mx-auto mb-3 rounded-full opacity-20"></div>
                    <p className="text-base md:text-lg text-[#2c3e1c] font-black max-w-2xl mx-auto px-4 leading-tight opacity-90 animate-in fade-in slide-in-from-bottom-4 delay-200 duration-700">
                        מצאנו עבורך {products.length} מוצרים.
                    </p>
                </div>
            </div>

            <main className="flex-1 container mx-auto px-6 md:px-8 py-8 lg:py-12">
                <SearchPageClient 
                    initialProducts={products}
                    categories={allCategories}
                    query={query}
                />
            </main>
        </div>
    );
}
