import { Header } from '@/app/(public)/(home)/_components/header'
import { Footer } from '@/app/(public)/(home)/_components/footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      <Header />
      {children}
      <Footer />
    </section>
  )
}
