export function generateSlug(name: string): string {
    return name
        .trim()
        .toLowerCase() // Handles English keys
        .replace(/["']/g, "") // Remove quotes/apostrophes completely (ג'ריס -> גריס)
        .replace(/&/g, "-and-") // Replace & with text
        .replace(/\s+/g, "-") // Convert spaces to dashes
        // REGEX EXPLANATION:
        // Keep: English (\w), Hebrew (\u0590-\u05FF), Numbers, and Hyphens.
        // Remove: Everything else (parentheses, !, ?, etc).
        .replace(/[^\w\u0590-\u05FF\-]+/g, "")
        .replace(/\-\-+/g, "-") // Collapse multiple dashes (apple--red -> apple-red)
        .replace(/^-+/, "") // Remove leading dash
        .replace(/-+$/, ""); // Remove trailing dash
}
