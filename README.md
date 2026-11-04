# K Gaming F&B Ordering System 🎮🍜

A lightweight, high-performance web-based F&B ordering system built specifically for **K Gaming** (PS Rental). Customers scan a secure table QR code to open a mobile-friendly menu web app, customize items with notes, and seamlessly checkout via WhatsApp. Staff manage live inventory and stock availability through a protected admin dashboard.

---

## ✨ Key Features

1. **Secure QR Code Table Routing**
   - Access restricted to authorized table IDs (`REG-1` through `REG-5`, `VIP-1A`, `VIP-1B`, `VIP-2`) to prevent prank orders.
2. **Clean Matte Dark UX (Mobile-First)**
   - Designed for dimmed rental rooms with smooth transition animations, horizontal category tabs (Makanan | Minuman | Snack), and auto-sorted popular items.
3. **Floating Cart & Special Requests**
   - Instant cart updates with free-text notes for custom customer requests (e.g., *"Es nya dikit, mi nya jangan terlalu matang"*).
4. **Instant WhatsApp Checkout**
   - Automatically compiles clean, structured order texts containing the exact table number, item list, and total pricing sent directly to the admin WhatsApp (`6282152425391`).
5. **Real-Time Admin Dashboard & PWA Shortcut**
   - Full CRUD product management, image uploads, and 1-click **Sold Out** toggle. Installable on staff mobile devices as a native-like PWA shortcut.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ (App Router) / React
- **Styling & Motion:** Tailwind CSS
- **Database & Storage:** Supabase (Piggybacked onto existing K Gaming booking database via prefixed tables)
- **Deployment:** Vercel

---

## 🚀 Quick Setup & Deployment

### 1. Database Migration
Run the contents of `supabase_schema.sql` inside your Supabase project's **SQL Editor** to provision `menu_categories` and `menu_products`.

### 2. Environment Variables
Configure your Vercel project with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Generate Table QR Codes
Generate QR codes pointing to your deployed domain with the table parameter:
- `https://your-domain.vercel.app/?table=REG-1`
- `https://your-domain.vercel.app/?table=VIP-1A`
