import { create } from 'zustand'

type OpenFoodOptionState = {
  id?: string
  isOpen: boolean
  onOpen: (id: string) => void
  onClose: () => void
}

export const useOpenFoodOption = create<OpenFoodOptionState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: undefined }),
}))

type OpenFoodOptionDataState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useOpenFoodOptionData = create<OpenFoodOptionDataState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
