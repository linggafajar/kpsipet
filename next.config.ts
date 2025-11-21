import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ['whatsapp-web.js', 'qrcode', 'pdfkit'],
  turbopack: {},
};

export default nextConfig;
