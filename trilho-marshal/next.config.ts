import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações de turbopack
  turbopack: {
    root: __dirname,
  },
  
  // Configurações de produção
  // output: 'standalone', // Comentado para evitar conflitos com npm start
  poweredByHeader: false, // Remove header X-Powered-By
  compress: true, // Ativa compressão gzip
  
  // Configurações de build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configurações de performance
  experimental: {
    optimizeCss: true, // Otimiza CSS
  },
  
  // Configurações de imagens
  images: {
    unoptimized: false, // Ativa otimização de imagens
    formats: ['image/webp', 'image/avif'], // Formatos modernos
  },
  
  // Configurações de headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
