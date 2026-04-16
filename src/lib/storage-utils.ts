import { createClient } from "@/lib/supabase/client";

/**
 * Deletes an image from Supabase Storage given its full public URL.
 * Assumes the URL follows the standard Supabase Storage pattern:
 * .../storage/v1/object/public/[bucket]/[path]
 */
export async function deleteImageFromStorage(imageUrl: string): Promise<boolean> {
    if (!imageUrl) return true;

    try {
        const supabase = createClient();

        const url = new URL(imageUrl, window.location.origin);
        const pathParts = url.pathname.split('/storage/v1/object/public/');

        if (pathParts.length < 2) {
            console.warn("Could not parse storage URL:", imageUrl);
            return true; // Consider it "deleted" if we can't parse it (invalid URL)
        }

        const fullPath = pathParts[1];
        const firstSlashIndex = fullPath.indexOf('/');

        if (firstSlashIndex === -1) {
            console.warn("Could not extract bucket from path:", fullPath);
            return true;
        }

        const bucket = fullPath.substring(0, firstSlashIndex);
        const filePath = fullPath.substring(firstSlashIndex + 1);

        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            console.error("Error deleting image from storage:", error);
            // If the error is 'Object not found', we consider it a success
            if ((error as any).status === 404 || (error as any).message?.includes('not found')) {
                return true;
            }
            return false;
        }

        return true;
    } catch (err) {
        console.error("Exception processing image deletion:", err);
        return false;
    }
}
