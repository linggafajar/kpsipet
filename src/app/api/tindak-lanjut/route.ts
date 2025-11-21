import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PDFGenerator } from '@/services/pdfGenerator';
import { whatsappService } from '@/services/whatsapp';

// POST - Create tindak lanjut (approve pengaduan) and auto-send to parent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id_pengaduan, id_user, id_template, catatan_admin } = body;

    // Validation
    if (!id_pengaduan || !id_user || !id_template || !catatan_admin) {
      return NextResponse.json(
        {
          success: false,
          error: 'id_pengaduan, id_user, id_template, and catatan_admin are required'
        },
        { status: 400 }
      );
    }

    // Get pengaduan with related data
    const pengaduan = await prisma.pengaduan.findUnique({
      where: { id_pengaduan: parseInt(id_pengaduan) },
      include: {
        siswa: true,
        guru: true
      }
    });

    if (!pengaduan) {
      return NextResponse.json(
        { success: false, error: 'Pengaduan not found' },
        { status: 404 }
      );
    }

    // Check if tindak lanjut already exists
    const existingTindakLanjut = await prisma.tindakLanjut.findUnique({
      where: { id_pengaduan: parseInt(id_pengaduan) }
    });

    if (existingTindakLanjut) {
      return NextResponse.json(
        { success: false, error: 'Tindak lanjut already exists for this pengaduan' },
        { status: 400 }
      );
    }

    // Get template
    const template = await prisma.templateSurat.findUnique({
      where: { id_template: parseInt(id_template) }
    });

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      );
    }

    // Generate file number
    const now = new Date();
    const fileNumber = `${String(pengaduan.id_pengaduan).padStart(3, '0')}/SP/${now.getMonth() + 1}/${now.getFullYear()}`;

    // Create tindak lanjut
    const tindakLanjut = await prisma.tindakLanjut.create({
      data: {
        tgl_proses: new Date(),
        file_surat: fileNumber,
        catatan_admin,
        id_pengaduan: parseInt(id_pengaduan),
        id_user: parseInt(id_user),
        id_template: parseInt(id_template)
      }
    });

    // Update pengaduan status to Disetujui
    await prisma.pengaduan.update({
      where: { id_pengaduan: parseInt(id_pengaduan) },
      data: { status_laporan: 'Disetujui' }
    });

    // Generate PDF
    let pdfBuffer: Buffer | null = null;
    let whatsappSent = false;
    let whatsappError: string | null = null;

    try {
      pdfBuffer = await PDFGenerator.generateComplaintLetter({
        siswa: pengaduan.siswa,
        guru: pengaduan.guru,
        pengaduan: {
          id_pengaduan: pengaduan.id_pengaduan,
          tgl_pengaduan: pengaduan.tgl_pengaduan,
          deskripsi_masalah: pengaduan.deskripsi_masalah,
          status_laporan: pengaduan.status_laporan
        },
        tindak_lanjut: {
          tgl_proses: tindakLanjut.tgl_proses,
          catatan_admin: tindakLanjut.catatan_admin,
          file_surat: tindakLanjut.file_surat
        },
        template: {
          nama_template: template.nama_template,
          isi_template: template.isi_template
        }
      });

      console.log('PDF generated successfully');

      // Send to WhatsApp if connected
      if (whatsappService.isClientReady()) {
        const message = `Yth. Orang Tua/Wali dari ${pengaduan.siswa.nama_siswa}\n\n` +
          `Dengan hormat, kami sampaikan surat pemberitahuan terkait pelanggaran yang dilakukan oleh putra/putri Bapak/Ibu.\n\n` +
          `Mohon untuk membaca surat terlampir dan memberikan perhatian lebih kepada putra/putri Bapak/Ibu.\n\n` +
          `Terima kasih atas perhatian dan kerjasamanya.\n\n` +
          `Hormat kami,\n` +
          `SMK Negeri 1 Example`;

        const filename = `Surat_Pemberitahuan_${pengaduan.siswa.nama_siswa.replace(/\s+/g, '_')}_${fileNumber.replace(/\//g, '-')}.pdf`;

        await whatsappService.sendMessage(
          pengaduan.siswa.kontak_ortu,
          message,
          pdfBuffer,
          filename
        );

        whatsappSent = true;
        console.log(`WhatsApp sent to ${pengaduan.siswa.kontak_ortu}`);
      } else {
        whatsappError = 'WhatsApp not connected. Please scan QR code in WhatsApp settings.';
        console.warn('WhatsApp not ready, skipping auto-send');
      }
    } catch (error: any) {
      console.error('Error in PDF generation or WhatsApp sending:', error);
      whatsappError = error.message || 'Failed to send WhatsApp message';
    }

    return NextResponse.json({
      success: true,
      message: 'Tindak lanjut created successfully',
      tindak_lanjut: tindakLanjut,
      whatsapp: {
        sent: whatsappSent,
        error: whatsappError,
        phoneNumber: pengaduan.siswa.kontak_ortu
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating tindak lanjut:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create tindak lanjut'
      },
      { status: 500 }
    );
  }
}

// GET - Get all tindak lanjut
export async function GET() {
  try {
    const tindakLanjut = await prisma.tindakLanjut.findMany({
      include: {
        pengaduan: {
          include: {
            siswa: true,
            guru: true
          }
        },
        user: {
          select: {
            id_user: true,
            username: true,
            role: true
          }
        },
        template: true
      },
      orderBy: {
        tgl_proses: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: tindakLanjut
    });
  } catch (error: any) {
    console.error('Error fetching tindak lanjut:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch tindak lanjut'
      },
      { status: 500 }
    );
  }
}
