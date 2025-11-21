import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.users.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    }
  })
  console.log('✅ Admin user created:', admin.username)

  // Create guru user
  const hashedPasswordGuru = await bcrypt.hash('guru123', 10)
  const guruUser = await prisma.users.upsert({
    where: { username: 'guru' },
    update: {},
    create: {
      username: 'guru',
      password: hashedPasswordGuru,
      role: 'guru'
    }
  })
  console.log('✅ Guru user created:', guruUser.username)

  // Create petugas user
  const hashedPasswordPetugas = await bcrypt.hash('petugas123', 10)
  const petugas = await prisma.users.upsert({
    where: { username: 'petugas' },
    update: {},
    create: {
      username: 'petugas',
      password: hashedPasswordPetugas,
      role: 'petugas'
    }
  })
  console.log('✅ Petugas user created:', petugas.username)

  // Create sample guru
  const guru1 = await prisma.guru.upsert({
    where: { nip: '1234567890' },
    update: {},
    create: {
      nip: '1234567890',
      nama_guru: 'Budi Santoso, S.Pd',
      no_telp: '081234567890'
    }
  })
  console.log('✅ Guru created:', guru1.nama_guru)

  const guru2 = await prisma.guru.upsert({
    where: { nip: '0987654321' },
    update: {},
    create: {
      nip: '0987654321',
      nama_guru: 'Sri Wahyuni, S.Pd',
      no_telp: '082345678901'
    }
  })
  console.log('✅ Guru created:', guru2.nama_guru)

  // Create sample siswa
  const siswa1 = await prisma.siswa.upsert({
    where: { nisn: '0012345678' },
    update: {},
    create: {
      nisn: '0012345678',
      nama_siswa: 'Ahmad Fadli',
      kelas: 'X IPA 1',
      kontak_ortu: '083456789012'
    }
  })
  console.log('✅ Siswa created:', siswa1.nama_siswa)

  const siswa2 = await prisma.siswa.upsert({
    where: { nisn: '0012345679' },
    update: {},
    create: {
      nisn: '0012345679',
      nama_siswa: 'Siti Nurhaliza',
      kelas: 'X IPA 1',
      kontak_ortu: '084567890123'
    }
  })
  console.log('✅ Siswa created:', siswa2.nama_siswa)

  const siswa3 = await prisma.siswa.upsert({
    where: { nisn: '0012345680' },
    update: {},
    create: {
      nisn: '0012345680',
      nama_siswa: 'Rizki Pratama',
      kelas: 'XI IPS 2',
      kontak_ortu: '085678901234'
    }
  })
  console.log('✅ Siswa created:', siswa3.nama_siswa)

  // Create sample template surat
  const template1 = await prisma.templateSurat.upsert({
    where: { id_template: 1 },
    update: {},
    create: {
      nama_template: 'Surat Panggilan Orang Tua',
      isi_template: `Kepada Yth.
Orang Tua/Wali dari [NAMA_SISWA]
Kelas [KELAS]

Dengan hormat,
Berdasarkan pengaduan dari [NAMA_GURU] pada tanggal [TANGGAL], dengan ini kami mengundang Bapak/Ibu untuk hadir di sekolah guna membahas masalah yang dialami oleh putra/putri Bapak/Ibu.

Deskripsi masalah:
[DESKRIPSI_MASALAH]

Mohon kehadiran Bapak/Ibu pada:
Hari/Tanggal: [JADWAL_PERTEMUAN]
Waktu: [WAKTU_PERTEMUAN]
Tempat: Ruang BK

Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.

Hormat kami,
Kepala Sekolah

[NAMA_KEPALA_SEKOLAH]`
    }
  })
  console.log('✅ Template created:', template1.nama_template)

  const template2 = await prisma.templateSurat.upsert({
    where: { id_template: 2 },
    update: {},
    create: {
      nama_template: 'Surat Peringatan',
      isi_template: `SURAT PERINGATAN

Kepada:
Nama: [NAMA_SISWA]
Kelas: [KELAS]
NISN: [NISN]

Dengan ini diberikan surat peringatan kepada siswa yang bersangkutan atas pelanggaran yang dilakukan:

[DESKRIPSI_MASALAH]

Apabila pelanggaran ini terulang kembali, akan diberikan sanksi yang lebih tegas sesuai dengan peraturan sekolah.

Demikian surat peringatan ini dibuat untuk menjadi perhatian.

Dikeluarkan pada: [TANGGAL]

Guru BK,

[NAMA_GURU]`
    }
  })
  console.log('✅ Template created:', template2.nama_template)

  // Create sample pengaduan
  const pengaduan1 = await prisma.pengaduan.create({
    data: {
      tgl_pengaduan: new Date(),
      deskripsi_masalah: 'Siswa sering terlambat masuk kelas dan mengganggu teman-teman saat pelajaran berlangsung.',
      status_laporan: 'Menunggu',
      id_guru: guru1.id_guru,
      id_siswa: siswa1.id_siswa
    }
  })
  console.log('✅ Pengaduan created for:', siswa1.nama_siswa)

  const pengaduan2 = await prisma.pengaduan.create({
    data: {
      tgl_pengaduan: new Date(Date.now() - 86400000), // 1 day ago
      deskripsi_masalah: 'Siswa tidak mengerjakan tugas dan sering tidak membawa perlengkapan sekolah.',
      status_laporan: 'Disetujui',
      id_guru: guru2.id_guru,
      id_siswa: siswa2.id_siswa
    }
  })
  console.log('✅ Pengaduan created for:', siswa2.nama_siswa)

  console.log('🎉 Seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
