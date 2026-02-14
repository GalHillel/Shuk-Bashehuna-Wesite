"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Leaf, Truck, Heart, Phone, Star, Shield, Zap, Coffee, Award, Gift } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, GripVertical } from "lucide-react";

const AVAILABLE_ICONS = [
    { label: "עלה (Leaf)", value: "Leaf", icon: Leaf },
    { label: "משאית (Truck)", value: "Truck", icon: Truck },
    { label: "לב (Heart)", value: "Heart", icon: Heart },
    { label: "טלפון (Phone)", value: "Phone", icon: Phone },
    { label: "כוכב (Star)", value: "Star", icon: Star },
    { label: "מגן (Shield)", value: "Shield", icon: Shield },
    { label: "ברק (Zap)", value: "Zap", icon: Zap },
    { label: "קפה (Coffee)", value: "Coffee", icon: Coffee },
    { label: "פרס (Award)", value: "Award", icon: Award },
    { label: "מתנה (Gift)", value: "Gift", icon: Gift },
];

const AVAILABLE_COLORS = [
    { label: "ירוק", value: "text-green-600 bg-green-50" },
    { label: "כחול", value: "text-blue-600 bg-blue-50" },
    { label: "אדום", value: "text-red-600 bg-red-50" },
    { label: "סגול", value: "text-purple-600 bg-purple-50" },
    { label: "צהוב", value: "text-yellow-600 bg-yellow-50" },
    { label: "כתום", value: "text-orange-600 bg-orange-50" },
    { label: "אפור", value: "text-slate-600 bg-slate-50" },
];

interface Feature {
    title: string;
    desc: string;
    icon: string;
    color: string;
}

interface FeaturesJSONEditorProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (value: any) => void;
}

export function FeaturesJSONEditor({ value, onChange }: FeaturesJSONEditorProps) {
    const [features, setFeatures] = useState<Feature[]>([]);

    useEffect(() => {
        if (value) {
            try {
                // If it's already an array, use it. If it's a JSON string, parse it.
                // Supabase might return it as a JSON object/array directly.
                const parsed = typeof value === "string" ? JSON.parse(value) : value;
                if (Array.isArray(parsed)) {
                    setFeatures(parsed);
                }
            } catch (e) {
                console.error("Failed to parse features JSON", e);
            }
        } else {
            // Default value if empty
            setFeatures([
                {
                    title: "טריות ללא פשרות",
                    desc: "כל המוצרים נקטפים ומגיעים טריים ישירות מהשדה אליכם הביתה",
                    icon: "Leaf",
                    color: "text-green-600 bg-green-50"
                }
            ]);
        }
    }, [value]);

    const updateFeatures = (newFeatures: Feature[]) => {
        setFeatures(newFeatures);
        onChange(newFeatures);
    };

    const addFeature = () => {
        updateFeatures([
            ...features,
            { title: "כותרת חדשה", desc: "תיאור...", icon: "Star", color: "text-slate-600 bg-slate-50" }
        ]);
    };

    const removeFeature = (index: number) => {
        const newFeatures = [...features];
        newFeatures.splice(index, 1);
        updateFeatures(newFeatures);
    };

    const updateFeatureField = (index: number, field: keyof Feature, newValue: string) => {
        const newFeatures = [...features];
        newFeatures[index] = { ...newFeatures[index], [field]: newValue };
        updateFeatures(newFeatures);
    };

    return (
        <div className="space-y-4">
            {features.map((feature, index) => (
                <Card key={index} className="relative group">
                    <CardContent className="p-4 space-y-3">
                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" onClick={() => removeFeature(index)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                            {/* Title */}
                            <div>
                                <label className="text-xs font-semibold mb-1 block">כותרת</label>
                                <Input
                                    value={feature.title}
                                    onChange={(e) => updateFeatureField(index, "title", e.target.value)}
                                    placeholder="כותרת"
                                />
                            </div>

                            {/* Icon Select */}
                            <div>
                                <label className="text-xs font-semibold mb-1 block">אייקון</label>
                                <Select
                                    value={feature.icon}
                                    onValueChange={(val) => updateFeatureField(index, "icon", val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {AVAILABLE_ICONS.map((icon) => (
                                            <SelectItem key={icon.value} value={icon.value}>
                                                <div className="flex items-center gap-2">
                                                    <icon.icon className="h-4 w-4" />
                                                    {icon.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-xs font-semibold mb-1 block">תיאור</label>
                            <Textarea
                                value={feature.desc}
                                onChange={(e) => updateFeatureField(index, "desc", e.target.value)}
                                placeholder="תיאור..."
                                className="min-h-[60px]"
                            />
                        </div>

                        {/* Color Select */}
                        <div>
                            <label className="text-xs font-semibold mb-1 block">צבע רקע ואייקון</label>
                            <Select
                                value={feature.color}
                                onValueChange={(val) => updateFeatureField(index, "color", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {AVAILABLE_COLORS.map((col) => {
                                        // Extract partial class for preview if needed, or just show label
                                        return (
                                            <SelectItem key={col.value} value={col.value}>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-4 h-4 rounded-full ${col.value.split(' ')[1]}`}></div>
                                                    {col.label}
                                                </div>
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Button onClick={addFeature} variant="outline" className="w-full border-dashed">
                <Plus className="h-4 w-4 mr-2" />
                הוסף אריח חדש
            </Button>
        </div>
    );
}
