import { create } from 'zustand'

type OpenNotificationState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useNotificationOrder = create<OpenNotificationState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
