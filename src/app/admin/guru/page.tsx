"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import FormInput from "@/components/ui/FormInput";
import { ToastProvider, useToast } from "@/components/ui/ToastContainer";
import { Plus, Pencil, Trash2, Search, GraduationCap, IdCard, Phone, Mail, BookOpen } from "lucide-react";

interface Guru {
  id_guru: number;
  nip: string;
  nama_guru: string;
  no_telp: string | null;
  _count?: {
    pengaduan: number;
  };
}

interface FormErrors {
  nip?: string;
  nama_guru?: string;
  no_telp?: string;
  email?: string;
  mata_pelajaran?: string;
}

function GuruPageContent() {
  const [guru, setGuru] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGuru, setSelectedGuru] = useState<Guru | null>(null);
  const [formData, setFormData] = useState({
    nip: "",
    nama_guru: "",
    no_telp: "",
    email: "",
    mata_pelajaran: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchGuru();
  }, []);

  const fetchGuru = async () => {
    try {
      const response = await fetch("/api/guru");
      const data = await response.json();
      setGuru(data);
    } catch (error) {
      showToast("Failed to fetch guru", "error");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // NIP validation
    if (!formData.nip.trim()) {
      errors.nip = "NIP is required";
    } else if (!/^\d+$/.test(formData.nip)) {
      errors.nip = "NIP must contain only numbers";
    } else if (formData.nip.length < 8) {
      errors.nip = "NIP must be at least 8 digits";
    }

    // Name validation
    if (!formData.nama_guru.trim()) {
      errors.nama_guru = "Teacher name is required";
    } else if (formData.nama_guru.length < 3) {
      errors.nama_guru = "Name must be at least 3 characters";
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.no_telp) {
      const phoneRegex = /^(\+?62|0)[0-9]{9,12}$/;
      if (!phoneRegex.test(formData.no_telp.replace(/[\s-]/g, ""))) {
        errors.no_telp = "Invalid phone number format (e.g., 08123456789)";
      }
    }

    // Email validation (optional but must be valid if provided)
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Invalid email format";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fix the form errors", "error");
      return;
    }

    setSubmitting(true);

    try {
      const url = selectedGuru
        ? `/api/guru/${selectedGuru.id_guru}`
        : "/api/guru";
      const method = selectedGuru ? "PUT" : "POST";

      // Only send fields that the API expects
      const payload = {
        nip: formData.nip,
        nama_guru: formData.nama_guru,
        no_telp: formData.no_telp || null,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save guru");
      }

      showToast(
        selectedGuru
          ? "Guru updated successfully"
          : "Guru created successfully",
        "success"
      );
      setIsModalOpen(false);
      fetchGuru();
      resetForm();
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedGuru) return;

    try {
      const response = await fetch(`/api/guru/${selectedGuru.id_guru}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete guru");
      }

      showToast("Guru deleted successfully", "success");
      fetchGuru();
      setSelectedGuru(null);
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const openCreateModal = () => {
    resetForm();
    setSelectedGuru(null);
    setIsModalOpen(true);
  };

  const openEditModal = (guru: Guru) => {
    setSelectedGuru(guru);
    setFormData({
      nip: guru.nip,
      nama_guru: guru.nama_guru,
      no_telp: guru.no_telp || "",
      email: "",
      mata_pelajaran: "",
    });
    setIsModalOpen(true);
  };

  const openDeleteDialog = (guru: Guru) => {
    setSelectedGuru(guru);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ nip: "", nama_guru: "", no_telp: "", email: "", mata_pelajaran: "" });
    setFormErrors({});
  };

  const filteredGuru = guru.filter(
    (g) =>
      g.nama_guru.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.nip.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <LoadingSpinner size="lg" text="Loading guru..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader
        title="Kelola Guru"
        subtitle="Manajemen data guru"
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tambah Guru
          </button>
        }
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or NIP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
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
                  NIP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Guru
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. Telepon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pengaduan
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGuru.map((g) => (
                <tr key={g.id_guru} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {g.id_guru}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {g.nip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {g.nama_guru}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {g.no_telp || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {g._count?.pengaduan || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(g)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(g)}
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

          {filteredGuru.length === 0 && (
            <div className="text-center py-12 text-gray-500">No guru found</div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedGuru ? "Edit Data Guru" : "Tambah Guru Baru"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Info Banner */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Teacher Information</p>
                <p className="text-green-600">
                  {selectedGuru
                    ? "Update teacher information in the system."
                    : "Add a new teacher to the complaint management system."
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* NIP Field */}
            <div className="relative">
              <FormInput
                label="NIP (Nomor Induk Pegawai)"
                type="text"
                required
                value={formData.nip}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, nip: value });
                  setFormErrors({ ...formErrors, nip: undefined });
                }}
                error={formErrors.nip}
                helperText="Minimum 8 digits, numbers only"
                placeholder="e.g., 197012151998021001"
                maxLength={18}
              />
              <IdCard className="absolute right-4 top-10 w-5 h-5 text-gray-400" />
            </div>

            {/* Name Field */}
            <div className="relative">
              <FormInput
                label="Nama Lengkap Guru"
                type="text"
                required
                value={formData.nama_guru}
                onChange={(e) => {
                  setFormData({ ...formData, nama_guru: e.target.value });
                  setFormErrors({ ...formErrors, nama_guru: undefined });
                }}
                error={formErrors.nama_guru}
                helperText="Full name as per official records"
                placeholder="e.g., Dr. Ahmad Sulaiman, S.Pd., M.Pd."
                maxLength={100}
              />
              <GraduationCap className="absolute right-4 top-10 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Phone Field */}
            <div className="relative">
              <FormInput
                label="No. Telepon"
                type="tel"
                value={formData.no_telp}
                onChange={(e) => {
                  setFormData({ ...formData, no_telp: e.target.value });
                  setFormErrors({ ...formErrors, no_telp: undefined });
                }}
                error={formErrors.no_telp}
                helperText="Mobile phone number (optional)"
                placeholder="e.g., 08123456789"
                maxLength={15}
              />
              <Phone className="absolute right-4 top-10 w-5 h-5 text-gray-400" />
            </div>

            {/* Email Field */}
            <div className="relative">
              <FormInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setFormErrors({ ...formErrors, email: undefined });
                }}
                error={formErrors.email}
                helperText="Email address (optional)"
                placeholder="e.g., ahmad.sulaiman@school.sch.id"
                maxLength={100}
              />
              <Mail className="absolute right-4 top-10 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Subject Field */}
          <div className="relative">
            <FormInput
              label="Mata Pelajaran"
              type="text"
              value={formData.mata_pelajaran}
              onChange={(e) => {
                setFormData({ ...formData, mata_pelajaran: e.target.value });
                setFormErrors({ ...formErrors, mata_pelajaran: undefined });
              }}
              error={formErrors.mata_pelajaran}
              helperText="Primary subject taught (optional)"
              placeholder="e.g., Matematika, Bahasa Indonesia, Fisika"
              maxLength={50}
            />
            <BookOpen className="absolute right-4 top-10 w-5 h-5 text-gray-400" />
          </div>

          {/* Note */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              <strong>Note:</strong> Fields marked with <span className="text-red-500">*</span> are required.
              Email and phone fields are optional but recommended for better communication.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{selectedGuru ? "Update Teacher" : "Add Teacher"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Guru"
        message={`Are you sure you want to delete guru "${selectedGuru?.nama_guru}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </AdminLayout>
  );
}

export default function GuruPage() {
  return (
    <ToastProvider>
      <GuruPageContent />
    </ToastProvider>
  );
}
