import { Faq } from '@/app/(public)/(home)/_components/faq'
import { Cta } from '@/app/(public)/(home)/_components/cta'
import { Hero } from '@/app/(public)/(home)/_components/hero'

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Faq />
      <Cta />
    </div>
  )
}
