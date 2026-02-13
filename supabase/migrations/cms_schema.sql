-- =====================================================
-- Shuk Bashehuna — Full Database Schema
-- Run this in Supabase SQL Editor to set up everything
-- =====================================================

-- 1. Profiles
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  phone text,
  default_address jsonb,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using ( true );
create policy "Users can insert their own profile." on public.profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile." on public.profiles for update using ( auth.uid() = id );


-- 2. Categories
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  image_url text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;
create policy "Categories are viewable by everyone." on public.categories for select using ( true );
create policy "Categories are manageable by admins." on public.categories for all using (
  exists ( select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true )
);


-- 3. Products
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  price numeric not null,
  unit_type text not null default 'unit' check (unit_type in ('kg', 'unit', 'pack')),
  stock_quantity integer not null default 0,
  image_url text,
  category_id uuid references public.categories(id) on delete set null,
  is_active boolean not null default true,
  is_on_sale boolean not null default false,
  sale_price numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;
create policy "Active products are viewable by everyone." on public.products for select using ( is_active = true );
create policy "Products are manageable by admins." on public.products for all using (
  exists ( select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true )
);


-- 4. Orders
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete set null,
  customer_name text,
  customer_phone text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'preparing', 'shipping', 'completed', 'cancelled')),
  total_price_estimated numeric not null,
  total_price_final numeric,
  delivery_slot_start timestamp with time zone,
  delivery_slot_end timestamp with time zone,
  shipping_address jsonb,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;
create policy "Users can view their own orders." on public.orders for select using ( auth.uid() = user_id );
create policy "Anyone can create orders (guest checkout)." on public.orders for insert with check ( true );
create policy "Admins can view all orders." on public.orders for select using (
  exists ( select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true )
);
create policy "Admins can update orders." on public.orders for update using (
  exists ( select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true )
);


-- 5. Order Items
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null not null,
  quantity_ordered numeric not null,
  quantity_actual numeric,
  price_at_order numeric not null,
  total_item_price numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.order_items enable row level security;
create policy "Order items follow order access." on public.order_items for select using (
  exists ( select 1 from public.orders where orders.id = order_id and orders.user_id = auth.uid() )
);
create policy "Anyone can insert order items." on public.order_items for insert with check ( true );
create policy "Admins can view all order items." on public.order_items for select using (
  exists ( select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true )
);


-- 6. Content Blocks (CMS)
do $$ begin
    create type content_block_type as enum ('hero_slider', 'category_grid', 'product_carousel', 'text_banner', 'banners_grid');
exception
    when duplicate_object then null;
end $$;

create table if not exists public.content_blocks (
  id bigint generated by default as identity primary key,
  type content_block_type not null,
  title text,
  data jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.content_blocks enable row level security;
create policy "Content blocks are viewable by everyone." on public.content_blocks for select using ( is_active = true );
create policy "Content blocks are manageable by admins." on public.content_blocks for all using (
  exists ( select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true )
);


-- 7. Site Settings
create table if not exists public.site_settings (
  id bigint generated by default as identity primary key,
  key text not null unique,
  value jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.site_settings enable row level security;
create policy "Public settings are viewable by everyone." on public.site_settings for select using ( true );
create policy "Settings are manageable by admins." on public.site_settings for all using (
  exists ( select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true )
);


-- =====================================================
-- Seed Data
-- =====================================================

-- Site Settings
insert into public.site_settings (key, value) values
('announcement_bar', '{"text": "משלוח חינם בקנייה מעל 300 ₪ 🚚", "is_active": true}'),
('contact_info', '{"phone": "03-1234567", "email": "hello@shuk-bashehuna.co.il", "address": "רחוב השוק 1, תל אביב"}'),
('about_page', '{"title": "שוק בשכונה", "content": "פירות וירקות טריים ישירות מהחקלאי"}'),
('delivery_info', '{"min_order": 50, "free_delivery_above": 300, "delivery_fee": 25}')
on conflict (key) do nothing;

-- Content Blocks
insert into public.content_blocks (type, title, sort_order, data) values
(
  'hero_slider', 'Main Hero', 10,
  '{"slides": [{"image_url": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80", "title": "הפירות הכי מתוקים העונה", "subtitle": "ישירות מהחקלאי אליכם לצלחת", "button_text": "הזמינו עכשיו", "link": "/category/fruits"}, {"image_url": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1600&auto=format&fit=crop&q=80", "title": "ירקות שורש למרקים", "subtitle": "חורף חם וטעים עם הירקות של שוק בשכונה", "button_text": "למתכוני חורף", "link": "/category/winter"}]}'
),
(
  'category_grid', NULL, 20, '{}'
),
(
  'product_carousel', 'המבצעים החמים 🔥', 30,
  '{"category_id": "specials", "limit": 10}'
),
(
  'banners_grid', 'Seasonal Banners', 40,
  '{"banners": [{"image_url": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80", "title": "עגבניות סופי", "link": "/product/tomato-maggie"}, {"image_url": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&auto=format&fit=crop&q=80", "title": "מחלבת בוטיק", "link": "/category/dairy-eggs"}]}'
),
(
  'product_carousel', 'ירקות טריים יום יום 🥬', 50,
  '{"category_id": "vegetables", "limit": 10}'
);

-- Sample Categories
insert into public.categories (name, slug, sort_order) values
('פירות', 'fruits', 10),
('ירקות', 'vegetables', 20),
('מוצרי חלב וביצים', 'dairy-eggs', 30),
('לחם ומאפים', 'bread-bakery', 40),
('תבלינים ועשבי תיבול', 'spices-herbs', 50)
on conflict (slug) do nothing;
