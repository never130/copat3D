import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Emite un servidor autocontenido en .next/standalone: la imagen Docker
  // final no necesita node_modules ni el código fuente. Ver docs/05.
  output: "standalone",
};

export default nextConfig;
