"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminHeader from "@/components/admin/AdminHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Users,
  GraduationCap,
  UserCheck,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  CheckCheck,
} from "lucide-react";

interface Stats {
  totalUsers: number;
  totalGuru: number;
  totalSiswa: number;
  totalPengaduan: number;
  pengaduanByStatus: {
    menunggu: number;
    disetujui: number;
    ditolak: number;
    selesai: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <LoadingSpinner size="lg" text="Loading dashboard..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader title="Dashboard Admin" />

      <div className="space-y-6">
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Pengguna"
            value={stats?.totalUsers || 0}
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Total Guru"
            value={stats?.totalGuru || 0}
            icon={<GraduationCap className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Total Siswa"
            value={stats?.totalSiswa || 0}
            icon={<UserCheck className="w-6 h-6" />}
            color="purple"
          />
          <StatCard
            title="Total Pengaduan"
            value={stats?.totalPengaduan || 0}
            icon={<FileText className="w-6 h-6" />}
            color="orange"
          />
        </div>

        {/* Pengaduan by Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Status Pengaduan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatusCard
              title="Menunggu"
              value={stats?.pengaduanByStatus.menunggu || 0}
              icon={<Clock className="w-5 h-5" />}
              color="yellow"
            />
            <StatusCard
              title="Disetujui"
              value={stats?.pengaduanByStatus.disetujui || 0}
              icon={<CheckCircle className="w-5 h-5" />}
              color="blue"
            />
            <StatusCard
              title="Ditolak"
              value={stats?.pengaduanByStatus.ditolak || 0}
              icon={<XCircle className="w-5 h-5" />}
              color="red"
            />
            <StatusCard
              title="Selesai"
              value={stats?.pengaduanByStatus.selesai || 0}
              icon={<CheckCheck className="w-5 h-5" />}
              color="green"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ActionButton
              title="Kelola Pengguna"
              description="Tambah atau edit pengguna sistem"
              href="/admin/users"
              color="blue"
            />
            <ActionButton
              title="Kelola Guru"
              description="Manajemen data guru"
              href="/admin/guru"
              color="green"
            />
            <ActionButton
              title="Kelola Siswa"
              description="Manajemen data siswa"
              href="/admin/siswa"
              color="purple"
            />
            <ActionButton
              title="Kelola Pengaduan"
              description="Review dan proses pengaduan"
              href="/admin/pengaduan"
              color="orange"
            />
            <ActionButton
              title="Template Surat"
              description="Kelola template surat"
              href="/admin/template"
              color="pink"
            />
          </div>
        </div>
      </div>
    </AdminLayout>
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
  color: "blue" | "green" | "purple" | "orange";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
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

function StatusCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "yellow" | "blue" | "red" | "green";
}) {
  const colors = {
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    red: "bg-red-50 text-red-600 border-red-200",
    green: "bg-green-50 text-green-600 border-green-200",
  };

  return (
    <div className={`rounded-lg border p-4 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="font-medium">{title}</p>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function ActionButton({
  title,
  description,
  href,
  color,
}: {
  title: string;
  description: string;
  href: string;
  color: "blue" | "green" | "purple" | "orange" | "pink";
}) {
  const colors = {
    blue: "hover:border-blue-300 hover:bg-blue-50",
    green: "hover:border-green-300 hover:bg-green-50",
    purple: "hover:border-purple-300 hover:bg-purple-50",
    orange: "hover:border-orange-300 hover:bg-orange-50",
    pink: "hover:border-pink-300 hover:bg-pink-50",
  };

  return (
    <a
      href={href}
      className={`block p-4 rounded-lg border border-gray-200 transition-all ${colors[color]}`}
    >
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </a>
  );
}
