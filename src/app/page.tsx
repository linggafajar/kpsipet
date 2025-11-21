"use client";

import { useState } from "react";
import { FaUserAlt, FaLock, FaSchool } from "react-icons/fa";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Login sebagai: ${username}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-blue-500 text-gray-800">
      {/* Logo dan Judul */}
      <div className="flex flex-col items-center mb-6">
        <div className="bg-white bg-opacity-20 p-4 rounded-full mb-4">
          <FaSchool className="text-4xl text-white" />
        </div>
        <h1 className="text-white text-2xl font-semibold">
          Sistem Informasi Pengaduan
        </h1>
        <p className="text-white text-lg">SMP Nusantara</p>
      </div>

      {/* Kartu Login */}
      <div className="bg-white w-96 p-8 rounded-2xl shadow-lg">
        <h2 className="text-lg font-semibold mb-1 text-gray-800">Login Admin</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Masukkan kredensial admin untuk mengakses sistem
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <FaUserAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Masukkan username"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Label: Input username admin</p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                placeholder="Masukkan password"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Label: Input password admin</p>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-all"
          >
            Masuk ke Sistem
          </button>
          <p className="text-xs text-gray-400 text-center">
            Label: Tombol submit login
          </p>
        </form>

        {/* Demo Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mt-6 text-sm text-blue-700">
          <span className="font-semibold">Demo:</span> Gunakan username dan password apa saja untuk login
        </div>
      </div>

      {/* Footer */}
      <footer className="text-white text-xs mt-6">
        © 2025 SMP Nusantara. All rights reserved.
      </footer>
    </main>
  );
}
