"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminHeader from "@/components/admin/AdminHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ToastProvider, useToast } from "@/components/ui/ToastContainer";
import { Smartphone, QrCode, Check, X, RefreshCw, LogOut } from "lucide-react";

interface WhatsAppStatus {
  ready: boolean;
  initializing: boolean;
  hasQR: boolean;
  status: string;
  qrCode?: string;
}

function WhatsAppSettingsContent() {
  const [status, setStatus] = useState<WhatsAppStatus>({
    ready: false,
    initializing: false,
    hasQR: false,
    status: "disconnected",
  });
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    checkStatus();
    // Poll status every 3 seconds
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const response = await fetch("/api/whatsapp/init");
      const data = await response.json();

      setStatus({
        ready: data.ready || false,
        initializing: data.initializing || false,
        hasQR: data.hasQR || false,
        status: data.status || "disconnected",
        qrCode: data.qrCode || undefined,
      });
    } catch (error) {
      console.error("Error checking status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const response = await fetch("/api/whatsapp/init", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize WhatsApp");
      }

      showToast("Initializing WhatsApp... Please scan QR code", "success");

      // Start polling for QR code and status
      const pollInterval = setInterval(async () => {
        await checkStatus();
      }, 2000);

      // Stop polling after 60 seconds
      setTimeout(() => {
        clearInterval(pollInterval);
      }, 60000);
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect WhatsApp?")) {
      return;
    }

    setDisconnecting(true);
    try {
      const response = await fetch("/api/whatsapp/disconnect", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to disconnect WhatsApp");
      }

      showToast("WhatsApp disconnected successfully", "success");
      checkStatus();
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setDisconnecting(false);
    }
  };

  const getStatusBadge = () => {
    if (status.ready) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          <Check className="w-4 h-4" />
          Connected
        </span>
      );
    } else if (status.initializing) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Connecting...
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          <X className="w-4 h-4" />
          Disconnected
        </span>
      );
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <LoadingSpinner size="lg" text="Loading WhatsApp settings..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader
        title="WhatsApp Settings"
        subtitle="Kelola koneksi WhatsApp untuk pengiriman otomatis"
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Smartphone className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  WhatsApp Connection Status
                </h3>
                <p className="text-sm text-gray-600">
                  Status koneksi WhatsApp Web
                </p>
              </div>
            </div>
            {getStatusBadge()}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {status.status}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Connection</p>
                <p className="text-lg font-semibold text-gray-900">
                  {status.ready ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Auto-Send</p>
                <p className="text-lg font-semibold text-gray-900">
                  {status.ready ? "Enabled" : "Disabled"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!status.ready && !status.initializing && (
                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Smartphone className="w-5 h-5" />
                  {connecting ? "Connecting..." : "Connect WhatsApp"}
                </button>
              )}

              {status.ready && (
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="w-5 h-5" />
                  {disconnecting ? "Disconnecting..." : "Disconnect"}
                </button>
              )}

              <button
                onClick={checkStatus}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh Status
              </button>
            </div>
          </div>
        </div>

        {/* QR Code Card */}
        {(status.initializing || status.hasQR) && !status.ready && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <QrCode className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Scan QR Code
                </h3>
                <p className="text-sm text-gray-600">
                  Scan dengan WhatsApp di smartphone Anda
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              {status.qrCode ? (
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-white border-2 border-gray-300 rounded-lg mb-4">
                    <img
                      src={status.qrCode}
                      alt="WhatsApp QR Code"
                      className="w-64 h-64"
                    />
                  </div>
                  <div className="text-center max-w-md">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Cara Scan QR Code:
                    </h4>
                    <ol className="text-sm text-gray-600 text-left space-y-2">
                      <li>1. Buka WhatsApp di smartphone Anda</li>
                      <li>2. Tap Menu atau Settings</li>
                      <li>
                        3. Pilih "Linked Devices" atau "Perangkat Tertaut"
                      </li>
                      <li>4. Tap "Link a Device" atau "Tautkan Perangkat"</li>
                      <li>5. Arahkan kamera ke QR code di atas</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-3 animate-spin" />
                  <p className="text-gray-600">Generating QR Code...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="font-semibold text-blue-900 mb-3">
            Informasi Penting
          </h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                WhatsApp harus terhubung agar pengiriman otomatis dapat berfungsi
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Sesi WhatsApp akan tersimpan, Anda tidak perlu scan QR setiap
                kali
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Ketika pengaduan disetujui, PDF akan otomatis dikirim ke nomor
                orang tua siswa
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Pastikan nomor WhatsApp orang tua siswa sudah terdaftar dengan
                benar
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Jangan logout dari WhatsApp di smartphone Anda saat menggunakan
                fitur ini
              </span>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function WhatsAppSettingsPage() {
  return (
    <ToastProvider>
      <WhatsAppSettingsContent />
    </ToastProvider>
  );
}
