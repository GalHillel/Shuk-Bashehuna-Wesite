import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/supabase";
import { ProductCard } from "@/components/ProductCard";
import { ProductActions } from "@/components/ProductActions";

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Revalidate every 60 seconds
export const revalidate = 60;

export async function generateStaticParams() {
    const supabase = createClient();
    const { data } = await supabase
        .from("products")
        .select("id")
        .eq("is_active", true);

    // Explicitly cast to fix inference
    const products = data as { id: string }[] | null;

    if (!products) return [];

    return products.map((product) => ({
        id: product.id,
    }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { id } = await params;
    const supabase = createClient();

    const { data: product } = await supabase
        .from("products")
        .select("name, description, image_url")
        .eq("id", id)
        .single();

    if (!product) {
        return {
            title: "מוצר לא נמצא | Shuk Bashehuna",
            description: "המוצר שחיפשת אינו קיים.",
        };
    }

    return {
        title: `${product.name} | Shuk Bashehuna`,
        description: product.description || `קנו ${product.name} טרי ואיכותי בשוק בשכונה.`,
        openGraph: {
            title: product.name,
            description: product.description || `קנו ${product.name} טרי ואיכותי בשוק בשכונה.`,
            images: product.image_url ? [product.image_url] : [],
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const supabase = createClient();

    const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    const product = data as Product | null;

    if (!product) {
        notFound();
    }

    // Fetch related products (same category)
    let relatedProducts: Product[] = [];
    if (product.category_id) {
        const { data: related } = await supabase
            .from("products")
            .select("*")
            .eq("category_id", product.category_id)
            .eq("is_active", true)
            .neq("id", product.id)
            .limit(4);

        if (related) {
            relatedProducts = related;
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1 container py-8">
                <div className="flex flex-col gap-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Image Gallery (Single Image for now) */}
                        <div className="relative aspect-square bg-secondary/10 rounded-xl overflow-hidden shadow-sm">
                            <Image
                                src={product.image_url || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                            {product.is_on_sale && (
                                <div className="absolute top-4 right-4">
                                    <Badge variant="destructive" className="text-lg px-3 py-1">מבצע</Badge>
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col gap-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                    {product.name}
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    {product.description || "אין תיאור למוצר זה."}
                                </p>
                            </div>

                            <div className="flex items-baseline gap-4 mt-2">
                                {product.is_on_sale && product.sale_price ? (
                                    <>
                                        <span className="text-4xl font-bold text-red-600">₪{product.sale_price.toFixed(2)}</span>
                                        <span className="text-xl text-muted-foreground line-through decoration-red-500/50">
                                            ₪{product.price.toFixed(2)}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-4xl font-bold text-primary">₪{product.price.toFixed(2)}</span>
                                )}
                                <span className="text-lg text-muted-foreground">
                                    / {product.unit_type === 'kg' ? 'ק"ג' : 'יחידה'}
                                </span>
                            </div>

                            <div className="p-6 bg-secondary/20 rounded-xl border border-border">
                                <p className="font-medium mb-4">הוספה לסל:</p>
                                <div className="flex gap-4">
                                    <ProductActions product={product} />
                                </div>
                            </div>

                            <div className="border-t pt-6 mt-4">
                                <h3 className="font-bold mb-2">פרטים נוספים</h3>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                    <li>טריות מובטחת</li>
                                    <li>משלוח מהיר עד הבית</li>
                                    <li>כשרות מהודרת</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-12 border-t pt-12">
                            <h2 className="text-2xl font-bold mb-6">מוצרים נוספים שאולי תאהבו</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {relatedProducts.map((rp) => (
                                    <ProductCard key={rp.id} product={rp} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
