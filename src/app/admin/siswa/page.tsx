"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import { ToastProvider, useToast } from "@/components/ui/ToastContainer";
import { Plus, Pencil, Trash2, Search, Filter, Users, IdCard, Phone, Home, Mail } from "lucide-react";

interface Siswa {
  id_siswa: number;
  nisn: string;
  nama_siswa: string;
  kelas: string;
  kontak_ortu: string;
  _count?: {
    pengaduan: number;
  };
}

interface FormErrors {
  nisn?: string;
  nama_siswa?: string;
  kelas?: string;
  kontak_ortu?: string;
  alamat?: string;
  email?: string;
  nama_ortu?: string;
}

function SiswaPageContent() {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [kelasFilter, setKelasFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);
  const [formData, setFormData] = useState({
    nisn: "",
    nama_siswa: "",
    kelas: "",
    kontak_ortu: "",
    alamat: "",
    email: "",
    nama_ortu: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchSiswa();
  }, []);

  const fetchSiswa = async () => {
    try {
      const response = await fetch("/api/siswa");
      const data = await response.json();
      setSiswa(data);
    } catch (error) {
      showToast("Failed to fetch siswa", "error");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // NISN validation
    if (!formData.nisn.trim()) {
      errors.nisn = "NISN is required";
    } else if (!/^\d+$/.test(formData.nisn)) {
      errors.nisn = "NISN must contain only numbers";
    } else if (formData.nisn.length !== 10) {
      errors.nisn = "NISN must be exactly 10 digits";
    }

    // Name validation
    if (!formData.nama_siswa.trim()) {
      errors.nama_siswa = "Student name is required";
    } else if (formData.nama_siswa.length < 3) {
      errors.nama_siswa = "Name must be at least 3 characters";
    }

    // Class validation
    if (!formData.kelas.trim()) {
      errors.kelas = "Class is required";
    }

    // Parent contact validation
    if (!formData.kontak_ortu.trim()) {
      errors.kontak_ortu = "Parent contact is required";
    } else {
      const phoneRegex = /^(\+?62|0)[0-9]{9,12}$/;
      if (!phoneRegex.test(formData.kontak_ortu.replace(/[\s-]/g, ""))) {
        errors.kontak_ortu = "Invalid phone number format (e.g., 08123456789)";
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
      const url = selectedSiswa
        ? `/api/siswa/${selectedSiswa.id_siswa}`
        : "/api/siswa";
      const method = selectedSiswa ? "PUT" : "POST";

      // Only send fields that the API expects
      const payload = {
        nisn: formData.nisn,
        nama_siswa: formData.nama_siswa,
        kelas: formData.kelas,
        kontak_ortu: formData.kontak_ortu,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save siswa");
      }

      showToast(
        selectedSiswa
          ? "Siswa updated successfully"
          : "Siswa created successfully",
        "success"
      );
      setIsModalOpen(false);
      fetchSiswa();
      resetForm();
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSiswa) return;

    try {
      const response = await fetch(`/api/siswa/${selectedSiswa.id_siswa}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete siswa");
      }

      showToast("Siswa deleted successfully", "success");
      fetchSiswa();
      setSelectedSiswa(null);
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const openCreateModal = () => {
    resetForm();
    setSelectedSiswa(null);
    setIsModalOpen(true);
  };

  const openEditModal = (siswa: Siswa) => {
    setSelectedSiswa(siswa);
    setFormData({
      nisn: siswa.nisn,
      nama_siswa: siswa.nama_siswa,
      kelas: siswa.kelas,
      kontak_ortu: siswa.kontak_ortu,
      alamat: "",
      email: "",
      nama_ortu: "",
    });
    setIsModalOpen(true);
  };

  const openDeleteDialog = (siswa: Siswa) => {
    setSelectedSiswa(siswa);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ nisn: "", nama_siswa: "", kelas: "", kontak_ortu: "", alamat: "", email: "", nama_ortu: "" });
    setFormErrors({});
  };

  const filteredSiswa = siswa.filter(
    (s) =>
      (s.nama_siswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nisn.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (kelasFilter === "" || s.kelas === kelasFilter)
  );

  const uniqueKelas = Array.from(new Set(siswa.map((s) => s.kelas))).sort();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <LoadingSpinner size="lg" text="Loading siswa..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader
        title="Kelola Siswa"
        subtitle="Manajemen data siswa"
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tambah Siswa
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
                placeholder="Search by name or NISN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={kelasFilter}
                onChange={(e) => setKelasFilter(e.target.value)}
                className="w-full md:w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Kelas</option>
                {uniqueKelas.map((kelas) => (
                  <option key={kelas} value={kelas}>
                    {kelas}
                  </option>
                ))}
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
                  NISN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Siswa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kelas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontak Ortu
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
              {filteredSiswa.map((s) => (
                <tr key={s.id_siswa} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {s.id_siswa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {s.nisn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {s.nama_siswa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      {s.kelas}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {s.kontak_ortu}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {s._count?.pengaduan || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(s)}
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

          {filteredSiswa.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No siswa found
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedSiswa ? "Edit Data Siswa" : "Tambah Siswa Baru"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Info Banner */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-purple-800">
                <p className="font-medium mb-1">Student Information</p>
                <p className="text-purple-600">
                  {selectedSiswa
                    ? "Update student information in the system."
                    : "Register a new student in the complaint management system."
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Student Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b pb-2">
              Student Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* NISN Field */}
              <div className="relative">
                <FormInput
                  label="NISN (Nomor Induk Siswa Nasional)"
                  type="text"
                  required
                  value={formData.nisn}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, nisn: value });
                    setFormErrors({ ...formErrors, nisn: undefined });
                  }}
                  error={formErrors.nisn}
                  helperText="10-digit national student number"
                  placeholder="e.g., 0012345678"
                  maxLength={10}
                />
                <IdCard className="absolute right-4 top-10 w-5 h-5 text-gray-400" />
              </div>

              {/* Name Field */}
              <div className="relative">
                <FormInput
                  label="Nama Lengkap Siswa"
                  type="text"
                  required
                  value={formData.nama_siswa}
                  onChange={(e) => {
                    setFormData({ ...formData, nama_siswa: e.target.value });
                    setFormErrors({ ...formErrors, nama_siswa: undefined });
                  }}
                  error={formErrors.nama_siswa}
                  helperText="Full name as per official records"
                  placeholder="e.g., Ahmad Zaki Ramadhan"
                  maxLength={100}
                />
                <Users className="absolute right-4 top-10 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Class Field */}
              <FormSelect
                label="Kelas"
                required
                value={formData.kelas}
                onChange={(e) => {
                  setFormData({ ...formData, kelas: e.target.value });
                  setFormErrors({ ...formErrors, kelas: undefined });
                }}
                error={formErrors.kelas}
                helperText="Current class/grade"
                options={[
                  { value: "", label: "Pilih Kelas" },
                  { value: "X IPA 1", label: "X IPA 1" },
                  { value: "X IPA 2", label: "X IPA 2" },
                  { value: "X IPS 1", label: "X IPS 1" },
                  { value: "X IPS 2", label: "X IPS 2" },
                  { value: "XI IPA 1", label: "XI IPA 1" },
                  { value: "XI IPA 2", label: "XI IPA 2" },
                  { value: "XI IPS 1", label: "XI IPS 1" },
                  { value: "XI IPS 2", label: "XI IPS 2" },
                  { value: "XII IPA 1", label: "XII IPA 1" },
                  { value: "XII IPA 2", label: "XII IPA 2" },
                  { value: "XII IPS 1", label: "XII IPS 1" },
                  { value: "XII IPS 2", label: "XII IPS 2" },
                ]}
              />

              {/* Email Field */}
              <div className="relative">
                <FormInput
                  label="Email Siswa"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setFormErrors({ ...formErrors, email: undefined });
                  }}
                  error={formErrors.email}
                  helperText="Student email address (optional)"
                  placeholder="e.g., ahmad.zaki@student.sch.id"
                  maxLength={100}
                />
                <Mail className="absolute right-4 top-10 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Parent/Guardian Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b pb-2">
              Parent/Guardian Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Parent Name Field */}
              <div className="relative">
                <FormInput
                  label="Nama Orang Tua/Wali"
                  type="text"
                  value={formData.nama_ortu}
                  onChange={(e) => {
                    setFormData({ ...formData, nama_ortu: e.target.value });
                    setFormErrors({ ...formErrors, nama_ortu: undefined });
                  }}
                  helperText="Full name of parent/guardian (optional)"
                  placeholder="e.g., Budi Santoso"
                  maxLength={100}
                />
                <Users className="absolute right-4 top-10 w-5 h-5 text-gray-400" />
              </div>

              {/* Parent Contact Field */}
              <div className="relative">
                <FormInput
                  label="Kontak Orang Tua/Wali"
                  type="tel"
                  required
                  value={formData.kontak_ortu}
                  onChange={(e) => {
                    setFormData({ ...formData, kontak_ortu: e.target.value });
                    setFormErrors({ ...formErrors, kontak_ortu: undefined });
                  }}
                  error={formErrors.kontak_ortu}
                  helperText="Mobile phone number for emergency contact"
                  placeholder="e.g., 08123456789"
                  maxLength={15}
                />
                <Phone className="absolute right-4 top-10 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Address Field */}
            <div className="relative">
              <FormInput
                label="Alamat Tempat Tinggal"
                type="text"
                value={formData.alamat}
                onChange={(e) => {
                  setFormData({ ...formData, alamat: e.target.value });
                  setFormErrors({ ...formErrors, alamat: undefined });
                }}
                helperText="Home address (optional)"
                placeholder="e.g., Jl. Sudirman No. 123, Jakarta Pusat"
                maxLength={200}
              />
              <Home className="absolute right-4 top-10 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Note */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              <strong>Note:</strong> Fields marked with <span className="text-red-500">*</span> are required.
              NISN must be exactly 10 digits. Parent contact is required for emergency communication.
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
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{selectedSiswa ? "Update Student" : "Register Student"}</span>
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
        title="Delete Siswa"
        message={`Are you sure you want to delete siswa "${selectedSiswa?.nama_siswa}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </AdminLayout>
  );
}

export default function SiswaPage() {
  return (
    <ToastProvider>
      <SiswaPageContent />
    </ToastProvider>
  );
}
