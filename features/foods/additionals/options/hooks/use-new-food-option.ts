import { create } from 'zustand'

type NewFoodOptionState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useNewFoodOption = create<NewFoodOptionState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
