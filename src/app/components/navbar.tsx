"use client";

import { usePathname, useRouter } from "next/navigation";
import { FaSchool } from "react-icons/fa";
import Button from "../components/button";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => router.back();
  const handleLogout = () => router.push("/");

  // Cek jika sedang di dashboard
  const isDashboard = pathname === "/dashboard";

  // Tentukan nama halaman berdasarkan path
  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/form":
        return "Form Pengaduan";
      case "/riwayat":
        return "Riwayat Pengaduan";
      default:
        return "Halaman Lain";
    }
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md flex justify-between items-center text-white">
      {/* Kiri: Logo dan Nama Sekolah */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => router.push("/dashboard")}
      >
        <FaSchool className="text-3xl text-white" />
        <div className="flex flex-col leading-tight">
          {/* Nama halaman */}
          <span className="text-base font-bold">{getPageTitle()}</span>
          {/* Keterangan sistem */}
          <span className="text-xs font-light opacity-90">
            SMP Nusantara | Sistem Pengaduan
          </span>
        </div>
      </div>

      {/* Kanan: Tombol Aksi */}
      {isDashboard ? (
        <Button variant="white-blue" size="md" onClick={handleLogout}>
          Keluar
        </Button>
      ) : (
        <Button variant="white-blue" size="md" onClick={handleBack}>
          Kembali
        </Button>
      )}
    </nav>
  );
}
