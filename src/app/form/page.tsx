"use client";

import Navbar from "../components/navbar";
import FormPengaduan from "../components/form";

export default function FormPengaduanPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Selalu di Atas */}
      <Navbar />

      <main>
        <FormPengaduan />
      </main>
    </div>
  );
}
  