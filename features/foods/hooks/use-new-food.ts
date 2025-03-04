import { create } from 'zustand'

type NewFoodState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useNewFood = create<NewFoodState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
