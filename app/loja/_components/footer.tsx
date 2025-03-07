'use client'

import { useOpenStore } from '@/hooks/use-store'

export const Footer = () => {
  const { store } = useOpenStore()

  return (
    <footer className="bg-red-700 py-6 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-bold">{store?.name}</h3>
            <p className="text-red-100">
              Os melhores pratos entregues na sua casa com rapidez e qualidade.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Horário de Funcionamento</h3>
            <p className="text-red-100">Segunda a Domingo: 11h às 23h</p>
            
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Contato</h3>
            <p className="text-red-100">{store?.email}</p>
            <p className="text-red-100">{store?.whatsApp}</p>
          </div>
        </div>
        <div className="mt-8 border-t border-red-800 pt-4 text-center">
          <p>
            © {new Date().getFullYear()} Vendem Tudo. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
