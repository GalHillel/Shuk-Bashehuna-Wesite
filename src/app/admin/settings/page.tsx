"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { FeaturesJSONEditor } from "@/components/admin/FeaturesJSONEditor";
import { toast } from "sonner";

export default function SettingsPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchSettings() {
            setLoading(true);
            const supabase = createClient();
            const { data } = await supabase.from("site_settings").select("*");
            if (data) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const settingsMap = data.reduce((acc, curr) => {
                    acc[curr.key] = curr.value;
                    return acc;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }, {} as any);
                setSettings(settingsMap);
            }
            setLoading(false);
        }
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const supabase = createClient();

        // Upsert each setting
        const updates = Object.entries(settings).map(([key, value]) => ({
            key,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value: value as any
        }));

        for (const update of updates) {
            await supabase.from("site_settings").upsert(update, { onConflict: "key" });
        }

        setSaving(false);
        toast.success("ההגדרות נשמרו בהצלחה");
    };

    const handleChange = (key: string, value: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setSettings((prev: any) => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6 max-w-5xl" dir="rtl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">הגדרות אתר</h1>
                    <p className="text-muted-foreground">ניהול תוכן האתר, פרטי עסק ורשתות חברתיות</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="gap-2 bg-slate-900">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? "שומר..." : "שמור שינויים"}
                </Button>
            </div>

            <Tabs defaultValue="general" dir="rtl" className="w-full">
                <TabsList className="bg-slate-100 p-1 rounded-2xl h-auto flex flex-wrap justify-start border border-slate-200 shadow-sm overflow-hidden mb-2">
                    <TabsTrigger value="general" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-[#112a1e] font-bold transition-all">כללי (Header)</TabsTrigger>
                    <TabsTrigger value="about" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-[#112a1e] font-bold transition-all">אודות (About)</TabsTrigger>
                    <TabsTrigger value="contact" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-[#112a1e] font-bold transition-all">יצירת קשר</TabsTrigger>
                </TabsList>

                {/* GENERAL / HEADER */}
                <TabsContent value="general" className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <Card className="rounded-[32px] overflow-hidden border-slate-100 shadow-xl shadow-slate-200/40">
                        <CardHeader className="bg-slate-50/50 pb-8 border-b border-slate-50">
                            <CardTitle className="text-xl font-black text-slate-800">הודעה עליונה (Top Bar)</CardTitle>
                            <CardDescription className="text-slate-500">הטקסט שמופיע בפס הירוק בראש האתר</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-black text-slate-700">הודעה ראשית (ימין)</label>
                                    <Input
                                        placeholder="משלוח חינם בקנייה מעל 300 ₪"
                                        value={settings.top_bar_right || ""}
                                        onChange={(e) => handleChange("top_bar_right", e.target.value)}
                                        className="h-14 rounded-2xl border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-[#AADB56] focus:border-[#AADB56] transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-black text-slate-700">הודעה משנית (שמאל)</label>
                                    <Input
                                        placeholder="הזמינו היום — קבלו מחר!"
                                        value={settings.top_bar_left || ""}
                                        onChange={(e) => handleChange("top_bar_left", e.target.value)}
                                        className="h-14 rounded-2xl border-slate-200 bg-slate-50/30 focus:bg-white focus:ring-[#AADB56] focus:border-[#AADB56] transition-all"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[32px] overflow-hidden border-slate-100 shadow-xl shadow-slate-200/40">
                        <CardHeader className="bg-slate-50/50 pb-8 border-b border-slate-50">
                            <CardTitle className="text-xl font-black text-slate-800">לוגו וכותרת ראשית</CardTitle>
                            <CardDescription className="text-slate-500">הטקסט והמיתוג שמופיעים ליד הלוגו</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <label className="text-sm font-black text-slate-700">לוגו האתר</label>
                                    <div className="max-w-[240px] p-2 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                        <ImageUpload
                                            value={settings.site_logo || ""}
                                            onChange={(url) => handleChange("site_logo", url)}
                                            bucket="banners"
                                            folder="branding"
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed bg-[#AADB56]/5 p-3 rounded-xl border border-[#AADB56]/10">💡 מומלץ: PNG שקוף או SVG. גודל אידיאלי: 240x80 פיקסלים למראה חד ונקי.</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-sm font-black text-slate-700">שם האתר</label>
                                        <Input
                                            placeholder="שוק בשכונה"
                                            value={settings.site_name || ""}
                                            onChange={(e) => handleChange("site_name", e.target.value)}
                                            className="h-14 rounded-2xl border-slate-200 bg-slate-50/30 focus:bg-white transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-black text-slate-700">סלוגן (מתחת לשם)</label>
                                        <Input
                                            placeholder="הכי טרי • הכי קרוב • הכי טעים"
                                            value={settings.site_slogan || ""}
                                            onChange={(e) => handleChange("site_slogan", e.target.value)}
                                            className="h-14 rounded-2xl border-slate-200 bg-slate-50/30 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CONTACT */}
                <TabsContent value="contact" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>פרטי יצירת קשר</CardTitle>
                            <CardDescription>מופיעים בכותרת התחתונה ובעמוד צור קשר</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">טלפון</label>
                                    <Input
                                        value={settings.contact_phone || ""}
                                        onChange={(e) => handleChange("contact_phone", e.target.value)}
                                        placeholder="050-1234567"
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">אימייל</label>
                                    <Input
                                        value={settings.contact_email || ""}
                                        onChange={(e) => handleChange("contact_email", e.target.value)}
                                        placeholder="hello@example.com"
                                        dir="ltr"
                                        className="text-right h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">כתובת</label>
                                    <Input
                                        value={settings.contact_address || ""}
                                        onChange={(e) => handleChange("contact_address", e.target.value)}
                                        placeholder="רחוב השוק 1, תל אביב"
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">שעות פעילות</label>
                                    <Input
                                        value={settings.hours_weekdays || ""}
                                        onChange={(e) => handleChange("hours_weekdays", e.target.value)}
                                        placeholder="08:00 - 20:00"
                                        className="h-11"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ABOUT PAGE */}
                <TabsContent value="about" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>תמונת נושא (Hero)</CardTitle>
                            <CardDescription>התמונה הראשית בראש עמוד אודות</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">תמונה ראשית</label>
                                <div className="max-w-md">
                                    <ImageUpload
                                        value={settings.about_hero_image || ""}
                                        onChange={(url) => handleChange("about_hero_image", url)}
                                        bucket="banners"
                                        folder="banners"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>הסיפור שלנו</CardTitle>
                            <CardDescription>הטקסט הראשי בעמוד אודות</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold">כותרת</label>
                                <Input
                                    value={settings.about_story_title || ""}
                                    onChange={(e) => handleChange("about_story_title", e.target.value)}
                                    placeholder="הסיפור שלנו"
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">תוכן (פסקה 1)</label>
                                <Textarea
                                    value={settings.about_story_p1 || ""}
                                    onChange={(e) => handleChange("about_story_p1", e.target.value)}
                                    className="min-h-[100px]"
                                    placeholder="פסקה ראשונה..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">תוכן (פסקה 2)</label>
                                <Textarea
                                    value={settings.about_story_p2 || ""}
                                    onChange={(e) => handleChange("about_story_p2", e.target.value)}
                                    className="min-h-[100px]"
                                    placeholder="פסקה שנייה..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>אריחי ערכים (Tiles)</CardTitle>
                            <CardDescription>ניהול האריחים עם האייקונים (כותרת, תיאור, אייקון)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FeaturesJSONEditor
                                value={settings.about_features || []}
                                onChange={(val) => handleChange("about_features", val)}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>ערכים וחזון (תמונה תחתונה)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold">תמונה משנית</label>
                                <div className="max-w-md">
                                    <ImageUpload
                                        value={settings.about_secondary_image || ""}
                                        onChange={(url) => handleChange("about_secondary_image", url)}
                                        bucket="banners"
                                        folder="banners"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">כותרת החזון</label>
                                <Input
                                    value={settings.about_vision_title || ""}
                                    onChange={(e) => handleChange("about_vision_title", e.target.value)}
                                    placeholder="בית לחקלאות ישראלית"
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">טקסט החזון</label>
                                <Textarea
                                    value={settings.about_vision_text || ""}
                                    onChange={(e) => handleChange("about_vision_text", e.target.value)}
                                    className="min-h-[100px]"
                                    placeholder="טקסט חזון..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
