"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GuruLayout from "@/components/guru/GuruLayout";
import GuruHeader from "@/components/guru/GuruHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FileText, Clock, CheckCircle, XCircle, Plus, Eye } from "lucide-react";

interface Pengaduan {
  id_pengaduan: number;
  tgl_pengaduan: string;
  deskripsi_masalah: string;
  status_laporan: "Menunggu" | "Disetujui" | "Ditolak" | "Selesai";
  siswa: {
    nama_siswa: string;
    kelas: string;
  };
}

export default function GuruDashboard() {
  const router = useRouter();
  const [pengaduan, setPengaduan] = useState<Pengaduan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPengaduan();
  }, []);

  const fetchPengaduan = async () => {
    try {
      // Simulasi fetch - nanti ganti dengan API real yang filter by guru
      const response = await fetch("/api/pengaduan");
      const data = await response.json();
      // Ambil 5 pengaduan terakhir saja
      setPengaduan(data.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch pengaduan:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: pengaduan.length,
    menunggu: pengaduan.filter((p) => p.status_laporan === "Menunggu").length,
    disetujui: pengaduan.filter((p) => p.status_laporan === "Disetujui").length,
    selesai: pengaduan.filter((p) => p.status_laporan === "Selesai").length,
  };

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
      <GuruLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <LoadingSpinner size="lg" text="Loading dashboard..." />
        </div>
      </GuruLayout>
    );
  }

  return (
    <GuruLayout>
      <GuruHeader
        title="Dashboard Guru"
        subtitle="Selamat datang di portal pengaduan siswa"
        action={
          <button
            onClick={() => router.push("/guru/pengaduan")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Buat Pengaduan Baru
          </button>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Pengaduan"
          value={stats.total}
          icon={<FileText className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Menunggu"
          value={stats.menunggu}
          icon={<Clock className="w-6 h-6" />}
          color="yellow"
        />
        <StatCard
          title="Disetujui"
          value={stats.disetujui}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="Selesai"
          value={stats.selesai}
          icon={<CheckCircle className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* Recent Pengaduan */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Pengaduan Terakhir
            </h3>
            <p className="text-sm text-gray-600">
              Daftar pengaduan yang baru dibuat
            </p>
          </div>
          <button
            onClick={() => router.push("/guru/riwayat")}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Lihat Semua →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
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
              {pengaduan.map((p) => (
                <tr key={p.id_pengaduan} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(p.tgl_pengaduan).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{p.siswa.nama_siswa}</div>
                    <div className="text-xs text-gray-500">{p.siswa.kelas}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs truncate">
                      {p.deskripsi_masalah}
                    </div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => router.push("/guru/riwayat")}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pengaduan.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Belum ada pengaduan</p>
              <button
                onClick={() => router.push("/guru/pengaduan")}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Buat Pengaduan Pertama
              </button>
            </div>
          )}
        </div>
      </div>
    </GuruLayout>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "yellow" | "green" | "purple";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  );
}
