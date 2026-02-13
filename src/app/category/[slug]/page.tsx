import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/client";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
    if (slug === 'specials') {
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

    if (slug === 'specials') {
        query = query.eq("is_on_sale", true);
    } else {
        query = query.eq("category_id", slug);
    }

    const { data: productsData } = await query;
    if (productsData) {
        products = productsData;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 container py-8">
                <div className="flex flex-col gap-6">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">דף הבית</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{category.name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
                        <p className="text-muted-foreground">
                            מציג {products.length} מוצרים
                        </p>
                    </div>

                    {products.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">
                            <p className="text-lg">בקרוב יעלו מוצרים לקטגוריה זו...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
