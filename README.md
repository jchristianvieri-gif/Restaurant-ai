# 🍽️ GourmetAI - Restaurant Management System

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5-000000?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai)

**AI-Powered Restaurant Management dengan Full-Stack Modern**

</div>

## 📋 Daftar Isi

- [🚀 Untuk Developer (Install & Setup)](#-untuk-developer-install--setup)
- [👨‍💼 Untuk User (Cara Penggunaan)](#-untuk-user-cara-penggunaan)
- [🎯 Fitur Utama](#-fitur-utama)
- [🏗️ Arsitektur Sistem](#️-arsitektur-sistem)

## 🚀 Untuk Developer (Install & Setup)

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Akun Supabase (gratis)
- Akun OpenAI (opsional)

### Step 1: Clone & Install
```bash
git clone https://github.com/your-username/restaurant-ai.git
cd restaurant-ai
npm install
```

Step 2: Environment Setup

Buat file .env.local:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-key

# OpenAI (Opsional)
OPENAI_API_KEY=sk-your-openai-api-key

# Midtrans (Opsional)
NEXT_PUBLIC_MIDTRANS_SERVER_KEY=SB-Mid-server-your-key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-your-key
```

Step 3: Database Setup

Jalankan di Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  category TEXT,
  rating DECIMAL(2,1),
  preparation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public Access" ON storage.objects FOR ALL USING (bucket_id = 'product-images');
```

Step 4: Run Development

```bash
npm run dev
```

Buka http://localhost:3000

Step 5: Build & Deploy

```bash
npm run build
npm run start
```

👨‍💼 Untuk User (Cara Penggunaan)

🛠️ Bagi Pemilik Restoran (Admin)

1. Akses Panel Admin

· Buka: https://your-app.vercel.app/admin
· Tidak perlu login untuk demo

2. Tambah Menu dengan AI

· Klik "Upload Food Photo"
· Pilih foto makanan dari device
· AI otomatis deteksi:
  · Nama makanan
  · Deskripsi
  · Harga yang disarankan
· Produk langsung muncul di menu

3. Kelola Menu

· Lihat semua produk di tab "Product Management"
· Pantau statistik di dashboard
· Hapus produk jika diperlukan

🛒 Bagi Pelanggan

1. Jelajahi Menu

· Buka halaman utama
· Filter berdasarkan kategori:
  · 🍽️ All Menu
  · 🍖 Main Course
  · 🥤 Beverages
  · 🍰 Desserts
· Lihat rating & waktu persiapan

2. Pesan Makanan

· Klik "Add to Cart" pada item yang diinginkan
· Atur jumlah di keranjang
· Review pesanan sebelum checkout

3. Checkout

· Klik tombol "Cart" di header
· Review item dan total harga
· Klik "Place Order" untuk konfirmasi

🎯 Fitur Utama

🤖 AI-Powered Features

· Auto Menu Recognition - Upload foto, AI ekstrak detail otomatis
· Smart Pricing - Saran harga berdasarkan analisis pasar
· Auto Description - Generate deskripsi menarik otomatis

📱 Modern UX

· Responsive Design - Optimal di desktop & mobile
· Touch-Friendly - Button besar untuk mudah di-tap
· Smooth Animations - Transisi halus dan profesional
· Real-time Updates - Perubahan langsung terlihat

🛠️ Management Tools

· Admin Dashboard - Statistik dan analytics
· Product Catalog - Kelola menu dengan mudah
· Image Management - Upload dan storage otomatis
· Order Management - Lihat dan kelola pesanan

⚡ Technical Excellence

· Dual-Mode System - Bekerja dengan/without API keys
· Offline Capable - Fungsi dasar tetap bekerja
· Fast Performance - Optimized loading dan rendering
· Error Handling - User-friendly error messages

🏗️ Arsitektur Sistem

```
Frontend (Next.js 15)
├── Client Components
│   ├── Product Display
│   ├── Shopping Cart
│   └── Admin Panel
├── Server Components  
│   ├ API Routes
│   │   ├── AI Processing (/api/ai-process)
│   │   ├── Image Upload (/api/upload)
│   │   └── Payment (/api/midtrans-webhook)
│   └── Server-side Rendering
└── State Management
    ├── React Hooks
    ├── Local Storage
    └── Real-time Updates

Backend Services
├── Database (Supabase PostgreSQL)
├── File Storage (Supabase Storage)
├── AI Service (OpenAI GPT-4 Vision)
├── Payment Gateway (Midtrans)
└── Workflow Automation (n8n)
```

Tech Stack Details

Layer Technology Purpose
Frontend Next.js 15, React 18, Tailwind CSS SSR, Responsive UI, Modern Styling
Backend Next.js API Routes, Node.js Server Logic, AI Processing
Database Supabase PostgreSQL Product & Order Storage
Storage Supabase Storage Image File Management
AI/ML OpenAI GPT-4 Vision Product Recognition
Payment Midtrans Payment Processing
Styling Tailwind CSS Utility-first CSS Framework
Deployment Vercel Cloud Hosting & CI/CD

🔧 Advanced Configuration

Dual-Mode System

Aplikasi memiliki 2 mode operasi:

🎭 Demo Mode (Default tanpa config):

· AI simulation dengan data realistis
· Local storage di browser
· Cepat dan tidak perlu API keys
· Perfect untuk testing

🚀 Production Mode (Dengan environment variables):

· Real OpenAI GPT-4 Vision
· Real Supabase database
· Real payment processing
· Real image upload

Environment Variables Lengkap

```env
# Required: Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: AI Features
OPENAI_API_KEY=sk-your-openai-key

# Optional: Payment
NEXT_PUBLIC_MIDTRANS_SERVER_KEY=your_midtrans_server_key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key

# Optional: Automation
N8N_WEBHOOK_URL=your_n8n_webhook_url

# Optional: Auth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=your_app_url
```

�� Troubleshooting

Common Issues & Solutions

1. Build Error

```bash
# Clear cache dan install ulang
rm -rf node_modules package-lock.json
npm install
npm run build
```

2. Database Connection Error

· Pastikan Supabase URL dan key benar
· Cek tabel dan policies sudah dibuat
· Verifikasi storage bucket exists

3. AI Processing Error

· Pastikan OpenAI API key valid
· Cek quota GPT-4 Vision
· Fallback ke demo mode otomatis

4. Image Upload Error

· Verifikasi Supabase storage bucket
· Cek file size (max 10MB)
· Pastikan format didukung (JPG, PNG, WEBP)

📞 Support

Untuk bantuan teknis:

1. Check documentation ini
2. Buka issues di GitHub repository
3. Contact developer langsung

🚀 Deployment

Deploy ke Vercel

1. Push code ke GitHub
2. Import project di Vercel
3. Configure environment variables
4. Deploy otomatis

Build Production

```bash
npm run build
npm run start
```

---

<div align="center">

🎉 Selamat! Aplikasi Anda siap digunakan.

Dibuat dengan ❤️ untuk Technical Brief Junior Full Stack AI Developer

</div>
