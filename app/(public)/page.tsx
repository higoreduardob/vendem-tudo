import Hero from '@/app/(public)/_components/hero'
import { SparklesCore } from '@/app/(public)/_components/sparkles'

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-117px)] bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Ambient background with moving particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={80}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <div className="relative z-10">
        <Hero />
      </div>
    </main>
  )
}
