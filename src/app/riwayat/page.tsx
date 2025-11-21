"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import Card from "../components/card";
import CardTable from "../components/cardtabel";
import { FaFileAlt, FaRegCheckCircle, FaClock, FaPlus, FaSearch } from "react-icons/fa";

const dummyData = [
  { id: 1, name: "Lingga Fajar", email: "lingga@example.com", status: "Active" },
  { id: 2, name: "Budi Santoso", email: "budi@example.com", status: "Inactive" },
  { id: 3, name: "Siti Aminah", email: "siti@example.com", status: "Pending" },
];

export default function HomePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data berdasarkan pencarian
  const filteredData = dummyData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-4 px-8 space-y-8">
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

        {/* Input Pencarian */}
        {/* Input Pencarian (posisi tengah) */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Card Table */}
        <CardTable title="User List" data={filteredData} />
      </main>
    </div>
  );
}
