import Link from 'next/link'
import { AlertCircle, Home, RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Navbar } from '@/app/(public)/_components/navbar'
import { Footer } from '@/app/(public)/_components/footer'

export const WrapperError = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-117px)] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-8">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="h-12 w-12 text-white" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
            <p className="text-lg text-gray-600">{description}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="default"
              size="lg"
              onClick={() => window.location.reload()}
              className="min-w-[200px]"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[200px]"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Retornar a página inicial
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
