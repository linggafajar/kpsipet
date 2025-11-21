"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { CheckCircle, AlertCircle } from "lucide-react";

interface Template {
  id_template: number;
  nama_template: string;
  isi_template: string;
}

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  pengaduanId: number;
  siswaName: string;
  onSuccess: () => void;
  userId: number;
}

export default function ApprovalModal({
  isOpen,
  onClose,
  pengaduanId,
  siswaName,
  onSuccess,
  userId,
}: ApprovalModalProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [catatanAdmin, setCatatanAdmin] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [whatsappStatus, setWhatsappStatus] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
      checkWhatsAppStatus();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/template");
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkWhatsAppStatus = async () => {
    try {
      const response = await fetch("/api/whatsapp/status");
      const data = await response.json();
      setWhatsappStatus(data);
    } catch (error) {
      console.error("Failed to check WhatsApp status:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedTemplate) {
      setError("Please select a template");
      return;
    }

    if (!catatanAdmin.trim()) {
      setError("Please provide admin notes");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/tindak-lanjut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_pengaduan: pengaduanId,
          id_user: userId,
          id_template: parseInt(selectedTemplate),
          catatan_admin: catatanAdmin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to approve pengaduan");
      }

      // Show success message with WhatsApp info
      let message = "Pengaduan approved successfully!";
      if (data.whatsapp?.sent) {
        message += " WhatsApp notification sent to parent.";
      } else if (data.whatsapp?.error) {
        message += ` Note: ${data.whatsapp.error}`;
      }

      alert(message);
      onSuccess();
      onClose();
      resetForm();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedTemplate("");
    setCatatanAdmin("");
    setError("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Approve Pengaduan"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* WhatsApp Status Warning */}
        {whatsappStatus && !whatsappStatus.ready && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-yellow-800">
                WhatsApp Not Connected
              </p>
              <p className="text-yellow-700 mt-1">
                WhatsApp auto-send is disabled. Please connect WhatsApp in
                settings to enable automatic notifications.
              </p>
            </div>
          </div>
        )}

        {whatsappStatus && whatsappStatus.ready && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-green-800">WhatsApp Connected</p>
              <p className="text-green-700 mt-1">
                PDF notification will be automatically sent to parent via
                WhatsApp.
              </p>
            </div>
          </div>
        )}

        {/* Student Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Approving complaint for:</p>
          <p className="text-lg font-semibold text-gray-900">{siswaName}</p>
        </div>

        {/* Template Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Letter Template <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={loading}
          >
            <option value="">
              {loading ? "Loading templates..." : "Pilih Template"}
            </option>
            {templates.map((template) => (
              <option key={template.id_template} value={template.id_template}>
                {template.nama_template}
              </option>
            ))}
          </select>
        </div>

        {/* Admin Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin Notes / Follow-up Actions{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={catatanAdmin}
            onChange={(e) => setCatatanAdmin(e.target.value)}
            placeholder="Enter follow-up actions, sanctions, or additional notes..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be included in the PDF sent to parents
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {submitting ? "Approving..." : "Approve & Send"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
