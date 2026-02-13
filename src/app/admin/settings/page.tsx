"use client";

import { supabase } from "@/lib/supabase/client";
import { SiteSetting, Json } from "@/types/supabase";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";

interface SettingsData {
    announcement_bar: {
        text: string;
        is_active: boolean;
    };
    contact_info: {
        phone: string;
        email: string;
        address: string;
    };
    about_page: {
        title: string;
        content: string;
    };
    delivery_info: {
        min_order: number;
        free_delivery_above: number;
        delivery_fee: number;
    };
}

const DEFAULT_SETTINGS: SettingsData = {
    announcement_bar: { text: "משלוח חינם בקנייה מעל 300 ₪ 🚚", is_active: true },
    contact_info: { phone: "03-1234567", email: "hello@shuk-bashehuna.co.il", address: "" },
    about_page: { title: "שוק בשכונה", content: "" },
    delivery_info: { min_order: 50, free_delivery_above: 300, delivery_fee: 25 },
};

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from("site_settings").select("*");
        if (data) {
            const settingsMap: Record<string, unknown> = {};
            (data as SiteSetting[]).forEach((s) => {
                settingsMap[s.key] = s.value;
            });
            setSettings({
                announcement_bar: (settingsMap.announcement_bar as SettingsData["announcement_bar"]) || DEFAULT_SETTINGS.announcement_bar,
                contact_info: (settingsMap.contact_info as SettingsData["contact_info"]) || DEFAULT_SETTINGS.contact_info,
                about_page: (settingsMap.about_page as SettingsData["about_page"]) || DEFAULT_SETTINGS.about_page,
                delivery_info: (settingsMap.delivery_info as SettingsData["delivery_info"]) || DEFAULT_SETTINGS.delivery_info,
            });
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);


    async function saveAll() {
        setSaving(true);
        const entries = Object.entries(settings);
        await Promise.all(
            entries.map(([key, value]) =>
                supabase.from("site_settings").upsert({
                    key,
                    value: value as unknown as Json,
                    updated_at: new Date().toISOString(),
                }, { onConflict: "key" })
            )
        );
        setSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-3xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">הגדרות אתר</h1>
                    <p className="text-muted-foreground mt-1">ניהול הגדרות כלליות של האתר</p>
                </div>
                <Button onClick={saveAll} disabled={saving}>
                    {saving ? <Loader2 className="animate-spin ml-2 h-4 w-4" /> : <Save className="ml-2 h-4 w-4" />}
                    שמור הכל
                </Button>
            </div>

            {saveSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                    ✅ ההגדרות נשמרו בהצלחה
                </div>
            )}

            {/* Announcement Bar */}
            <section className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                <h2 className="text-lg font-bold">שורת הודעות</h2>
                <div className="flex items-center gap-4">
                    <Switch
                        checked={settings.announcement_bar.is_active}
                        onCheckedChange={(checked) =>
                            setSettings((prev) => ({
                                ...prev,
                                announcement_bar: { ...prev.announcement_bar, is_active: checked },
                            }))
                        }
                    />
                    <Label>הצג שורת הודעות</Label>
                </div>
                <Input
                    value={settings.announcement_bar.text}
                    onChange={(e) =>
                        setSettings((prev) => ({
                            ...prev,
                            announcement_bar: { ...prev.announcement_bar, text: e.target.value },
                        }))
                    }
                    placeholder="טקסט ההודעה..."
                    className="h-12"
                />
            </section>

            {/* Contact Info */}
            <section className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                <h2 className="text-lg font-bold">פרטי יצירת קשר</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label className="text-sm font-medium mb-2 block">טלפון</Label>
                        <Input
                            value={settings.contact_info.phone}
                            onChange={(e) =>
                                setSettings((prev) => ({
                                    ...prev,
                                    contact_info: { ...prev.contact_info, phone: e.target.value },
                                }))
                            }
                            className="h-12"
                            dir="ltr"
                        />
                    </div>
                    <div>
                        <Label className="text-sm font-medium mb-2 block">אימייל</Label>
                        <Input
                            value={settings.contact_info.email}
                            onChange={(e) =>
                                setSettings((prev) => ({
                                    ...prev,
                                    contact_info: { ...prev.contact_info, email: e.target.value },
                                }))
                            }
                            className="h-12"
                            dir="ltr"
                        />
                    </div>
                </div>
                <div>
                    <Label className="text-sm font-medium mb-2 block">כתובת</Label>
                    <Input
                        value={settings.contact_info.address}
                        onChange={(e) =>
                            setSettings((prev) => ({
                                ...prev,
                                contact_info: { ...prev.contact_info, address: e.target.value },
                            }))
                        }
                        className="h-12"
                    />
                </div>
            </section>

            {/* About Page */}
            <section className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                <h2 className="text-lg font-bold">עמוד אודות</h2>
                <div>
                    <Label className="text-sm font-medium mb-2 block">כותרת</Label>
                    <Input
                        value={settings.about_page.title}
                        onChange={(e) =>
                            setSettings((prev) => ({
                                ...prev,
                                about_page: { ...prev.about_page, title: e.target.value },
                            }))
                        }
                        className="h-12"
                    />
                </div>
                <div>
                    <Label className="text-sm font-medium mb-2 block">תוכן (עברית)</Label>
                    <Textarea
                        value={settings.about_page.content}
                        onChange={(e) =>
                            setSettings((prev) => ({
                                ...prev,
                                about_page: { ...prev.about_page, content: e.target.value },
                            }))
                        }
                        className="min-h-[200px]"
                        placeholder="ספרו על עצמכם, על החזון, על המוצרים..."
                    />
                </div>
            </section>

            {/* Delivery Settings */}
            <section className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                <h2 className="text-lg font-bold">הגדרות משלוח</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label className="text-sm font-medium mb-2 block">מינימום הזמנה (₪)</Label>
                        <Input
                            type="number"
                            value={settings.delivery_info.min_order}
                            onChange={(e) =>
                                setSettings((prev) => ({
                                    ...prev,
                                    delivery_info: { ...prev.delivery_info, min_order: Number(e.target.value) },
                                }))
                            }
                            className="h-12"
                        />
                    </div>
                    <div>
                        <Label className="text-sm font-medium mb-2 block">חינם מעל (₪)</Label>
                        <Input
                            type="number"
                            value={settings.delivery_info.free_delivery_above}
                            onChange={(e) =>
                                setSettings((prev) => ({
                                    ...prev,
                                    delivery_info: { ...prev.delivery_info, free_delivery_above: Number(e.target.value) },
                                }))
                            }
                            className="h-12"
                        />
                    </div>
                    <div>
                        <Label className="text-sm font-medium mb-2 block">עלות משלוח (₪)</Label>
                        <Input
                            type="number"
                            value={settings.delivery_info.delivery_fee}
                            onChange={(e) =>
                                setSettings((prev) => ({
                                    ...prev,
                                    delivery_info: { ...prev.delivery_info, delivery_fee: Number(e.target.value) },
                                }))
                            }
                            className="h-12"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
