import { cn } from "@/lib/utils";
import React from "react";

interface AdminHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
}

export function AdminHeader({ title, description, children, className }: AdminHeaderProps) {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8", className)}>
            <div className="space-y-1">
                <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight">
                    {title}
                </h1>
                {description && (
                    <p className="text-slate-500 font-bold text-xs md:text-base opacity-80">
                        {description}
                    </p>
                )}
            </div>
            {children && (
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {children}
                </div>
            )}
        </div>
    );
}
