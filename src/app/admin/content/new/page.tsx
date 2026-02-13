import { BlockEditor } from "@/components/admin/BlockEditor";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function NewBlockPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/content">
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">הוספת בלוק חדש</h1>
            </div>

            <BlockEditor />
        </div>
    );
}
