-- =====================================================
-- K GAMING F&B ORDERING SYSTEM - SUPABASE SCHEMA MIGRATION
-- Jalankan script ini di SQL Editor Supabase project K Gaming Booking
-- =====================================================

-- 1. Tabel Kategori Menu (Makanan, Minuman, Snack)
CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed kategori default
INSERT INTO menu_categories (id, name, order_index) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Makanan', 1),
    ('00000000-0000-0000-0000-000000000002', 'Minuman', 2),
    ('00000000-0000-0000-0000-000000000003', 'Snack', 3)
ON CONFLICT (id) DO NOTHING;

-- 2. Tabel Produk Menu F&B
CREATE TABLE IF NOT EXISTS menu_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    sold_count INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    emoji TEXT DEFAULT '🍽️',
    tint TEXT DEFAULT '#E6E9F5',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index untuk performa sorting popularitas & filter kategori
CREATE INDEX IF NOT EXISTS idx_menu_products_category ON menu_products(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_products_sold ON menu_products(sold_count DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_products ENABLE ROW LEVEL SECURITY;

-- Public read access (pelanggan bisa lihat menu)
CREATE POLICY "Public read categories" ON menu_categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON menu_products FOR SELECT USING (true);

-- Admin write access (staff bisa insert/update/delete menu)
CREATE POLICY "Admin all categories" ON menu_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin all products" ON menu_products FOR ALL USING (true) WITH CHECK (true);
