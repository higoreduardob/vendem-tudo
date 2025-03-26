import { create } from 'zustand'

import { ResponseType } from '@/app/(protected)/plataforma/pedidos/_features/columns'

type OpenOrderState = {
  order?: ResponseType
  isOpen: boolean
  onOpen: (order: ResponseType) => void
  onClose: () => void
}

export const useOpenOrder = create<OpenOrderState>((set) => ({
  order: undefined,
  isOpen: false,
  onOpen: (order: ResponseType) => set({ isOpen: true, order }),
  onClose: () => set({ isOpen: false, order: undefined }),
}))
