import { createClient } from "@/lib/supabase/client";

/**
 * Deletes an image from Supabase Storage given its full public URL.
 * Assumes the URL follows the standard Supabase Storage pattern:
 * .../storage/v1/object/public/[bucket]/[path]
 */
export async function deleteImageFromStorage(imageUrl: string) {
    if (!imageUrl) return;

    try {
        const supabase = createClient();

        // typical pattern: https://[project].supabase.co/storage/v1/object/public/[bucket]/[folder]/[filename]
        // or relative: /storage/v1/object/public/[bucket]/[folder]/[filename]

        const url = new URL(imageUrl, window.location.origin);
        const pathParts = url.pathname.split('/storage/v1/object/public/');

        if (pathParts.length < 2) {
            console.warn("Could not parse storage URL:", imageUrl);
            return;
        }

        const fullPath = pathParts[1]; // e.g., "product-images/uploads/filename.jpg"
        const firstSlashIndex = fullPath.indexOf('/');

        if (firstSlashIndex === -1) {
            console.warn("Could not extract bucket from path:", fullPath);
            return;
        }

        const bucket = fullPath.substring(0, firstSlashIndex);
        const filePath = fullPath.substring(firstSlashIndex + 1);



        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            console.error("Error deleting image from storage:", error);
        } else {
            // Image deleted successfully
        }

    } catch (err) {
        console.error("Exception processing image deletion:", err);
    }
}
