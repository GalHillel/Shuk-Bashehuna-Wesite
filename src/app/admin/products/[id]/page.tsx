import { ProductForm } from "@/components/admin/ProductForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface EditProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: product } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (!product) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">עריכת מוצר</h1>
                    <p className="text-muted-foreground mt-1">ערוך את פרטי המוצר {product.name}</p>
                </div>
            </div>

            <ProductForm product={product} />
        </div>
    );
}
