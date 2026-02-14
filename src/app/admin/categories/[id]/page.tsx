import { CategoryForm } from "@/components/admin/CategoryForm";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";

interface EditCategoryPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
    const { id } = await params;
    const supabase = createClient();

    const { data: category } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

    if (!category) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/categories">
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">עריכת קטגוריה</h1>
                </div>
            </div>

            <CategoryForm defaultValues={category} />
        </div>
    );
}
