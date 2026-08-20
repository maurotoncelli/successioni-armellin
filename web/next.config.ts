import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // sharp 0.35 + Turbopack su Vercel non traccia libvips: ogni pagina con
  // next/image va in 500 (ERR_DLOPEN_FAILED). Webpack + external risolvono.
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
