/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // 避免使用需要原生编译的模块
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
      }
    }
    
    config.externals = [
      ...(config.externals || []),
      'pg',
      'pg-native',
      'pg-hstore',
      'sqlite3',
      'mysql',
      'mysql2',
      'oracledb',
      'tedious',
      'libpq',
      'better-sqlite3',
      'mongodb-client-encryption'
    ]
    
    return config
  }
}

export default nextConfig
