import { BlockEditor } from "@/components/admin/BlockEditor";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";

interface EditBlockPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditBlockPage({ params }: EditBlockPageProps) {
    const { id } = await params;
    const supabase = createClient();

    const { data: block } = await supabase
        .from("content_blocks")
        .select("*")
        .eq("id", parseInt(id))
        .single();

    if (!block) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/content">
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">עריכת בלוק</h1>
                    <p className="text-muted-foreground">ערוך את התוכן וההגדרות של הבלוק</p>
                </div>
            </div>

            <BlockEditor defaultValues={block} />
        </div>
    );
}
