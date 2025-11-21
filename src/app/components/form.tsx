"use client";

import { useState } from "react";

export default function FormPengaduan() {
  const [formData, setFormData] = useState({
    nama: "",
    kelas: "",
    noWa: "",
    pengaduan: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Data dikirim:", formData);
    alert("Pengaduan berhasil dikirim!");
  };

  return (
    // 🔹 Background abu-abu memenuhi seluruh layar
    <div className="min-h-screen  bg-gray-100 flex items-center justify-center py-20 px-20">
      {/* 🔹 Kotak Form */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        {/* Header Form */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#3b8190]">Form Pengaduan Siswa</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Silakan isi form di bawah ini dengan lengkap dan jelas untuk menyampaikan pengaduan Anda.
          </p>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nama Siswa</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Masukkan nama siswa"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3b8190]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Kelas</label>
            <input
              type="text"
              name="kelas"
              value={formData.kelas}
              onChange={handleChange}
              placeholder="Contoh: X IPA 2"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3b8190]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">No. WA Orang Tua</label>
            <input
              type="tel"
              name="noWa"
              value={formData.noWa}
              onChange={handleChange}
              placeholder="Masukkan nomor WhatsApp orang tua"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3b8190]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Isi Pengaduan</label>
            <textarea
              name="pengaduan"
              value={formData.pengaduan}
              onChange={handleChange}
              placeholder="Tuliskan isi pengaduan Anda di sini..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#3b8190]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#3b8190] hover:bg-[#336f7b] text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Kirim Pengaduan
          </button>
        </form>
      </div>
    </div>
  );
}
