import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-helpers'

// GET dashboard statistics
export async function GET() {
  // Require authentication
  const session = await requireAuth()
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized - Please login' },
      { status: 401 }
    )
  }

  try {
    const [
      totalUsers,
      totalGuru,
      totalSiswa,
      totalPengaduan,
      pengaduanMenunggu,
      pengaduanDisetujui,
      pengaduanDitolak,
      pengaduanSelesai
    ] = await Promise.all([
      prisma.users.count(),
      prisma.guru.count(),
      prisma.siswa.count(),
      prisma.pengaduan.count(),
      prisma.pengaduan.count({ where: { status_laporan: 'Menunggu' } }),
      prisma.pengaduan.count({ where: { status_laporan: 'Disetujui' } }),
      prisma.pengaduan.count({ where: { status_laporan: 'Ditolak' } }),
      prisma.pengaduan.count({ where: { status_laporan: 'Selesai' } })
    ])

    return NextResponse.json({
      totalUsers,
      totalGuru,
      totalSiswa,
      totalPengaduan,
      pengaduanByStatus: {
        menunggu: pengaduanMenunggu,
        disetujui: pengaduanDisetujui,
        ditolak: pengaduanDitolak,
        selesai: pengaduanSelesai
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
