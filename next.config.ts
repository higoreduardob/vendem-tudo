import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: [
      'example.com',
      'placehold.co',
      'hebbkx1anhila5yf.public.blob.vercel-storage.com',
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy:
      "default-src 'self'; img-src *; media-src *; script-src 'none'; sandbox;", // Reforça a segurança
  },
}

export default nextConfig
