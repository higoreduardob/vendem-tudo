import { create } from 'zustand'

type OpenUpdateState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useOpenUpdate = create<OpenUpdateState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
