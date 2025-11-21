# 📁 Project Structure

Struktur folder project Sistem Pengaduan Siswa yang telah dirapikan dan diorganisir.

## 🗂️ Directory Structure

```
/home/user/kpsipet/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Database seeding script
│   └── migrations/            # Database migrations
│
├── public/                    # Static assets
│
├── src/
│   ├── app/
│   │   ├── admin/            # 🔵 ADMIN PAGES
│   │   │   ├── dashboard/    # Admin dashboard dengan statistik
│   │   │   ├── users/        # CRUD Pengguna (admin & petugas)
│   │   │   ├── guru/         # CRUD Data Guru
│   │   │   ├── siswa/        # CRUD Data Siswa
│   │   │   ├── pengaduan/    # CRUD Pengaduan Siswa
│   │   │   └── template/     # CRUD Template Surat
│   │   │
│   │   ├── guru/             # 🟢 GURU PAGES
│   │   │   ├── dashboard/    # Dashboard guru
│   │   │   ├── pengaduan/    # Form buat pengaduan baru
│   │   │   └── riwayat/      # Riwayat pengaduan guru
│   │   │
│   │   ├── api/              # 🔴 API ROUTES
│   │   │   ├── users/        # Users API endpoints
│   │   │   ├── guru/         # Guru API endpoints
│   │   │   ├── siswa/        # Siswa API endpoints
│   │   │   ├── pengaduan/    # Pengaduan API endpoints
│   │   │   ├── template/     # Template API endpoints
│   │   │   └── stats/        # Statistics API endpoint
│   │   │
│   │   ├── components/       # 🎨 COMPONENTS
│   │   │   ├── admin/        # Admin-specific components
│   │   │   │   ├── AdminLayout.tsx
│   │   │   │   ├── AdminHeader.tsx
│   │   │   │   └── AdminSidebar.tsx
│   │   │   │
│   │   │   ├── guru/         # Guru-specific components
│   │   │   │   ├── GuruLayout.tsx
│   │   │   │   ├── GuruHeader.tsx
│   │   │   │   └── GuruSidebar.tsx
│   │   │   │
│   │   │   └── ui/           # Reusable UI components
│   │   │       ├── Modal.tsx
│   │   │       ├── Toast.tsx
│   │   │       ├── ToastContainer.tsx
│   │   │       ├── ConfirmDialog.tsx
│   │   │       ├── LoadingSpinner.tsx
│   │   │       └── Pagination.tsx
│   │   │
│   │   ├── page.tsx          # 🔐 LOGIN PAGE (Root)
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   │
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client singleton
│   │   └── utils.ts          # Utility functions
│   │
│   └── hooks/
│       └── use-mobile.ts     # Mobile detection hook
│
├── .env                       # Environment variables (not in git)
├── .env.example              # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── ADMIN_README.md           # Admin dashboard documentation
└── PROJECT_STRUCTURE.md      # This file

```

## 🎯 Route Mapping

### Public Routes
- `/` - Login page

### Admin Routes (Protected)
- `/admin/dashboard` - Dashboard utama dengan statistik
- `/admin/users` - Kelola pengguna (admin & petugas)
- `/admin/guru` - Kelola data guru
- `/admin/siswa` - Kelola data siswa
- `/admin/pengaduan` - Kelola pengaduan siswa
- `/admin/template` - Kelola template surat

### Guru Routes (Protected)
- `/guru/dashboard` - Dashboard guru
- `/guru/pengaduan` - Form buat pengaduan baru
- `/guru/riwayat` - Riwayat pengaduan yang dibuat

### API Routes
- `/api/users` - Users CRUD
- `/api/users/[id]` - Single user operations
- `/api/guru` - Guru CRUD
- `/api/guru/[id]` - Single guru operations
- `/api/siswa` - Siswa CRUD
- `/api/siswa/[id]` - Single siswa operations
- `/api/pengaduan` - Pengaduan CRUD
- `/api/pengaduan/[id]` - Single pengaduan operations
- `/api/template` - Template CRUD
- `/api/template/[id]` - Single template operations
- `/api/stats` - Dashboard statistics

## 📦 Component Organization

### Admin Components (`/components/admin/`)
- **AdminLayout** - Wrapper layout dengan sidebar dan mobile menu
- **AdminSidebar** - Sidebar navigasi dengan collapsible submenu
- **AdminHeader** - Header halaman dengan title dan action buttons

### Guru Components (`/components/guru/`)
- **GuruLayout** - Wrapper layout untuk guru
- **GuruSidebar** - Sidebar navigasi guru
- **GuruHeader** - Header halaman guru

### UI Components (`/components/ui/`)
- **Modal** - Reusable modal dialog (4 sizes)
- **Toast** - Toast notifications (4 types: success, error, warning, info)
- **ToastContainer** - Toast provider dan container
- **ConfirmDialog** - Confirmation dialog untuk destructive actions
- **LoadingSpinner** - Loading indicator (3 sizes)
- **Pagination** - Pagination component untuk tables

## 🗄️ Database Models

### Users
- Menyimpan data admin dan petugas
- Fields: id_user, username, password (hashed), role

### Guru
- Data guru/pengajar
- Fields: id_guru, nip, nama_guru, no_telp

### Siswa
- Data siswa
- Fields: id_siswa, nisn, nama_siswa, kelas, kontak_ortu

### Pengaduan
- Laporan pengaduan siswa
- Fields: id_pengaduan, tgl_pengaduan, deskripsi_masalah, status_laporan, alasan_penolakan, id_guru, id_siswa

### TemplateSurat
- Template surat untuk tindak lanjut
- Fields: id_template, nama_template, isi_template

### TindakLanjut
- Tindak lanjut dari pengaduan
- Fields: id_tindak_lanjut, tgl_proses, file_surat, catatan_admin, id_pengaduan, id_user, id_template

## 🔐 Authentication Flow

```
Login (/)
    ↓
Check credentials
    ↓
    ├─→ Admin/Petugas → /admin/dashboard
    └─→ Guru → /guru/dashboard
```

## 🎨 Styling Stack

- **Framework**: Tailwind CSS 4
- **Colors**: CSS Variables dengan OKLCH color model
- **Icons**: Lucide React
- **Animations**: Tailwind Animate CSS
- **Layout**: Flexbox & Grid

## 📝 Notes

### File yang Telah Dihapus (Cleanup)
- ❌ `/components/button.tsx` - Old component
- ❌ `/components/card.tsx` - Old component
- ❌ `/components/cardtabel.tsx` - Old component
- ❌ `/components/form.tsx` - Old component
- ❌ `/components/navbar.tsx` - Old component
- ❌ `/components/sidebar.tsx` - Old component (replaced by AdminSidebar & GuruSidebar)
- ❌ `/admin/page.tsx` - Old admin page with dummy data
- ❌ `/dashboard/page.tsx` - Old dashboard
- ❌ `/form/page.tsx` - Old form
- ❌ `/pdf/page.tsx` - Old PDF page
- ❌ `/riwayat/page.tsx` - Old riwayat

### Naming Conventions
- **Pages**: `page.tsx` (Next.js App Router convention)
- **Components**: PascalCase (e.g., `AdminSidebar.tsx`)
- **API Routes**: `route.ts` (Next.js App Router convention)
- **Utilities**: camelCase (e.g., `utils.ts`)

### Code Organization Principles
1. **Separation of Concerns**: Admin dan Guru memiliki folder terpisah
2. **Reusability**: UI components di folder `/ui` dapat digunakan dimana saja
3. **Modularity**: Setiap feature memiliki foldernya sendiri
4. **Type Safety**: TypeScript untuk semua files
5. **Clean Architecture**: API routes terpisah dari UI components

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Setup database
npm run db:push
npm run db:seed

# Run development server
npm run dev
```

## 📚 Documentation

- **Admin Features**: See `ADMIN_README.md`
- **API Documentation**: See `ADMIN_README.md` (API Routes section)
- **Setup Guide**: See `ADMIN_README.md` (Setup & Installation section)

---

**Last Updated**: November 2025
