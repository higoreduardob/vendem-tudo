import { create } from 'zustand'

type NewStoreState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useNewStore = create<NewStoreState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
