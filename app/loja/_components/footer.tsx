import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className="flex flex-wrap items-center justify-center gap-4 py-4 text-sm text-muted-foreground">
      <span>© {new Date().getFullYear()} Vendem Tudo</span>
      <Link href="/politicas-privacidade" className="hover:text-foreground">
        Políticas de privacidade
      </Link>
      <Link href="/suporte" className="hover:text-foreground">
        Suporte
      </Link>
    </footer>
  )
}

// 'use client'

// import { useOpenStore } from '@/hooks/use-store'

// export const Footer = () => {
//   const { store } = useOpenStore()

//   return (
//     <footer className="bg-red-700 py-6 text-white">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
//           <div>
//             <h3 className="mb-4 text-lg font-bold">{store?.name}</h3>
//             <p className="text-red-100">
//               Os melhores pratos entregues na sua casa com rapidez e qualidade.
//             </p>
//           </div>
//           <div>
//             <h3 className="mb-4 text-lg font-bold">Horário de Funcionamento</h3>
//             <p className="text-red-100">Segunda a Domingo: 11h às 23h</p>

//           </div>
//           <div>
//             <h3 className="mb-4 text-lg font-bold">Contato</h3>
//             <p className="text-red-100">{store?.email}</p>
//             <p className="text-red-100">{store?.whatsApp}</p>
//           </div>
//         </div>
//         <div className="mt-8 border-t border-red-800 pt-4 text-center">
//           <p>
//             © {new Date().getFullYear()} Vendem Tudo. Todos os direitos
//             reservados.
//           </p>
//         </div>
//       </div>
//     </footer>
//   )
// }
