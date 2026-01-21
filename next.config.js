/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Configuración para mejor performance
  compress: true,
  generateEtags: true,
  
  // Webpack configuration to ignore problematic directories
  webpack: (config, { isServer }) => {
    // Ignore System Volume Information and other Windows system directories
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/.next/**',
        '**/.git/**',
        '**/System Volume Information/**',
        '**/$RECYCLE.BIN/**',
        '**/.vscode/**',
        '**/dist/**',
      ],
    };
    return config;
  },
  
  // CORS y headers de seguridad
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
  
  // Rewrites para API
  async rewrites() {
    return {
      beforeFiles: [],
    }
  },
  
  // Redireccionamientos si es necesario
  async redirects() {
    return []
  }
}

module.exports = nextConfig
