import { create } from 'zustand'

import { ContentDialog } from '@/components/content-dialog'
import Image from 'next/image'

type OpenCheckoutDialogState = {
  isOpen: boolean
  deadlineAt?: number
  onOpen: (deadlineAt?: number) => void
  onClose: () => void
}

export const useOpenCheckoutDialog = create<OpenCheckoutDialogState>((set) => ({
  isOpen: false,
  deadlineAt: undefined,
  onOpen: (deadlineAt?: number) => set({ isOpen: true, deadlineAt }),
  onClose: () => set({ isOpen: false }),
}))

export const CheckoutDialog = () => {
  const { isOpen, onClose, deadlineAt } = useOpenCheckoutDialog()

  return (
    <ContentDialog
      title="Pedido enviado"
      description="Pedido realizado com sucesso"
      isOpen={isOpen}
      handleClose={onClose}
      className="max-w-[90%] md:max-w-[700px]"
    >
      <div className="flex flex-col gap-2 items-center justify-center w-full">
        <div className="flex flex-col items-center gap-5">
          {deadlineAt ? (
            <div>
              <p className="text-lg text-gray-400">
                Após pronto estimativa de entrega
              </p>
              <p className="text-lg font-bold">{`Hoje, ${deadlineAt} min`}</p>
            </div>
          ) : (
            <p className="text-lg text-gray-400">
              Após pronto realizar a retirada
            </p>
          )}
          <Image src="/delivery.gif" alt="Entrega" width={300} height={300} />
        </div>
        <p className="mt-3 text-slate-600">
          Pedido enviado para a loja, aguardando loja aceitar e preparar seu
          pedido
        </p>
      </div>
    </ContentDialog>
  )
}
