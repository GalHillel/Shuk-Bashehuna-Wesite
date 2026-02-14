export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    price: number
                    unit_type: 'kg' | 'unit' | 'pack'
                    stock_quantity: number
                    image_url: string | null
                    category_id: string | null
                    is_active: boolean
                    is_on_sale: boolean
                    sale_price: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    price: number
                    unit_type: 'kg' | 'unit' | 'pack'
                    stock_quantity?: number
                    image_url?: string | null
                    category_id?: string | null
                    is_active?: boolean
                    is_on_sale?: boolean
                    sale_price?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    price?: number
                    unit_type?: 'kg' | 'unit' | 'pack'
                    stock_quantity?: number
                    image_url?: string | null
                    category_id?: string | null
                    is_active?: boolean
                    is_on_sale?: boolean
                    sale_price?: number | null
                    created_at?: string
                }
                Relationships: [{
                    foreignKeyName: "products_category_id_fkey"
                    columns: ["category_id"]
                    referencedRelation: "categories"
                    referencedColumns: ["id"]
                }]
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    image_url: string | null
                    sort_order: number
                    is_visible: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    image_url?: string | null
                    sort_order?: number
                    is_visible?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    image_url?: string | null
                    sort_order?: number
                    is_visible?: boolean
                    created_at?: string
                }
                Relationships: []
            }
            orders: {
                Row: {
                    id: string
                    user_id: string | null
                    customer_name: string | null
                    customer_phone: string | null
                    status: 'pending' | 'paid' | 'preparing' | 'shipping' | 'completed' | 'cancelled'
                    total_price_estimated: number
                    total_price_final: number | null
                    delivery_slot_start: string | null
                    delivery_slot_end: string | null
                    shipping_address: Json
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    customer_name?: string | null
                    customer_phone?: string | null
                    status?: 'pending' | 'paid' | 'preparing' | 'shipping' | 'completed' | 'cancelled'
                    total_price_estimated: number
                    total_price_final?: number | null
                    delivery_slot_start?: string | null
                    delivery_slot_end?: string | null
                    shipping_address: Json
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    customer_name?: string | null
                    customer_phone?: string | null
                    status?: 'pending' | 'paid' | 'preparing' | 'shipping' | 'completed' | 'cancelled'
                    total_price_estimated?: number
                    total_price_final?: number | null
                    delivery_slot_start?: string | null
                    delivery_slot_end?: string | null
                    shipping_address?: Json
                    notes?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            content_blocks: {
                Row: {
                    id: number
                    type: "hero_slider" | "category_grid" | "product_carousel" | "text_banner" | "banners_grid"
                    title: string | null
                    data: Json
                    sort_order: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: number
                    type: "hero_slider" | "category_grid" | "product_carousel" | "text_banner" | "banners_grid"
                    title?: string | null
                    data?: Json
                    sort_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: number
                    type?: "hero_slider" | "category_grid" | "product_carousel" | "text_banner" | "banners_grid"
                    title?: string | null
                    data?: Json
                    sort_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            site_settings: {
                Row: {
                    id: number
                    key: string
                    value: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: number
                    key: string
                    value: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: number
                    key?: string
                    value?: Json
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    product_id: string
                    quantity_ordered: number
                    quantity_actual: number | null
                    price_at_order: number
                    total_item_price: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    product_id: string
                    quantity_ordered: number
                    quantity_actual?: number | null
                    price_at_order: number
                    total_item_price?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    product_id?: string
                    quantity_ordered?: number
                    quantity_actual?: number | null
                    price_at_order?: number
                    total_item_price?: number | null
                    created_at?: string
                }
                Relationships: [{
                    foreignKeyName: "order_items_order_id_fkey"
                    columns: ["order_id"]
                    referencedRelation: "orders"
                    referencedColumns: ["id"]
                }, {
                    foreignKeyName: "order_items_product_id_fkey"
                    columns: ["product_id"]
                    referencedRelation: "products"
                    referencedColumns: ["id"]
                }]
            }
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    phone: string | null
                    default_address: Json | null
                    is_admin: boolean
                    created_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    phone?: string | null
                    default_address?: Json | null
                    is_admin?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    phone?: string | null
                    default_address?: Json | null
                    is_admin?: boolean
                    created_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type ContentBlock = Database['public']['Tables']['content_blocks']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type SiteSetting = Database['public']['Tables']['site_settings']['Row'];
