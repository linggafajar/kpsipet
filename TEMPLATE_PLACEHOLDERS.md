# Template Surat - Panduan Placeholder

Dokumen ini menjelaskan placeholder yang dapat digunakan di template surat untuk sistem pengaduan.

## 📝 Placeholder yang Tersedia

### Data Siswa
- `[NAMA_SISWA]` - Nama lengkap siswa
- `[NISN]` - Nomor Induk Siswa Nasional
- `[KELAS]` - Kelas siswa (contoh: "XII IPA 1")
- `[KONTAK_ORTU]` - Nomor kontak orang tua/wali

### Data Guru
- `[NAMA_GURU]` - Nama lengkap guru yang melaporkan
- `[NIP_GURU]` - Nomor Induk Pegawai guru

### Data Pengaduan
- `[TANGGAL_PELAPORAN]` - Tanggal pengaduan dibuat
- `[DESKRIPSI_MASALAH]` - Deskripsi lengkap masalah/pelanggaran
- `[TINDAK_LANJUT]` - Catatan tindak lanjut dari admin

### Data Surat
- `[NOMOR_SURAT]` - Nomor surat otomatis (contoh: "001/SP/11/2025")
- `[TANGGAL_SURAT]` - Tanggal surat diproses
- `[TANGGAL_HARI_INI]` - Tanggal hari ini
- `[TAHUN]` - Tahun saat ini

## 📋 Contoh Template

### Template 1: Surat Panggilan Orang Tua

```
Melalui surat ini kami sampaikan bahwa:

Nama Siswa : [NAMA_SISWA]
NISN       : [NISN]
Kelas      : [KELAS]

Telah dilaporkan oleh [NAMA_GURU] pada tanggal [TANGGAL_PELAPORAN] dengan deskripsi masalah sebagai berikut:

[DESKRIPSI_MASALAH]

Tindak Lanjut:
[TINDAK_LANJUT]

Berdasarkan hal tersebut, kami mohon kehadiran Bapak/Ibu orang tua/wali untuk datang ke sekolah guna membahas tindak lanjut lebih lanjut.

Demikian surat panggilan ini kami sampaikan. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.
```

### Template 2: Surat Pemberitahuan Pelanggaran

```
Dengan ini kami beritahukan bahwa anak Bapak/Ibu:

Nama       : [NAMA_SISWA]
NISN       : [NISN]
Kelas      : [KELAS]

Telah melakukan pelanggaran sebagaimana dilaporkan oleh [NAMA_GURU] pada tanggal [TANGGAL_PELAPORAN]:

"[DESKRIPSI_MASALAH]"

Langkah Tindak Lanjut:
[TINDAK_LANJUT]

Kami berharap Bapak/Ibu dapat memberikan perhatian dan bimbingan lebih kepada putra/putri Bapak/Ibu agar tidak mengulangi perbuatan serupa di masa mendatang.

Demikian surat pemberitahuan ini kami sampaikan. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.
```

### Template 3: Surat Peringatan

```
Berdasarkan laporan dari [NAMA_GURU], dengan ini kami sampaikan peringatan kepada:

Nama Siswa : [NAMA_SISWA]
NISN       : [NISN]
Kelas      : [KELAS]

Pelanggaran yang dilakukan:
[DESKRIPSI_MASALAH]

Ini merupakan peringatan resmi dari sekolah. Apabila pelanggaran terulang kembali, maka akan dikenakan sanksi yang lebih berat sesuai dengan peraturan sekolah yang berlaku.

Tindak Lanjut yang Harus Dilakukan:
[TINDAK_LANJUT]

Kami mohon orang tua/wali untuk memberikan pengawasan dan pembinaan yang lebih intensif kepada putra/putri Bapak/Ibu.

Hormat kami,
Sekolah
```

## 💡 Tips Menulis Template

1. **Gunakan bahasa formal** - Template akan menjadi surat resmi
2. **Jelas dan ringkas** - Sampaikan informasi dengan jelas
3. **Gunakan placeholder** - Jangan tulis nama atau data spesifik, gunakan placeholder
4. **Format yang rapi** - Gunakan paragraf dan spacing yang baik
5. **Sopan dan profesional** - Gunakan bahasa yang sopan dan hormat

## 🚀 Cara Membuat Template Baru

1. Login sebagai **Admin**
2. Buka menu **Template Surat**
3. Klik tombol **"Tambah Template"**
4. Isi:
   - **Nama Template**: Nama deskriptif (contoh: "Surat Panggilan Orang Tua")
   - **Isi Template**: Konten surat dengan placeholder
5. Klik **"Create"**

## ✏️ Cara Edit Template

1. Buka halaman **Template Surat**
2. Klik icon **pensil** pada template yang ingin diedit
3. Edit nama atau isi template
4. Klik **"Update"**

## 🗑️ Cara Hapus Template

1. Buka halaman **Template Surat**
2. Klik icon **tong sampah** pada template yang ingin dihapus
3. Konfirmasi penghapusan
4. **Note**: Template yang sudah digunakan untuk mengirim surat tidak bisa dihapus

## 📤 Cara Menggunakan Template

1. Buka halaman **Pengaduan**
2. Klik tombol **approve** (✓) pada pengaduan
3. **Pilih template** dari dropdown
4. Isi **catatan tindak lanjut**
5. Klik **"Approve & Send"**
6. Sistem akan:
   - Generate PDF menggunakan template
   - Replace semua placeholder dengan data asli
   - Kirim PDF ke WhatsApp orang tua otomatis

## ⚠️ Catatan Penting

- Template **tidak bisa dihapus** jika sudah digunakan untuk mengirim surat
- Pastikan **semua placeholder ditulis dengan benar** (huruf kapital, dalam kurung siku)
- Template akan digunakan untuk membuat **PDF formal**, pastikan formatnya rapi
- Sistem akan otomatis **replace placeholder** saat generate PDF

## 📞 Support

Jika ada pertanyaan atau masalah dengan template, hubungi administrator sistem.
