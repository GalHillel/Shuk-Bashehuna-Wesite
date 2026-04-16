export type BlockType = 'heading' | 'paragraph' | 'image' | 'alert' | 'faq_item';

export interface PageBlock {
    id: string;
    type: BlockType;
    content?: string; // For heading, paragraph
    level?: 2 | 3 | 4; // For heading
    url?: string; // For image
    caption?: string; // For image
    variant?: 'info' | 'warning' | 'success' | 'danger'; // For alert
    question?: string; // For faq_item
    answer?: string; // For faq_item
}

export interface PageData {
    title: string;
    blocks: PageBlock[];
}
