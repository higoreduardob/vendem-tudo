import { Navbar } from '@/app/(public)/_components/navbar'
import { Footer } from '@/app/(public)/_components/footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
