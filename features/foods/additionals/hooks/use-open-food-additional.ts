import { create } from 'zustand'

type OpenFoodAdditionalState = {
  id?: string
  isOpen: boolean
  onOpen: (id: string) => void
  onClose: () => void
}

export const useOpenFoodAdditional = create<OpenFoodAdditionalState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: undefined }),
}))

type OpenFoodAdditionalDataState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useOpenFoodAdditionalData = create<OpenFoodAdditionalDataState>(
  (set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  })
)
