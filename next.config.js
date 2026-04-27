/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  generateEtags: true,

  typescript: {
    // TODO: arreglar type errors y remover esto
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@nextui-org/react': path.resolve(__dirname, 'lib/nextui-stubs.ts'),
    };
    return config;
  },
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  
  async rewrites() {
    return {
      beforeFiles: [],
    }
  },
  
  async redirects() {
    return []
  }
}

module.exports = nextConfig
