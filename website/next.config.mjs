/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'node:url'

const turbopackRoot = fileURLToPath(new URL('.', import.meta.url))

const nextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost', 'www.example.com', 'example.com'],
  turbopack: {
    root: turbopackRoot,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'http', hostname: '127.0.0.1', port: '8000', pathname: '/media/**' },
      { protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/media/**' },
      { protocol: 'https', hostname: 'api.example.com', pathname: '/media/**' },
      { protocol: 'https', hostname: 'www.example.com', pathname: '/media/**' },
    ],
  },
}

export default nextConfig
