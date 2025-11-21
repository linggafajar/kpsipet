"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ToastProvider, useToast } from "@/components/ui/ToastContainer";
import { Plus, Eye, Pencil, Trash2, Search, Filter, CheckCircle } from "lucide-react";
import ApprovalModal from "@/components/admin/ApprovalModal";

interface Pengaduan {
  id_pengaduan: number;
  tgl_pengaduan: string;
  deskripsi_masalah: string;
  status_laporan: "Menunggu" | "Disetujui" | "Ditolak" | "Selesai";
  alasan_penolakan: string | null;
  guru: {
    id_guru: number;
    nama_guru: string;
    nip: string;
  };
  siswa: {
    id_siswa: number;
    nama_siswa: string;
    nisn: string;
    kelas: string;
  };
  tindak_lanjut?: {
    id_tindak_lanjut: number;
    tgl_proses: string;
    catatan_admin: string;
  };
}

interface Guru {
  id_guru: number;
  nama_guru: string;
  nip: string;
}

interface Siswa {
  id_siswa: number;
  nama_siswa: string;
  nisn: string;
  kelas: string;
}

function PengaduanPageContent() {
  const [pengaduan, setPengaduan] = useState<Pengaduan[]>([]);
  const [guru, setGuru] = useState<Guru[]>([]);
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedPengaduan, setSelectedPengaduan] = useState<Pengaduan | null>(
    null
  );
  const [formData, setFormData] = useState({
    deskripsi_masalah: "",
    id_guru: "",
    id_siswa: "",
    status_laporan: "Menunggu" as
      | "Menunggu"
      | "Disetujui"
      | "Ditolak"
      | "Selesai",
    alasan_penolakan: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchPengaduan();
    fetchGuru();
    fetchSiswa();
  }, []);

  const fetchPengaduan = async () => {
    try {
      const response = await fetch("/api/pengaduan");
      const data = await response.json();
      setPengaduan(data);
    } catch (error) {
      showToast("Failed to fetch pengaduan", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchGuru = async () => {
    try {
      const response = await fetch("/api/guru");
      const data = await response.json();
      setGuru(data);
    } catch (error) {
      console.error("Failed to fetch guru:", error);
    }
  };

  const fetchSiswa = async () => {
    try {
      const response = await fetch("/api/siswa");
      const data = await response.json();
      setSiswa(data);
    } catch (error) {
      console.error("Failed to fetch siswa:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = selectedPengaduan
        ? `/api/pengaduan/${selectedPengaduan.id_pengaduan}`
        : "/api/pengaduan";
      const method = selectedPengaduan ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id_guru: parseInt(formData.id_guru),
          id_siswa: parseInt(formData.id_siswa),
          alasan_penolakan:
            formData.status_laporan === "Ditolak"
              ? formData.alasan_penolakan
              : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save pengaduan");
      }

      showToast(
        selectedPengaduan
          ? "Pengaduan updated successfully"
          : "Pengaduan created successfully",
        "success"
      );
      setIsModalOpen(false);
      fetchPengaduan();
      resetForm();
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPengaduan) return;

    try {
      const response = await fetch(
        `/api/pengaduan/${selectedPengaduan.id_pengaduan}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete pengaduan");
      }

      showToast("Pengaduan deleted successfully", "success");
      fetchPengaduan();
      setSelectedPengaduan(null);
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const openCreateModal = () => {
    resetForm();
    setSelectedPengaduan(null);
    setIsModalOpen(true);
  };

  const openEditModal = (pengaduan: Pengaduan) => {
    setSelectedPengaduan(pengaduan);
    setFormData({
      deskripsi_masalah: pengaduan.deskripsi_masalah,
      id_guru: pengaduan.guru.id_guru.toString(),
      id_siswa: pengaduan.siswa.id_siswa.toString(),
      status_laporan: pengaduan.status_laporan,
      alasan_penolakan: pengaduan.alasan_penolakan || "",
    });
    setIsModalOpen(true);
  };

  const openViewModal = (pengaduan: Pengaduan) => {
    setSelectedPengaduan(pengaduan);
    setIsViewModalOpen(true);
  };

  const openDeleteDialog = (pengaduan: Pengaduan) => {
    setSelectedPengaduan(pengaduan);
    setIsDeleteDialogOpen(true);
  };

  const openApprovalModal = (pengaduan: Pengaduan) => {
    setSelectedPengaduan(pengaduan);
    setIsApprovalModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      deskripsi_masalah: "",
      id_guru: "",
      id_siswa: "",
      status_laporan: "Menunggu",
      alasan_penolakan: "",
    });
  };

  const filteredPengaduan = pengaduan.filter(
    (p) =>
      (p.siswa.nama_siswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.guru.nama_guru.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "" || p.status_laporan === statusFilter)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "Disetujui":
        return "bg-blue-100 text-blue-800";
      case "Ditolak":
        return "bg-red-100 text-red-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <LoadingSpinner size="lg" text="Loading pengaduan..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader
        title="Kelola Pengaduan"
        subtitle="Manajemen pengaduan siswa"
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tambah Pengaduan
          </button>
        }
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Search and Filter */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by siswa or guru name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Status</option>
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
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Siswa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guru Pelapor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPengaduan.map((p) => (
                <tr key={p.id_pengaduan} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {p.id_pengaduan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(p.tgl_pengaduan).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{p.siswa.nama_siswa}</div>
                    <div className="text-xs text-gray-500">{p.siswa.kelas}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {p.guru.nama_guru}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        p.status_laporan
                      )}`}
                    >
                      {p.status_laporan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {p.status_laporan === "Menunggu" && !p.tindak_lanjut && (
                        <button
                          onClick={() => openApprovalModal(p)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => openViewModal(p)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(p)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPengaduan.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No pengaduan found
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
                <label className="text-sm font-medium text-gray-500">
                  ID Pengaduan
                </label>
                <p className="text-gray-900">
                  {selectedPengaduan.id_pengaduan}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Tanggal
                </label>
                <p className="text-gray-900">
                  {new Date(selectedPengaduan.tgl_pengaduan).toLocaleDateString(
                    "id-ID"
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Siswa
                </label>
                <p className="text-gray-900">
                  {selectedPengaduan.siswa.nama_siswa}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedPengaduan.siswa.nisn} -{" "}
                  {selectedPengaduan.siswa.kelas}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Guru Pelapor
                </label>
                <p className="text-gray-900">
                  {selectedPengaduan.guru.nama_guru}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedPengaduan.guru.nip}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Status
              </label>
              <p>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    selectedPengaduan.status_laporan
                  )}`}
                >
                  {selectedPengaduan.status_laporan}
                </span>
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Deskripsi Masalah
              </label>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                {selectedPengaduan.deskripsi_masalah}
              </p>
            </div>

            {selectedPengaduan.alasan_penolakan && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <label className="text-sm font-medium text-red-700">
                  Alasan Penolakan
                </label>
                <p className="text-red-900 mt-1">
                  {selectedPengaduan.alasan_penolakan}
                </p>
              </div>
            )}

            {selectedPengaduan.tindak_lanjut && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <label className="text-sm font-medium text-green-700">
                  Tindak Lanjut
                </label>
                <p className="text-sm text-green-800 mt-1">
                  Diproses pada:{" "}
                  {new Date(
                    selectedPengaduan.tindak_lanjut.tgl_proses
                  ).toLocaleDateString("id-ID")}
                </p>
                <p className="text-green-900 mt-2">
                  {selectedPengaduan.tindak_lanjut.catatan_admin}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPengaduan ? "Edit Pengaduan" : "Tambah Pengaduan"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Siswa
              </label>
              <select
                required
                value={formData.id_siswa}
                onChange={(e) =>
                  setFormData({ ...formData, id_siswa: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Pilih Siswa</option>
                {siswa.map((s) => (
                  <option key={s.id_siswa} value={s.id_siswa}>
                    {s.nama_siswa} - {s.kelas}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guru Pelapor
              </label>
              <select
                required
                value={formData.id_guru}
                onChange={(e) =>
                  setFormData({ ...formData, id_guru: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Pilih Guru</option>
                {guru.map((g) => (
                  <option key={g.id_guru} value={g.id_guru}>
                    {g.nama_guru}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Masalah
            </label>
            <textarea
              required
              rows={4}
              value={formData.deskripsi_masalah}
              onChange={(e) =>
                setFormData({ ...formData, deskripsi_masalah: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              required
              value={formData.status_laporan}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status_laporan: e.target.value as any,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Menunggu">Menunggu</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

          {formData.status_laporan === "Ditolak" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alasan Penolakan
              </label>
              <textarea
                required
                rows={3}
                value={formData.alasan_penolakan}
                onChange={(e) =>
                  setFormData({ ...formData, alasan_penolakan: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : selectedPengaduan
                ? "Update"
                : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Approval Modal */}
      {selectedPengaduan && (
        <ApprovalModal
          isOpen={isApprovalModalOpen}
          onClose={() => setIsApprovalModalOpen(false)}
          pengaduanId={selectedPengaduan.id_pengaduan}
          siswaName={selectedPengaduan.siswa.nama_siswa}
          userId={1}
          onSuccess={fetchPengaduan}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Pengaduan"
        message="Are you sure you want to delete this pengaduan? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </AdminLayout>
  );
}

export default function PengaduanPage() {
  return (
    <ToastProvider>
      <PengaduanPageContent />
    </ToastProvider>
  );
}
