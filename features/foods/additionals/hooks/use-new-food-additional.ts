import { create } from 'zustand'

type NewFoodAdditionalState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useNewFoodAdditional = create<NewFoodAdditionalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
