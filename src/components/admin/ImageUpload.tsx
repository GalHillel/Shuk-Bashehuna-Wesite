"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";

import { ImageCropper } from "./ImageCropper";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    bucket?: string;
    folder?: string;
    cropAspect?: number;
}

export function ImageUpload({
    value,
    onChange,
    bucket = "product-images",
    folder = "uploads",
    cropAspect,
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const [cropperOpen, setCropperOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);

    const uploadFile = useCallback(
        async (file: File | Blob) => {
            setError("");
            setUploading(true);

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError("גודל הקובץ לא יכול לעלות על 5MB");
                setUploading(false);
                return;
            }

            // Validate file type (only if it's a File object, Blobs might vary)
            if (file instanceof File && !file.type.startsWith("image/")) {
                setError("ניתן להעלות תמונות בלבד");
                setUploading(false);
                return;
            }

            // Generate unique filename
            const ext = file instanceof File ? (file.name.split(".").pop() || "jpg") : "png";
            const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: false,
                    contentType: file.type || 'image/png'
                });

            if (uploadError) {
                setError("שגיאה בהעלאה: " + uploadError.message);
                setUploading(false);
                return;
            }

            // Get public URL
            const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
            onChange(data.publicUrl);
            setUploading(false);
            setCropperOpen(false);
            setImageToCrop(null);
        },
        [supabase, bucket, folder, onChange]
    );

    function handleFileSelect(file: File) {
        if (cropAspect) {
            // Read file as data URL for cropper
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImageToCrop(reader.result?.toString() || null);
                setCropperOpen(true);
            });
            reader.readAsDataURL(file);
        } else {
            uploadFile(file);
        }
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
            // Reset input so same file can be selected again if needed
            e.target.value = "";
        }
    }

    function removeImage() {
        onChange("");
    }

    return (
        <div className="space-y-2">
            {value ? (
                /* Preview */
                <div className="relative group rounded-xl overflow-hidden border-2 border-green-200 bg-green-50">
                    <div className="relative w-full aspect-square max-h-[250px]">
                        <Image
                            src={value}
                            alt="תצוגה מקדימה"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent py-3 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-white text-xs font-medium hover:underline"
                        >
                            החלף תמונה
                        </button>
                    </div>
                </div>
            ) : (
                /* Upload zone */
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                        ${dragOver
                            ? "border-green-500 bg-green-50 scale-[1.02]"
                            : "border-gray-300 hover:border-green-400 hover:bg-green-50/50"
                        }
                    `}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-3 py-4">
                            <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
                            <p className="text-sm text-green-700 font-medium">מעלה תמונה...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3 py-4">
                            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                                {dragOver ? (
                                    <Upload className="h-7 w-7 text-green-600" />
                                ) : (
                                    <ImageIcon className="h-7 w-7 text-green-600" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-700">
                                    {dragOver ? "שחרר כאן" : "גרור תמונה או לחץ לבחירה"}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    JPG, PNG, WebP — עד 5MB
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Cropper Modal */}
            <ImageCropper
                open={cropperOpen}
                onClose={() => setCropperOpen(false)}
                imageSrc={imageToCrop}
                aspect={cropAspect}
                onCropComplete={(blob) => uploadFile(blob)}
            />
        </div>
    );
}
