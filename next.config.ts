// next.config.js
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: [
      'example.com',
      'placehold.co',
      'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      'res.cloudinary.com',
      'cloudinary.com',
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy:
      "default-src 'self'; img-src *; media-src *; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig
