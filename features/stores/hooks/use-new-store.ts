import { create } from 'zustand'

type NewOwnerStoreState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useNewOwnerStore = create<NewOwnerStoreState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

type NewAdministratorStoreState = {
  isOpen: boolean
  token?: string
  password?: string
  onOpen: (token: string, password: string) => void
  onClose: () => void
}

export const useNewAdministratorStore = create<NewAdministratorStoreState>(
  (set) => ({
    isOpen: false,
    token: undefined,
    password: undefined,
    onOpen: (token: string, password: string) =>
      set({ isOpen: true, token, password }),
    onClose: () =>
      set({ isOpen: false, token: undefined, password: undefined }),
  })
)
