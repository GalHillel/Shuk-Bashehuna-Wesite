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
        <div className={cn("flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500", className)}>
            <div className="relative mb-8">
                <div className="bg-[#f6fbe8] p-8 rounded-[40px] relative z-10 border-2 border-dashed border-[#d7f59d]/60">
                    <Icon className="h-16 w-16 text-[#AADB56] stroke-[1.5]" />
                </div>
                {/* Decorative background elements */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#d7f59d]/30 rounded-full blur-xl -z-0" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-[#AADB56]/10 rounded-full blur-2xl -z-0" />
            </div>

            <h3 className="text-[32px] font-black text-[#1b3626] mb-3 tracking-tight leading-tight">{title}</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-10 text-[17px] font-medium leading-relaxed">
                {description}
            </p>

            {action && (
                action.href ? (
                    <Button asChild className="h-14 rounded-full font-black px-10 text-[18px] shadow-xl shadow-[#1b3626]/10 bg-[#1b3626] hover:bg-black text-white transition-all transform hover:scale-105 active:scale-95">
                        <Link href={action.href}>{action.label}</Link>
                    </Button>
                ) : (
                    <Button
                        onClick={action.onClick}
                        className="h-14 rounded-full font-black px-10 text-[18px] shadow-xl shadow-[#1b3626]/10 bg-[#1b3626] hover:bg-black text-white transition-all transform hover:scale-105 active:scale-95"
                    >
                        {action.label}
                    </Button>
                )
            )}
        </div>
    );
}
