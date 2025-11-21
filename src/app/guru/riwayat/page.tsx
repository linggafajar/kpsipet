'use client'

import { useEffect, useState } from 'react'
import GuruLayout from '@/app/components/guru/GuruLayout'
import GuruHeader from '@/app/components/guru/GuruHeader'
import Modal from '@/app/components/ui/Modal'
import LoadingSpinner from '@/app/components/ui/LoadingSpinner'
import { Search, Filter, Eye, FileText } from 'lucide-react'

interface Pengaduan {
  id_pengaduan: number
  tgl_pengaduan: string
  deskripsi_masalah: string
  status_laporan: 'Menunggu' | 'Disetujui' | 'Ditolak' | 'Selesai'
  alasan_penolakan: string | null
  guru: {
    id_guru: number
    nama_guru: string
    nip: string
  }
  siswa: {
    id_siswa: number
    nama_siswa: string
    nisn: string
    kelas: string
  }
  tindak_lanjut?: {
    tgl_proses: string
    catatan_admin: string
  }
}

export default function RiwayatPage() {
  const [pengaduan, setPengaduan] = useState<Pengaduan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedPengaduan, setSelectedPengaduan] = useState<Pengaduan | null>(null)

  useEffect(() => {
    fetchPengaduan()
  }, [])

  const fetchPengaduan = async () => {
    try {
      const response = await fetch('/api/pengaduan')
      const data = await response.json()
      setPengaduan(data)
    } catch (error) {
      console.error('Failed to fetch pengaduan:', error)
    } finally {
      setLoading(false)
    }
  }

  const openViewModal = (pengaduan: Pengaduan) => {
    setSelectedPengaduan(pengaduan)
    setIsViewModalOpen(true)
  }

  const filteredPengaduan = pengaduan.filter(p =>
    (p.siswa.nama_siswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.deskripsi_masalah.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === '' || p.status_laporan === statusFilter)
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Menunggu': return 'bg-yellow-100 text-yellow-800'
      case 'Disetujui': return 'bg-blue-100 text-blue-800'
      case 'Ditolak': return 'bg-red-100 text-red-800'
      case 'Selesai': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <GuruLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <LoadingSpinner size="lg" text="Memuat riwayat..." />
        </div>
      </GuruLayout>
    )
  }

  return (
    <GuruLayout>
      <GuruHeader
        title="Riwayat Pengaduan"
        subtitle="Daftar semua pengaduan yang pernah dibuat"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Search and Filter */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari siswa atau deskripsi masalah..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Status</option>
                <option value="Menunggu">Menunggu</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Ditolak">Ditolak</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Siswa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPengaduan.map((p, index) => (
                <tr key={p.id_pengaduan} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(p.tgl_pengaduan).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{p.siswa.nama_siswa}</div>
                    <div className="text-xs text-gray-500">{p.siswa.kelas}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs truncate">{p.deskripsi_masalah}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(p.status_laporan)}`}>
                      {p.status_laporan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => openViewModal(p)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-xs">Detail</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPengaduan.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Tidak ada pengaduan ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Detail Pengaduan"
        size="lg"
      >
        {selectedPengaduan && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">ID Pengaduan</label>
                <p className="text-gray-900">{selectedPengaduan.id_pengaduan}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Tanggal</label>
                <p className="text-gray-900">{new Date(selectedPengaduan.tgl_pengaduan).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Siswa</label>
                <p className="text-gray-900 font-semibold">{selectedPengaduan.siswa.nama_siswa}</p>
                <p className="text-sm text-gray-600">{selectedPengaduan.siswa.nisn} - {selectedPengaduan.siswa.kelas}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Guru Pelapor</label>
                <p className="text-gray-900 font-semibold">{selectedPengaduan.guru.nama_guru}</p>
                <p className="text-sm text-gray-600">{selectedPengaduan.guru.nip}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <p className="mt-1">
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedPengaduan.status_laporan)}`}>
                  {selectedPengaduan.status_laporan}
                </span>
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Deskripsi Masalah</label>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 whitespace-pre-wrap">{selectedPengaduan.deskripsi_masalah}</p>
              </div>
            </div>

            {selectedPengaduan.alasan_penolakan && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <label className="text-sm font-medium text-red-700">Alasan Penolakan</label>
                <p className="text-red-900 mt-1">{selectedPengaduan.alasan_penolakan}</p>
              </div>
            )}

            {selectedPengaduan.tindak_lanjut && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <label className="text-sm font-medium text-green-700">Tindak Lanjut</label>
                <p className="text-sm text-green-800 mt-1">
                  Diproses pada: {new Date(selectedPengaduan.tindak_lanjut.tgl_proses).toLocaleDateString('id-ID')}
                </p>
                <p className="text-green-900 mt-2">{selectedPengaduan.tindak_lanjut.catatan_admin}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </GuruLayout>
  )
}
