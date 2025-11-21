"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ToastProvider, useToast } from "@/components/ui/ToastContainer";
import { Plus, Eye, Pencil, Trash2, Search, FileText } from "lucide-react";

interface Template {
  id_template: number;
  nama_template: string;
  isi_template: string;
  _count?: {
    tindak_lanjut: number;
  };
}

function TemplatePageContent() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [formData, setFormData] = useState({
    nama_template: "",
    isi_template: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/template");
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      showToast("Failed to fetch templates", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = selectedTemplate
        ? `/api/template/${selectedTemplate.id_template}`
        : "/api/template";
      const method = selectedTemplate ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save template");
      }

      showToast(
        selectedTemplate
          ? "Template updated successfully"
          : "Template created successfully",
        "success"
      );
      setIsModalOpen(false);
      fetchTemplates();
      resetForm();
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTemplate) return;

    try {
      const response = await fetch(
        `/api/template/${selectedTemplate.id_template}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete template");
      }

      showToast("Template deleted successfully", "success");
      fetchTemplates();
      setSelectedTemplate(null);
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const openCreateModal = () => {
    resetForm();
    setSelectedTemplate(null);
    setIsModalOpen(true);
  };

  const openEditModal = (template: Template) => {
    setSelectedTemplate(template);
    setFormData({
      nama_template: template.nama_template,
      isi_template: template.isi_template,
    });
    setIsModalOpen(true);
  };

  const openViewModal = (template: Template) => {
    setSelectedTemplate(template);
    setIsViewModalOpen(true);
  };

  const openDeleteDialog = (template: Template) => {
    setSelectedTemplate(template);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ nama_template: "", isi_template: "" });
  };

  const filteredTemplates = templates.filter((t) =>
    t.nama_template.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <LoadingSpinner size="lg" text="Loading templates..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader
        title="Kelola Template Surat"
        subtitle="Manajemen template surat"
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tambah Template
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
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        {/* Grid View */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id_template}
                className="border border-gray-200 rounded-lg p-6 hover:border-pink-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <FileText className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {template.nama_template}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Digunakan {template._count?.tindak_lanjut || 0}x
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {template.isi_template}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openViewModal(template)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => openEditModal(template)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteDialog(template)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No templates found</p>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Preview Template"
        size="lg"
      >
        {selectedTemplate && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Nama Template
              </label>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {selectedTemplate.nama_template}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Isi Template
              </label>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <pre className="text-sm text-gray-900 whitespace-pre-wrap font-sans">
                  {selectedTemplate.isi_template}
                </pre>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-700">
                  Template ini telah digunakan
                </span>
                <span className="text-lg font-bold text-blue-900">
                  {selectedTemplate._count?.tindak_lanjut || 0} kali
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTemplate ? "Edit Template" : "Tambah Template"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Template
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Surat Panggilan Orang Tua"
              value={formData.nama_template}
              onChange={(e) =>
                setFormData({ ...formData, nama_template: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Isi Template
            </label>
            <textarea
              required
              rows={12}
              placeholder="Masukkan isi template surat..."
              value={formData.isi_template}
              onChange={(e) =>
                setFormData({ ...formData, isi_template: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              Tip: Gunakan placeholder seperti [NAMA_SISWA], [KELAS],
              [NAMA_GURU], dll.
            </p>
          </div>

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
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : selectedTemplate
                ? "Update"
                : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Template"
        message={`Are you sure you want to delete template "${selectedTemplate?.nama_template}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </AdminLayout>
  );
}

export default function TemplatePage() {
  return (
    <ToastProvider>
      <TemplatePageContent />
    </ToastProvider>
  );
}
