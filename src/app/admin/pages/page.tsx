"use client";

export default function AdminPagesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">ניהול עמודים</h1>
                <p className="text-muted-foreground mt-1">בקרוב — ניהול עמודים מותאמים אישית</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📄</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">בקרוב</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                    ניהול עמודים מותאמים אישית יהיה זמין בגרסה הבאה.
                    כרגע ניתן לערוך את עמוד אודות ותכנים נוספים דרך הגדרות האתר.
                </p>
            </div>
        </div>
    );
}
