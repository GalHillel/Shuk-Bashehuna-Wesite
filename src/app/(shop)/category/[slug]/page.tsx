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
            parent_id: null,
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

    // Fetch related subcategories
    let subCategories: Category[] = [];
    let parentCategory: Category | null = null;
    if (slug !== 'specials' && slug !== 'sale') {
        const parentIdToLookup = category.parent_id ? category.parent_id : category.id;
        
        // Fetch parent category details if current is a sub
        if (category.parent_id) {
            const { data: pData } = await supabase.from("categories").select("*").eq("id", category.parent_id).single();
            parentCategory = pData;
        } else {
            parentCategory = category;
        }

        const { data: subsData } = await supabase
            .from("categories")
            .select("*")
            .eq("parent_id", parentIdToLookup)
            .eq("is_visible", true)
            .order("sort_order", { ascending: true });
        
        if (subsData) {
            subCategories = subsData;
        }
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
        query = query.or(`category_id.eq.${slug},subcategory_id.eq.${slug}`);
    }

    const { data: productsData } = await query;
    if (productsData) {
        products = productsData;
    }

    return (
        <div className="flex min-h-screen flex-col bg-transparent overflow-x-hidden">
            {/* Hero Section */}
            <div 
                className="bg-[#AADB56] pt-14 pb-12 text-center relative overflow-hidden"
                style={{ 
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 2px, transparent 2.5px)', 
                    backgroundSize: '24px 24px' 
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none"></div>
                <div className="relative z-10 container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-black text-[#112a1e] mb-2 tracking-tighter drop-shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
                        {category.name}
                    </h1>
                    <div className="w-16 h-1.5 bg-[#112a1e] mx-auto mb-4 rounded-full opacity-20"></div>
                    <p className="text-lg md:text-xl text-[#2c3e1c] font-black max-w-2xl mx-auto px-4 leading-tight opacity-90 animate-in fade-in slide-in-from-bottom-4 delay-200 duration-700">
                        התוצרת הטרייה והאיכותית ביותר, ישירות מהחקלאי עד אליכם.
                    </p>
                </div>
            </div>

            <main className="flex-1 container mx-auto px-6 md:px-8 py-8 lg:py-12">
                <div className="flex flex-col gap-6">
                    <CategoryPageClient 
                        initialProducts={products} 
                        subCategories={subCategories} 
                        currentSlug={slug}
                        parentCategorySlug={category.parent_id ? category.parent_id : category.id}
                        parentCategoryName={parentCategory?.name || category.name}
                    />
                </div>
            </main>
        </div>
    );
}
