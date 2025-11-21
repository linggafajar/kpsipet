import PDFDocument from 'pdfkit';

interface SiswaData {
  nama_siswa: string;
  nisn: string;
  kelas: string;
  kontak_ortu: string;
}

interface GuruData {
  nama_guru: string;
  nip: string;
}

interface PengaduanData {
  id_pengaduan: number;
  tgl_pengaduan: string | Date;
  deskripsi_masalah: string;
  status_laporan: string;
}

interface TindakLanjutData {
  tgl_proses: string | Date;
  catatan_admin: string;
  file_surat: string;
}

interface ComplaintLetterData {
  siswa: SiswaData;
  guru: GuruData;
  pengaduan: PengaduanData;
  tindak_lanjut: TindakLanjutData;
  template: {
    nama_template: string;
    isi_template: string;
  };
}

export class PDFGenerator {
  // Replace placeholders in template with actual data
  static replacePlaceholders(template: string, data: ComplaintLetterData): string {
    const formatDate = (date: string | Date) => {
      const d = new Date(date);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    };

    return template
      .replace(/\[NAMA_SISWA\]/g, data.siswa.nama_siswa)
      .replace(/\[NISN\]/g, data.siswa.nisn)
      .replace(/\[KELAS\]/g, data.siswa.kelas)
      .replace(/\[KONTAK_ORTU\]/g, data.siswa.kontak_ortu)
      .replace(/\[NAMA_GURU\]/g, data.guru.nama_guru)
      .replace(/\[NIP_GURU\]/g, data.guru.nip)
      .replace(/\[TANGGAL_PELAPORAN\]/g, formatDate(data.pengaduan.tgl_pengaduan))
      .replace(/\[DESKRIPSI_MASALAH\]/g, data.pengaduan.deskripsi_masalah)
      .replace(/\[TINDAK_LANJUT\]/g, data.tindak_lanjut.catatan_admin)
      .replace(/\[NOMOR_SURAT\]/g, data.tindak_lanjut.file_surat)
      .replace(/\[TANGGAL_SURAT\]/g, formatDate(data.tindak_lanjut.tgl_proses))
      .replace(/\[TANGGAL_HARI_INI\]/g, formatDate(new Date()))
      .replace(/\[TAHUN\]/g, new Date().getFullYear().toString());
  }

  // Generate complaint notification letter PDF
  static async generateComplaintLetter(data: ComplaintLetterData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: {
            top: 50,
            bottom: 50,
            left: 60,
            right: 60
          }
        });

        const buffers: Buffer[] = [];

        // Collect PDF data in buffers
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        doc.on('error', (error) => {
          reject(error);
        });

        // Header - School Info
        doc
          .fontSize(16)
          .font('Helvetica-Bold')
          .text('SEKOLAH MENENGAH KEJURUAN', { align: 'center' })
          .fontSize(18)
          .text('SMK NEGERI 1 EXAMPLE', { align: 'center' })
          .fontSize(10)
          .font('Helvetica')
          .text('Jl. Pendidikan No. 123, Kota Example, Provinsi Example', { align: 'center' })
          .text('Telp: (021) 1234567 | Email: info@smkn1.sch.id', { align: 'center' })
          .moveDown(0.5);

        // Horizontal line
        const lineY = doc.y;
        doc
          .moveTo(60, lineY)
          .lineTo(535, lineY)
          .lineWidth(2)
          .stroke();

        doc.moveDown(1.5);

        // Letter title
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text('SURAT PEMBERITAHUAN PELANGGARAN SISWA', { align: 'center', underline: true })
          .moveDown(0.5);

        // Letter details
        const formatDate = (date: string | Date) => {
          const d = new Date(date);
          return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
        };

        doc
          .fontSize(11)
          .font('Helvetica')
          .text(`Nomor: ${data.tindak_lanjut.file_surat}`, { align: 'left' })
          .text(`Tanggal: ${formatDate(data.tindak_lanjut.tgl_proses)}`, { align: 'left' })
          .moveDown(1);

        // Recipient
        doc
          .text('Kepada Yth,')
          .text('Orang Tua/Wali Siswa', { indent: 20 })
          .font('Helvetica-Bold')
          .text(data.siswa.nama_siswa, { indent: 20 })
          .font('Helvetica')
          .text('Di tempat')
          .moveDown(1);

        // Greeting
        doc
          .text('Dengan hormat,')
          .moveDown(0.5);

        // Body - Use template content with replaced placeholders
        const templateContent = PDFGenerator.replacePlaceholders(data.template.isi_template, data);

        doc
          .fontSize(11)
          .font('Helvetica')
          .text(templateContent, {
            align: 'justify',
            lineGap: 4
          })
          .moveDown(2);

        // Signature section
        const signatureY = doc.y;

        // Date and place
        doc
          .text(`Example, ${formatDate(new Date())}`, 350, signatureY)
          .moveDown(0.5);

        // School principal signature
        doc
          .text('Kepala Sekolah,', 350)
          .moveDown(3)
          .font('Helvetica-Bold')
          .text('(Nama Kepala Sekolah)', 350)
          .font('Helvetica')
          .text('NIP. 123456789012345678', 350);

        // Footer note
        doc
          .fontSize(9)
          .font('Helvetica-Oblique')
          .text(
            'Catatan: Surat ini dibuat secara otomatis oleh sistem informasi pengaduan siswa.',
            60,
            doc.page.height - 80,
            {
              align: 'center',
              width: 475
            }
          );

        // Finalize PDF
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Format phone number for WhatsApp
  static formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-numeric characters except +
    let formatted = phoneNumber.replace(/[^\d+]/g, '');

    // If number doesn't start with country code, assume Indonesia (+62)
    if (!formatted.startsWith('+')) {
      if (formatted.startsWith('0')) {
        formatted = '62' + formatted.substring(1);
      } else if (!formatted.startsWith('62')) {
        formatted = '62' + formatted;
      }
    } else {
      formatted = formatted.substring(1); // Remove + sign
    }

    return formatted;
  }
}
