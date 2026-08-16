import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // "standalone" es solo para el Dockerfile: emite un servidor
  // autocontenido en .next/standalone para que la imagen final no necesite
  // node_modules ni el código fuente (ver docs/05).
  //
  // ⚠️ En Vercel NO va: Vercel tiene su propio empaquetado serverless y
  // "standalone" lo pisa — el build compila y genera las páginas sin error,
  // pero el deploy falla después, en el paso de empaquetado. Por eso queda
  // condicionado a una variable que solo se define en el Dockerfile.
  output: process.env.DOCKER_BUILD ? "standalone" : undefined,
};

export default nextConfig;
