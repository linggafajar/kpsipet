# 🎓 Sistem Informasi Pengaduan Siswa

Sistem manajemen pengaduan siswa berbasis web untuk sekolah, dibangun dengan Next.js 16, TypeScript, Prisma ORM, dan Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🔵 Admin Dashboard
- **Dashboard Statistik** - Real-time statistics dan overview sistem
- **Manajemen Pengguna** - CRUD admin dan petugas dengan password hashing
- **Manajemen Guru** - Kelola data guru dengan validasi NIP
- **Manajemen Siswa** - Kelola data siswa dengan filter kelas
- **Manajemen Pengaduan** - Full workflow dari pengaduan hingga tindak lanjut
- **Template Surat** - Kelola template surat dengan preview

### 🟢 Portal Guru
- **Dashboard Guru** - Overview pengaduan yang dibuat
- **Buat Pengaduan** - Form pengaduan siswa yang mudah digunakan
- **Riwayat Pengaduan** - Lihat semua pengaduan dengan detail lengkap

### 🎨 UI/UX Features
- ✅ Responsive design (mobile-first)
- ✅ Dark mode support (via CSS variables)
- ✅ Toast notifications
- ✅ Confirm dialogs
- ✅ Loading states
- ✅ Empty states
- ✅ Pagination
- ✅ Search & filter
- ✅ Smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm atau yarn

### Installation

```bash
# 1. Clone repository
git clone https://github.com/pandu926/kpsipet.git
cd kpsipet

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env dan sesuaikan DATABASE_URL

# 4. Generate Prisma Client
npm run db:generate

# 5. Push database schema
npm run db:push

# 6. Seed initial data
npm run db:seed

# 7. Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🔐 Default Credentials

Setelah seeding, gunakan credentials berikut untuk login:

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Petugas Account:**
- Username: `petugas`
- Password: `petugas123`

**Demo Guru (untuk testing UI):**
- Username: `guru`
- Password: `guru123`

⚠️ **IMPORTANT:** Ganti password default sebelum production!

## 📁 Project Structure

```
/src/app/
  /admin/          # Admin dashboard pages
    /dashboard/    # Main dashboard
    /users/        # User management
    /guru/         # Teacher management
    /siswa/        # Student management
    /pengaduan/    # Complaint management
    /template/     # Letter template management

  /guru/           # Teacher portal pages
    /dashboard/    # Teacher dashboard
    /pengaduan/    # Create complaint
    /riwayat/      # Complaint history

  /api/            # REST API routes
    /users/        # Users API
    /guru/         # Teachers API
    /siswa/        # Students API
    /pengaduan/    # Complaints API
    /template/     # Templates API
    /stats/        # Statistics API

  /components/     # Reusable components
    /admin/        # Admin components
    /guru/         # Teacher components
    /ui/           # UI components

  page.tsx         # Login page
```

Lihat [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) untuk detail lengkap.

## 🛠️ Tech Stack

### Core
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Database**: PostgreSQL
- **ORM**: [Prisma 6.19](https://www.prisma.io/)

### Frontend
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: Tailwind Animate CSS

### Backend
- **API**: Next.js Route Handlers
- **Authentication**: bcryptjs (password hashing)
- **Validation**: TypeScript + Zod (recommended)

## 📚 Documentation

- **Admin Features**: [ADMIN_README.md](./ADMIN_README.md)
- **Project Structure**: [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- **API Documentation**: See ADMIN_README.md

## 🗄️ Database Schema

```prisma
model Users {
  id_user       Int     @id @default(autoincrement())
  username      String  @unique
  password      String
  role          Role    // admin | petugas
  tindak_lanjut TindakLanjut[]
}

model Guru {
  id_guru    Int        @id @default(autoincrement())
  nip        String     @unique
  nama_guru  String
  no_telp    String?
  pengaduan  Pengaduan[]
}

model Siswa {
  id_siswa    Int        @id @default(autoincrement())
  nisn        String     @unique
  nama_siswa  String
  kelas       String
  kontak_ortu String
  pengaduan   Pengaduan[]
}

model Pengaduan {
  id_pengaduan     Int           @id @default(autoincrement())
  tgl_pengaduan    DateTime
  deskripsi_masalah String
  status_laporan   StatusLaporan // Menunggu | Disetujui | Ditolak | Selesai
  alasan_penolakan String?
  id_guru          Int
  id_siswa         Int
  guru             Guru          @relation(...)
  siswa            Siswa         @relation(...)
  tindak_lanjut    TindakLanjut?
}

model TemplateSurat {
  id_template   Int    @id @default(autoincrement())
  nama_template String
  isi_template  String
  tindak_lanjut TindakLanjut[]
}

model TindakLanjut {
  id_tindak_lanjut Int           @id @default(autoincrement())
  tgl_proses       DateTime
  file_surat       String
  catatan_admin    String
  id_pengaduan     Int           @unique
  id_user          Int
  id_template      Int
  pengaduan        Pengaduan     @relation(...)
  user             Users         @relation(...)
  template         TemplateSurat @relation(...)
}
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:seed          # Seed initial data
npm run db:studio        # Open Prisma Studio

# Production
npm run build            # Build for production
npm start                # Start production server
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - Login (to be implemented)
- `POST /api/auth/logout` - Logout (to be implemented)

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Guru
- `GET /api/guru` - Get all teachers
- `POST /api/guru` - Create teacher
- `GET /api/guru/[id]` - Get teacher by ID
- `PUT /api/guru/[id]` - Update teacher
- `DELETE /api/guru/[id]` - Delete teacher

### Siswa
- `GET /api/siswa?kelas=X%20IPA%201` - Get all students (optional filter)
- `POST /api/siswa` - Create student
- `GET /api/siswa/[id]` - Get student by ID
- `PUT /api/siswa/[id]` - Update student
- `DELETE /api/siswa/[id]` - Delete student

### Pengaduan
- `GET /api/pengaduan?status=Menunggu` - Get all complaints (optional filter)
- `POST /api/pengaduan` - Create complaint
- `GET /api/pengaduan/[id]` - Get complaint by ID
- `PUT /api/pengaduan/[id]` - Update complaint
- `DELETE /api/pengaduan/[id]` - Delete complaint

### Template
- `GET /api/template` - Get all templates
- `POST /api/template` - Create template
- `GET /api/template/[id]` - Get template by ID
- `PUT /api/template/[id]` - Update template
- `DELETE /api/template/[id]` - Delete template

### Statistics
- `GET /api/stats` - Get dashboard statistics

## 🔒 Security Features

- ✅ Password hashing dengan bcryptjs (10 rounds)
- ✅ Input validation
- ✅ SQL injection prevention (Prisma ORM)
- ✅ Unique constraints pada database
- ⏳ JWT authentication (to be implemented)
- ⏳ CSRF protection (to be implemented)
- ⏳ Rate limiting (to be implemented)

## 🚧 Roadmap

### Phase 1 (Current) ✅
- [x] Admin dashboard dengan CRUD lengkap
- [x] Guru portal dengan pengaduan
- [x] Responsive UI design
- [x] Toast notifications & modals
- [x] Database seeding

### Phase 2 (Next)
- [ ] Real authentication (NextAuth.js atau JWT)
- [ ] Protected routes dengan middleware
- [ ] Role-based access control
- [ ] Upload file untuk surat
- [ ] Email notifications
- [ ] PDF generation untuk surat

### Phase 3 (Future)
- [ ] Export data ke Excel/PDF
- [ ] Advanced filtering & sorting
- [ ] Bulk operations
- [ ] Activity logs
- [ ] Dashboard analytics dengan charts
- [ ] Print surat langsung

## 📝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Author

**Pandu926**
- GitHub: [@pandu926](https://github.com/pandu926)

## 🙏 Acknowledgments

- Next.js team untuk framework yang amazing
- Prisma team untuk ORM yang powerful
- Tailwind CSS untuk utility-first CSS
- Radix UI untuk accessible components
- Lucide untuk beautiful icons

---

**Built with ❤️ using Next.js 16 & Prisma**
