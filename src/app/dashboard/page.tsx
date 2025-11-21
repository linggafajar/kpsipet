"use client";

import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import Button from "../components/button";
import Card from "../components/card";
import CardTable from "../components/cardtabel";
import { FaFileAlt, FaRegCheckCircle, FaClock, FaPlus } from "react-icons/fa";

const dummyData = [
  { id: 1, name: "Lingga Fajar", email: "lingga@example.com", status: "Active" },
  { id: 2, name: "Budi Santoso", email: "budi@example.com", status: "Inactive" },
  { id: 3, name: "Siti Aminah", email: "siti@example.com", status: "Pending" },
];

export default function HomePage() {
  const router = useRouter();

  // Fungsi untuk menuju ke halaman form
  const handleCreateReport = () => {
    router.push("/form");
// arahkan ke page formpengaduan
  };

  const handleViewHistory = () => {
    router.push("/riwayat");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-4 px-8 space-y-8">
        {/* Tombol Aksi */}
        <div className="flex space-x-4 -mt-2">
          <Button
            variant="blue"
            size="md"
            className="flex items-center gap-2"
            onClick={handleCreateReport}
          >
            <FaPlus />
            Buat Pengaduan Baru
          </Button>

          <Button variant="white-black" size="md" className="flex items-center gap-2" onClick={handleViewHistory}>
            <FaFileAlt />
            Lihat Riwayat Lengkap
          </Button>
        </div>

        {/* Card Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card
            title="Pengguna"
            value={120}
            icon={<FaFileAlt />}
            borderColor="blue"
          />
          <Card
            title="Pesanan"
            value={75}
            icon={<FaRegCheckCircle />}
            borderColor="green"
            iconColor="green"
          />
          <Card
            title="Pendapatan"
            value={5000}
            icon={<FaClock />}
            borderColor="yellow"
            iconColor="yellow"
          />
        </div>

        {/* Card Table */}
        <CardTable title="User List" data={dummyData} />
      </main>
    </div>
  );
}
