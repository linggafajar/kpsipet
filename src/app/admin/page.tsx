import Sidebar from "../components/sidebar";
import Card from "../components/card";
import CardTable from "../components/cardtabel";
import { FaFileAlt, FaRegCheckCircle, FaClock } from "react-icons/fa";

const dummyData = [
  { id: 1, name: "Lingga Fajar", email: "lingga@example.com", status: "Active" },
  { id: 2, name: "Budi Santoso", email: "budi@example.com", status: "Inactive" },
  { id: 3, name: "Siti Aminah", email: "siti@example.com", status: "Pending" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />

      <main className="ml-64 w-full p-6 space-y-8">
        {/* Render halaman lain */}
        {children}

        {/* Cards */}
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
