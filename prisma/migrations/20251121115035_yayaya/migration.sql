/*
  Warnings:

  - The primary key for the `Siswa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Siswa` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `Siswa` table. All the data in the column will be lost.
  - You are about to drop the column `noWaWali` on the `Siswa` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nisn]` on the table `Siswa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `kontak_ortu` to the `Siswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_siswa` to the `Siswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nisn` to the `Siswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'petugas');

-- CreateEnum
CREATE TYPE "StatusLaporan" AS ENUM ('Menunggu', 'Disetujui', 'Ditolak', 'Selesai');

-- AlterTable
ALTER TABLE "Siswa" DROP CONSTRAINT "Siswa_pkey",
DROP COLUMN "id",
DROP COLUMN "nama",
DROP COLUMN "noWaWali",
ADD COLUMN     "id_siswa" SERIAL NOT NULL,
ADD COLUMN     "kontak_ortu" TEXT NOT NULL,
ADD COLUMN     "nama_siswa" TEXT NOT NULL,
ADD COLUMN     "nisn" TEXT NOT NULL,
ADD CONSTRAINT "Siswa_pkey" PRIMARY KEY ("id_siswa");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "id_user" SERIAL NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id_user");

-- CreateTable
CREATE TABLE "Guru" (
    "id_guru" SERIAL NOT NULL,
    "nip" TEXT NOT NULL,
    "nama_guru" TEXT NOT NULL,
    "no_telp" TEXT,

    CONSTRAINT "Guru_pkey" PRIMARY KEY ("id_guru")
);

-- CreateTable
CREATE TABLE "TemplateSurat" (
    "id_template" SERIAL NOT NULL,
    "nama_template" TEXT NOT NULL,
    "isi_template" TEXT NOT NULL,

    CONSTRAINT "TemplateSurat_pkey" PRIMARY KEY ("id_template")
);

-- CreateTable
CREATE TABLE "Pengaduan" (
    "id_pengaduan" SERIAL NOT NULL,
    "id_guru" INTEGER NOT NULL,
    "id_siswa" INTEGER NOT NULL,
    "tgl_pengaduan" TIMESTAMP(3) NOT NULL,
    "deskripsi_masalah" TEXT NOT NULL,
    "status_laporan" "StatusLaporan" NOT NULL,
    "alasan_penolakan" TEXT,

    CONSTRAINT "Pengaduan_pkey" PRIMARY KEY ("id_pengaduan")
);

-- CreateTable
CREATE TABLE "TindakLanjut" (
    "id_tindak_lanjut" SERIAL NOT NULL,
    "id_pengaduan" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_template" INTEGER NOT NULL,
    "tgl_proses" TIMESTAMP(3) NOT NULL,
    "file_surat" TEXT NOT NULL,
    "catatan_admin" TEXT NOT NULL,

    CONSTRAINT "TindakLanjut_pkey" PRIMARY KEY ("id_tindak_lanjut")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guru_nip_key" ON "Guru"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "TindakLanjut_id_pengaduan_key" ON "TindakLanjut"("id_pengaduan");

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_nisn_key" ON "Siswa"("nisn");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Pengaduan" ADD CONSTRAINT "Pengaduan_id_guru_fkey" FOREIGN KEY ("id_guru") REFERENCES "Guru"("id_guru") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengaduan" ADD CONSTRAINT "Pengaduan_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "Siswa"("id_siswa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TindakLanjut" ADD CONSTRAINT "TindakLanjut_id_pengaduan_fkey" FOREIGN KEY ("id_pengaduan") REFERENCES "Pengaduan"("id_pengaduan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TindakLanjut" ADD CONSTRAINT "TindakLanjut_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TindakLanjut" ADD CONSTRAINT "TindakLanjut_id_template_fkey" FOREIGN KEY ("id_template") REFERENCES "TemplateSurat"("id_template") ON DELETE RESTRICT ON UPDATE CASCADE;
