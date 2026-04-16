"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
    Loader2, 
    Plus, 
    Trash2, 
    Save, 
    FileText, 
    HelpCircle, 
    ChevronUp, 
    ChevronDown, 
    Type, 
    Image as ImageIcon, 
    AlertTriangle,
    AlignLeft
} from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageBlock, PageData, BlockType } from "@/types/cms";
import { cn } from "@/lib/utils";

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

interface BlockEditorProps {
    blocks: PageBlock[];
    onChange: (blocks: PageBlock[]) => void;
}

function BlockEditor({ blocks, onChange }: BlockEditorProps) {
    const addBlock = (type: BlockType) => {
        const newBlock: PageBlock = {
            id: generateId(),
            type,
            content: "",
            level: 2,
            variant: "info",
            question: "",
            answer: ""
        };
        onChange([...blocks, newBlock]);
    };

    const removeBlock = (id: string) => {
        onChange(blocks.filter(b => b.id !== id));
    };

    const updateBlock = (id: string, updates: Partial<PageBlock>) => {
        onChange(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        const newBlocks = [...blocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
        
        [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
        onChange(newBlocks);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Button variant="secondary" size="sm" onClick={() => addBlock('heading')} className="bg-white border-slate-200">
                    <Type className="w-4 h-4 ml-2" /> כותרת
                </Button>
                <Button variant="secondary" size="sm" onClick={() => addBlock('paragraph')} className="bg-white border-slate-200">
                    <AlignLeft className="w-4 h-4 ml-2" /> פסקה
                </Button>
                <Button variant="secondary" size="sm" onClick={() => addBlock('image')} className="bg-white border-slate-200">
                    <ImageIcon className="w-4 h-4 ml-2" /> תמונה
                </Button>
                <Button variant="secondary" size="sm" onClick={() => addBlock('alert')} className="bg-white border-slate-200">
                    <AlertTriangle className="w-4 h-4 ml-2" /> תיבת התרעה
                </Button>
                <Button variant="secondary" size="sm" onClick={() => addBlock('faq_item')} className="bg-white border-slate-200">
                    <HelpCircle className="w-4 h-4 ml-2" /> שאלה ותשובה
                </Button>
            </div>

            <div className="space-y-4">
                {blocks.map((block, index) => (
                    <div key={block.id} className="relative group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-[#AADB56] transition-all">
                        {/* Block Toolbar */}
                        <div className="absolute left-2 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur shadow-sm" onClick={() => moveBlock(index, 'up')} disabled={index === 0}>
                                <ChevronUp className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur shadow-sm" onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1}>
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-red-50 text-red-600 shadow-sm hover:bg-red-600 hover:text-white" onClick={() => removeBlock(block.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="p-6 pt-10">
                            {block.type === 'heading' && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4">
                                        <select 
                                            value={block.level} 
                                            onChange={(e) => updateBlock(block.id, { level: Number(e.target.value) as any })}
                                            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold"
                                        >
                                            <option value={2}>כותרת ראשית (H2)</option>
                                            <option value={3}>כותרת משנה (H3)</option>
                                        </select>
                                    </div>
                                    <Input 
                                        value={block.content} 
                                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                        placeholder="הכנס כותרת..."
                                        className="text-xl font-black border-none px-0 focus-visible:ring-0 shadow-none h-auto bg-transparent"
                                    />
                                </div>
                            )}

                            {block.type === 'paragraph' && (
                                <Textarea 
                                    value={block.content} 
                                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                    placeholder="כתוב כאן את התוכן של הפסקה..."
                                    className="min-h-[120px] text-lg font-medium border-none px-0 focus-visible:ring-0 shadow-none bg-transparent resize-none"
                                />
                            )}

                            {block.type === 'image' && (
                                <div className="space-y-4">
                                    <ImageUpload 
                                        value={block.url || ""} 
                                        onChange={(url) => updateBlock(block.id, { url })}
                                        folder="public"
                                    />
                                    <Input 
                                        value={block.caption} 
                                        onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                                        placeholder="כיתוב מתחת לתמונה (אופציונלי)"
                                        className="h-10 bg-slate-50 border-slate-100"
                                    />
                                </div>
                            )}

                            {block.type === 'alert' && (
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        {(['info', 'warning', 'danger', 'success'] as const).map(v => (
                                            <button 
                                                key={v}
                                                onClick={() => updateBlock(block.id, { variant: v })}
                                                className={cn(
                                                    "px-3 py-1 rounded-full text-xs font-bold capitalize transition-all border",
                                                    block.variant === v ? "bg-slate-800 text-white scale-105" : "bg-white text-slate-600 border-slate-200"
                                                )}
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                    <Textarea 
                                        value={block.content} 
                                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                        placeholder="תוכן תיבת ההתראה..."
                                        className="min-h-[80px] font-bold border-dashed border-2 bg-slate-50/50"
                                    />
                                </div>
                            )}

                            {block.type === 'faq_item' && (
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 block">שאלה</label>
                                        <Input 
                                            value={block.question} 
                                            onChange={(e) => updateBlock(block.id, { question: e.target.value })}
                                            placeholder="הכנס את השאלה..."
                                            className="font-bold h-12"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 block">תשובה</label>
                                        <Textarea 
                                            value={block.answer} 
                                            onChange={(e) => updateBlock(block.id, { answer: e.target.value })}
                                            placeholder="הכנס את התשובה..."
                                            className="min-h-[80px] font-medium"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {blocks.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold">העמוד ריק. הוסף בלוק למעלה כדי להתחיל.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminPagesPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Page states
    const [pages, setPages] = useState<Record<string, PageData>>({
        faq: { title: "שאלות נפוצות", blocks: [] },
        kosher: { title: "כשרות", blocks: [] },
        terms: { title: "תקנון האתר", blocks: [] },
        accessibility: { title: "הצהרת נגישות", blocks: [] }
    });

    const fetchPageData = useCallback(async () => {
        setLoading(true);
        try {
            const keys = ["page_faq", "page_kosher", "page_terms", "page_accessibility"];
            const { data } = await supabase
                .from("site_settings")
                .select("key, value")
                .in("key", keys);

            if (data) {
                const newPages = { ...pages };
                data.forEach(item => {
                    const pageKey = item.key.replace("page_", "");
                    let value = item.value as any;

                    // Support Migration from old format
                    if (Array.isArray(value) && pageKey === 'faq') {
                        // Migrate FAQItem[] to PageBlock[]
                        value = {
                            title: "שאלות נפוצות",
                            blocks: value.map((f: any) => ({
                                id: generateId(),
                                type: 'faq_item',
                                question: f.question,
                                answer: f.answer
                            }))
                        };
                    } else if (value && !value.blocks && pageKey === 'kosher') {
                        // Migrate KosherData to PageData
                        value = {
                            title: "כשרות",
                            blocks: [
                                { id: generateId(), type: 'heading', level: 2, content: value.title || "כשרות והשגחה" },
                                { id: generateId(), type: 'paragraph', content: value.text || "" },
                                { id: generateId(), type: 'image', url: value.certificate_url || "", caption: "תעודת כשרות" }
                            ]
                        };
                    }

                    if (value && value.blocks) {
                        newPages[pageKey] = value as PageData;
                    }
                });
                setPages(newPages);
            }
        } catch (err) {
            console.error("Error fetching pages:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPageData();
    }, [fetchPageData]);

    const savePage = async (key: string) => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from("site_settings")
                .upsert({ 
                    key: `page_${key}`, 
                    value: pages[key] as any 
                }, { onConflict: 'key' });

            if (error) throw error;
            toast.success(`${pages[key].title} נשמר בהצלחה`);
        } catch (error: any) {
            toast.error(`שגיאה בשמירה: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20 px-4 md:px-0" dir="rtl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#112a1e] tracking-tight">ניהול עמודי תוכן</h1>
                    <p className="text-slate-500 mt-2 font-bold">ערוך את התוכן הדינמי של העמודים הסטטיים באתר.</p>
                </div>
            </div>

            <Tabs defaultValue="faq" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto md:h-14 bg-slate-100 rounded-2xl mb-8 p-1 gap-1">
                    <TabsTrigger value="faq" className="rounded-xl text-sm font-black data-[state=active]:bg-white data-[state=active]:shadow text-slate-500 py-3"><HelpCircle className="w-4 h-4 ml-2" /> שאלות נפוצות</TabsTrigger>
                    <TabsTrigger value="kosher" className="rounded-xl text-sm font-black data-[state=active]:bg-white data-[state=active]:shadow text-slate-500 py-3"><FileText className="w-4 h-4 ml-2" /> כשרות</TabsTrigger>
                    <TabsTrigger value="terms" className="rounded-xl text-sm font-black data-[state=active]:bg-white data-[state=active]:shadow text-slate-500 py-3"><FileText className="w-4 h-4 ml-2" /> תקנון</TabsTrigger>
                    <TabsTrigger value="accessibility" className="rounded-xl text-sm font-black data-[state=active]:bg-white data-[state=active]:shadow text-slate-500 py-3"><ImageIcon className="w-4 h-4 ml-2" /> נגישות</TabsTrigger>
                </TabsList>

                {(Object.keys(pages)).map((key) => (
                    <TabsContent key={key} value={key} className="mt-0 focus-visible:ring-0">
                        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
                                <div>
                                    <h2 className="text-2xl font-black text-[#112a1e]">{pages[key].title}</h2>
                                    <p className="text-slate-400 font-bold mt-1">נהל את התוכן של עמוד ה{pages[key].title}.</p>
                                </div>
                                <Button onClick={() => savePage(key)} disabled={saving} className="h-12 px-8 rounded-xl font-black bg-[#112a1e] hover:bg-black text-white shadow-xl transition-all active:scale-[0.98]">
                                    {saving ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
                                    שמור עמוד
                                </Button>
                            </div>

                            <BlockEditor 
                                blocks={pages[key].blocks} 
                                onChange={(blocks) => setPages({
                                    ...pages,
                                    [key]: { ...pages[key], blocks }
                                })}
                            />
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
