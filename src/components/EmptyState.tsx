import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
    className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-300", className)}>
            <div className="bg-slate-50 p-6 rounded-full mb-6 relative">
                <Icon className="h-12 w-12 text-slate-300" />
                <div className="absolute inset-0 bg-green-100/50 rounded-full blur-xl -z-10 animate-pulse" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8 text-base">
                {description}
            </p>

            {action && (
                action.href ? (
                    <Button asChild size="lg" className="rounded-full font-bold px-8 shadow-lg shadow-green-900/10 hover:shadow-green-900/20 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 transition-all hover:-translate-y-1">
                        <Link href={action.href}>{action.label}</Link>
                    </Button>
                ) : (
                    <Button
                        size="lg"
                        onClick={action.onClick}
                        className="rounded-full font-bold px-8 shadow-lg shadow-green-900/10 hover:shadow-green-900/20 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 transition-all hover:-translate-y-1"
                    >
                        {action.label}
                    </Button>
                )
            )}
        </div>
    );
}
